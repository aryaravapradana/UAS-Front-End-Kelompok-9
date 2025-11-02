const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all lombas
// @route   GET /api/lombas
// @access  Public
exports.getLombas = async (req, res) => {
  try {
    const lombas = await prisma.lomba.findMany();
    res.status(200).json(lombas);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Get a single lomba
// @route   GET /api/lombas/:id
// @access  Public
exports.getLombaById = async (req, res) => {
  try {
    const lomba = await prisma.lomba.findUnique({ where: { id: req.params.id } });
    if (!lomba) {
      return res.status(404).json({ message: 'Lomba not found' });
    }
    res.status(200).json(lomba);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Create a lomba
// @route   POST /api/lombas
// @access  Private
exports.createLomba = async (req, res) => {
  const { nama_lomba, penyelenggara, batasan_tahun, batasan_prodi, tanggal_deadline, biaya_daftar } = req.body;

  try {
    const newLomba = await prisma.lomba.create({
      data: {
        nama_lomba,
        penyelenggara,
        batasan_tahun,
        batasan_prodi,
        tanggal_deadline: new Date(tanggal_deadline),
        biaya_daftar,
      },
    });
    res.status(201).json(newLomba);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Update a lomba
// @route   PUT /api/lombas/:id
// @access  Private
exports.updateLomba = async (req, res) => {
  try {
    const updatedLomba = await prisma.lomba.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(updatedLomba);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Delete a lomba
// @route   DELETE /api/lombas/:id
// @access  Private
exports.deleteLomba = async (req, res) => {
  try {
    await prisma.lomba.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: 'Lomba deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Get all participants for a lomba
// @route   GET /api/lombas/:id/peserta
// @access  Private/Admin
exports.getLombaPeserta = async (req, res) => {
  try {
    const peserta = await prisma.pesertaLomba.findMany({
      where: { id_lomba: req.params.id },
      include: {
        member: {
          select: {
            nim: true,
            nama_lengkap: true,
            prodi: true,
            angkatan: true,
          },
        },
      },
    });
    res.status(200).json(peserta);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
