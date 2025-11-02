const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
