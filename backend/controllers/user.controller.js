const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/mailer');
const prisma = new PrismaClient();

// @desc    Get logged in member's profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const member = await prisma.member.findUnique({ where: { nim: req.member.nim } });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Update logged in member's profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  const { nama_lengkap, email, currentPassword, newPassword } = req.body;
  try {
    const member = await prisma.member.findUnique({ where: { nim: req.member.nim } });
    const dataToUpdate = {};
    let emailChanged = false;

    if (nama_lengkap && nama_lengkap !== member.nama_lengkap) {
      dataToUpdate.nama_lengkap = nama_lengkap;
    }

    if (email && email !== member.email) {
      dataToUpdate.email = email;
      dataToUpdate.isEmailVerified = false;
      dataToUpdate.emailVerificationToken = crypto.randomBytes(32).toString('hex');
      emailChanged = true;
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change password' });
      }
      const isMatch = await bcrypt.compare(currentPassword, member.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect current password' });
      }
      dataToUpdate.password = await bcrypt.hash(newPassword, 12);
    }
    
    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(200).json({ message: 'No changes provided' });
    }

    const updatedMember = await prisma.member.update({
      where: { nim: req.member.nim },
      data: dataToUpdate,
    });

    if (emailChanged) {
      await sendVerificationEmail(updatedMember.email, updatedMember.emailVerificationToken);
    }

    const { password, ...memberWithoutPassword } = updatedMember;
    res.status(200).json(memberWithoutPassword);
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ message: 'Email address is already in use.' });
    }
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// --- ADMIN ONLY --- //

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.member.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Get user by NIM
// @route   GET /api/users/:nim
// @access  Private/Admin
exports.getUserByNim = async (req, res) => {
  try {
    const user = await prisma.member.findUnique({ where: { nim: req.params.nim } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  const { nim, password, nama_lengkap, role } = req.body;

  if (!nim || !password || !nama_lengkap) {
    return res.status(400).json({ message: 'Please provide nim, password, and nama_lengkap.' });
  }

  // NIM validation
  const nimRegex = /^(535|825)\d{6}$/;
  if (!nimRegex.test(nim)) {
    return res.status(400).json({ message: 'Invalid NIM format. NIM must be 9 digits and start with 535 or 825.' });
  }

  try {
    const existingMember = await prisma.member.findUnique({ where: { nim } });
    if (existingMember) {
      return res.status(409).json({ message: 'Member with this NIM already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Helper functions to derive prodi and angkatan from NIM
    const getProdi = (nim) => {
      const prodiCode = nim.substring(0, 3);
      return prodiCode === '535' ? 'Teknik Informatika' : prodiCode === '825' ? 'Sistem Informasi' : 'Lainnya';
    };
    const getAngkatan = (nim) => nim.substring(3, 5);

    const prodi = getProdi(nim);
    const angkatan = getAngkatan(nim);

    const data = {
      nim,
      password: hashedPassword,
      nama_lengkap,
      prodi,
      angkatan,
      role: role || 'user',
    };

    if (req.file) {
      data.profilePictureUrl = `${process.env.CLOUDFLARE_WORKER_DOMAIN}${req.file.key}`;
    }

    const newUser = await prisma.member.create({ data });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:nim
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  const { nama_lengkap, role, password, email } = req.body;
  const { nim } = req.params;

  try {
    const member = await prisma.member.findUnique({ where: { nim } });
    if (!member) {
      return res.status(404).json({ message: `User with NIM ${nim} not found.` });
    }

    const dataToUpdate = {};
    let emailChanged = false;

    if (nama_lengkap && nama_lengkap !== member.nama_lengkap) {
      dataToUpdate.nama_lengkap = nama_lengkap;
    }
    if (role && role !== member.role) {
      dataToUpdate.role = role;
    }
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 12);
    }
    if (email !== undefined && email !== member.email) { // Check if email is provided and different
      if (email === null || email === '') { // If email is explicitly set to null or empty
        dataToUpdate.email = null;
        dataToUpdate.isEmailVerified = false;
        dataToUpdate.emailVerificationToken = null;
      } else {
        dataToUpdate.email = email;
        dataToUpdate.isEmailVerified = false;
        dataToUpdate.emailVerificationToken = crypto.randomBytes(32).toString('hex');
        emailChanged = true;
      }
    }
    if (req.file) {
      dataToUpdate.profilePictureUrl = `${process.env.CLOUDFLARE_WORKER_DOMAIN}${req.file.key}`;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(200).json({ message: 'No update data provided.' });
    }

    const updatedUser = await prisma.member.update({
      where: { nim },
      data: dataToUpdate,
    });

    if (emailChanged) {
      await sendVerificationEmail(updatedUser.email, updatedUser.emailVerificationToken);
    }

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ message: 'Email address is already in use by another user.' });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ message: `User with NIM ${nim} not found.` });
    }
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Delete user email
// @route   DELETE /api/users/:nim/email
// @access  Private/Admin
exports.deleteUserEmail = async (req, res) => {
  const { nim } = req.params;

  try {
    const member = await prisma.member.findUnique({ where: { nim } });
    if (!member) {
      return res.status(404).json({ message: `User with NIM ${nim} not found.` });
    }

    if (!member.email) {
      return res.status(200).json({ message: 'User does not have an email to delete.' });
    }

    const updatedUser = await prisma.member.update({
      where: { nim },
      data: {
        email: null,
        isEmailVerified: false,
        emailVerificationToken: null,
      },
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json({ message: 'User email deleted successfully', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:nim
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    await prisma.member.delete({ where: { nim: req.params.nim } });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Get all lombas for a specific member (Admin only)
// @route   GET /api/users/:nim/lombas
// @access  Private/Admin
exports.getMemberLombasForAdmin = async (req, res) => {
  try {
    const { nim } = req.params;
    const memberLombas = await prisma.pesertaLomba.findMany({
      where: { nim: nim },
      include: { lomba: true },
    });
    res.status(200).json(memberLombas);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Get all beasiswas for a specific member (Admin only)
// @route   GET /api/users/:nim/beasiswas
// @access  Private/Admin
exports.getMemberBeasiswasForAdmin = async (req, res) => {
  try {
    const { nim } = req.params;
    const memberBeasiswas = await prisma.pesertaBeasiswa.findMany({
      where: { nim: nim },
      include: { beasiswa: true },
    });
    res.status(200).json(memberBeasiswas);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Get all talks for a specific member (Admin only)
// @route   GET /api/users/:nim/talks
// @access  Private/Admin
exports.getMemberTalksForAdmin = async (req, res) => {
  try {
    const { nim } = req.params;
    const memberTalks = await prisma.pesertaTalk.findMany({
      where: { nim: nim },
      include: { talk: true },
    });
    res.status(200).json(memberTalks);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Get all bootcamps for a specific member (Admin only)
// @route   GET /api/users/:nim/bootcamps
// @access  Private/Admin
exports.getMemberBootcampsForAdmin = async (req, res) => {
  try {
    const { nim } = req.params;
    const memberBootcamps = await prisma.pesertaBootcamp.findMany({
      where: { nim: nim },
      include: { bootcamp: true },
    });
    res.status(200).json(memberBootcamps);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Upload member profile picture
// @route   POST /api/profile/picture
// @access  Private
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const profilePictureUrl = `${process.env.CLOUDFLARE_WORKER_DOMAIN}${req.file.key}`; // URL from Cloudflare R2 Worker

    const updatedMember = await prisma.member.update({
      where: { nim: req.member.nim },
      data: { profilePictureUrl: profilePictureUrl },
    });

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      profilePictureUrl: updatedMember.profilePictureUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Get a user's full details and activities (Admin only)
// @route   GET /api/users/:nim/details
// @access  Private/Admin
exports.getMemberDetails = async (req, res) => {
  const { nim } = req.params;
  try {
    const memberDetails = await prisma.member.findUnique({
      where: { nim },
      include: {
        lombas: {
          orderBy: { createdAt: 'desc' },
          include: { lomba: true },
        },
        beasiswas: {
          orderBy: { createdAt: 'desc' },
          include: { beasiswa: true },
        },
        talks: {
          orderBy: { createdAt: 'desc' },
          include: { talk: true },
        },
        bootcamps: {
          orderBy: { createdAt: 'desc' },
          include: { bootcamp: true },
        },
      },
    });

    if (!memberDetails) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json(memberDetails);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};