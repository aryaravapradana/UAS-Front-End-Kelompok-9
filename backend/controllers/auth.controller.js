const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/mailer');

const prisma = new PrismaClient();

// Function to derive prodi from NIM
const getProdi = (nim) => {
  const prodiCode = nim.substring(0, 3);
  const prodiMap = {
    '535': 'Teknik Informatika',
    '825': 'Sistem Informasi',
    // Add other prodi codes here
  };
  return prodiMap[prodiCode] || 'Lainnya';
};

// Function to derive angkatan from NIM
const getAngkatan = (nim) => {
  return nim.substring(3, 5);
};

exports.register = async (req, res) => {
  const { nim, password, nama_lengkap } = req.body;

  if (!nim || !password || !nama_lengkap) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  // NIM validation
  const nimRegex = /^(535|825)\d{6}$/;
  if (!nimRegex.test(nim)) {
    return res.status(400).json({ message: 'Invalid NIM format. NIM must be 9 digits and start with 535 or 825.' });
  }

  try {
    const existingMember = await prisma.member.findUnique({ where: { nim } });
    if (existingMember) {
      return res.status(400).json({ message: 'Member with this NIM already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const prodi = getProdi(nim);
    const angkatan = getAngkatan(nim);

    const newMember = await prisma.member.create({
      data: {
        nim,
        password: hashedPassword,
        nama_lengkap,
        prodi,
        angkatan,
      },
    });

    res.status(201).json({ message: 'Member registered successfully', member: newMember });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { nim, password } = req.body;

  if (!nim || !password) {
    return res.status(400).json({ message: 'Please provide NIM and password.' });
  }

  try {
    const member = await prisma.member.findUnique({ where: { nim } });

    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, member.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ nim: member.nim, id: member.id, role: member.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ result: member, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).redirect(`${process.env.FRONTEND_URL}/auth/verify-result?success=false&message=Invalid verification link.`);
  }

  try {
    const member = await prisma.member.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!member) {
      return res.status(400).redirect(`${process.env.FRONTEND_URL}/auth/verify-result?success=false&message=Invalid or expired verification link.`);
    }

    await prisma.member.update({
      where: { id: member.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null, // Clear the token
      },
    });

    res.redirect(`${process.env.FRONTEND_URL}/auth/verify-result?success=true`);
  } catch (error) {
    res.status(500).redirect(`${process.env.FRONTEND_URL}/auth/verify-result?success=false&message=An error occurred.`);
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    const member = await prisma.member.findUnique({ where: { nim: req.member.nim } });

    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    if (member.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified.' });
    }

    if (!member.email) {
      return res.status(400).json({ message: 'No email address found for this account.' });
    }

    // Ensure there's a token
    const verificationToken = member.emailVerificationToken || crypto.randomBytes(32).toString('hex');
    
    await prisma.member.update({
        where: { nim: req.member.nim },
        data: { emailVerificationToken: verificationToken }
    });

    await sendVerificationEmail(member.email, verificationToken);

    res.status(200).json({ message: 'Verification email sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const member = await prisma.member.findUnique({ where: { email } });

    if (!member) {
      // Don't reveal that the user doesn't exist.
      // Send a success response to prevent user enumeration.
      return res.status(200).json({ message: 'If an account with this email exists, a password reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.member.update({
      where: { email },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: passwordResetExpires,
      },
    });

    await sendPasswordResetEmail(member.email, resetToken);

    res.status(200).json({ message: 'If an account with this email exists, a password reset link has been sent.' });
  } catch (error) {
    // Generic error message
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required.' });
  }

  try {
    const member = await prisma.member.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: { gt: new Date() }, // Check if the token has not expired
      },
    });

    if (!member) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.member.update({
      where: { id: member.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

