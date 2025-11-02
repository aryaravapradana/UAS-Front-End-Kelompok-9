const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Register for a lomba
// @route   POST /api/lombas/:id/register
// @access  Private
exports.registerLomba = async (req, res) => {
  try {
    const { nim } = req.member; // from auth middleware
    const lombaId = req.params.id;

    const existingRegistration = await prisma.pesertaLomba.findFirst({
      where: { nim: nim, id_lomba: lombaId },
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this lomba.' });
    }

    const newRegistration = await prisma.pesertaLomba.create({
      data: {
        nim: nim,
        id_lomba: lombaId,
        tanggal_daftar: new Date(),
      },
    });

    res.status(201).json(newRegistration);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Get lombas for a member
// @route   GET /api/profile/lombas
// @access  Private
exports.getMemberLombas = async (req, res) => {
  try {
    const { nim } = req.member;
    const memberLombas = await prisma.pesertaLomba.findMany({
      where: { nim: nim },
      include: { lomba: true },
    });
    res.status(200).json(memberLombas);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Beasiswa
exports.registerBeasiswa = async (req, res) => {
  try {
    const { nim } = req.member;
    const beasiswaId = req.params.id;

    const existingRegistration = await prisma.pesertaBeasiswa.findFirst({
      where: { nim: nim, beasiswa: { id: beasiswaId } },
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this beasiswa.' });
    }

    const newRegistration = await prisma.pesertaBeasiswa.create({
      data: {
        nim: nim,
        nama_beasiswa: (await prisma.beasiswa.findUnique({ where: { id: beasiswaId } })).nama_beasiswa,
        tanggal_daftar: new Date(),
      },
    });

    res.status(201).json(newRegistration);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.getMemberBeasiswas = async (req, res) => {
  try {
    const { nim } = req.member;
    const memberBeasiswas = await prisma.pesertaBeasiswa.findMany({
      where: { nim: nim },
      include: { beasiswa: true },
    });
    res.status(200).json(memberBeasiswas);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Talk
exports.registerTalk = async (req, res) => {
  try {
    const { nim } = req.member;
    const talkId = req.params.id;

    const existingRegistration = await prisma.pesertaTalk.findFirst({
      where: { nim: nim, id_talk: talkId },
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this talk.' });
    }

    const newRegistration = await prisma.pesertaTalk.create({
      data: {
        nim: nim,
        id_talk: talkId,
        tanggal_daftar: new Date(),
      },
    });

    res.status(201).json(newRegistration);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.getMemberTalks = async (req, res) => {
  try {
    const { nim } = req.member;
    const memberTalks = await prisma.pesertaTalk.findMany({
      where: { nim: nim },
      include: { talk: true },
    });
    res.status(200).json(memberTalks);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Bootcamp
exports.registerBootcamp = async (req, res) => {
  try {
    const { nim } = req.member;
    const bootcampId = req.params.id;

    const existingRegistration = await prisma.pesertaBootcamp.findFirst({
      where: { nim: nim, id_bootcamp: bootcampId },
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this bootcamp.' });
    }

    const newRegistration = await prisma.pesertaBootcamp.create({
      data: {
        nim: nim,
        id_bootcamp: bootcampId,
        tanggal_daftar: new Date(),
      },
    });

    res.status(201).json(newRegistration);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.getMemberBootcamps = async (req, res) => {
  try {
    const { nim } = req.member;
    const memberBootcamps = await prisma.pesertaBootcamp.findMany({
      where: { nim: nim },
      include: { bootcamp: true },
    });
    res.status(200).json(memberBootcamps);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
