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
    const data = {
      nama_lomba,
      penyelenggara,
      batasan_tahun,
      batasan_prodi,
      tanggal_deadline: new Date(tanggal_deadline),
      biaya_daftar: parseFloat(biaya_daftar),
    };

    if (req.file) {
      data.posterUrl = `${process.env.CLOUDFLARE_WORKER_DOMAIN}${req.file.key}`;
    }

    const newLomba = await prisma.lomba.create({ data });
    res.status(201).json(newLomba);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Update a lomba
// @route   PUT /api/lombas/:id
// @access  Private
exports.updateLomba = async (req, res) => {
  const { nama_lomba, penyelenggara, batasan_tahun, batasan_prodi, tanggal_deadline, biaya_daftar } = req.body;
  const { id } = req.params;

  try {
    const dataToUpdate = {};

    if (nama_lomba) dataToUpdate.nama_lomba = nama_lomba;
    if (penyelenggara) dataToUpdate.penyelenggara = penyelenggara;
    if (batasan_tahun) dataToUpdate.batasan_tahun = batasan_tahun;
    if (batasan_prodi) dataToUpdate.batasan_prodi = batasan_prodi;
    if (tanggal_deadline) dataToUpdate.tanggal_deadline = new Date(tanggal_deadline);
    if (biaya_daftar) dataToUpdate.biaya_daftar = parseFloat(biaya_daftar);

    if (req.file) {
      dataToUpdate.posterUrl = `${process.env.CLOUDFLARE_WORKER_DOMAIN}${req.file.key}`;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ message: 'No update data provided.' });
    }

    const updatedLomba = await prisma.lomba.update({
      where: { id },
      data: dataToUpdate,
    });
    res.status(200).json(updatedLomba);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: `Lomba with ID ${id} not found.` });
    }
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
    if (error.code === 'P2025') {
      return res.status(404).json({ message: `Lomba with ID ${req.params.id} not found.` });
    }
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
