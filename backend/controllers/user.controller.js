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

// @desc    Update user
// @route   PUT /api/users/:nim
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await prisma.member.update({
      where: { nim: req.params.nim },
      data: req.body, // Allows admin to update any field, including role
    });
    res.status(200).json(updatedUser);
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