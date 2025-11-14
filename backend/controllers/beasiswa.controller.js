const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getBeasiswas = async (req, res) => {
  try {
    const beasiswas = await prisma.beasiswa.findMany();
    res.status(200).json(beasiswas);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.getBeasiswaById = async (req, res) => {
  try {
    const beasiswa = await prisma.beasiswa.findUnique({ where: { id: req.params.id } });
    if (!beasiswa) {
      return res.status(404).json({ message: 'Beasiswa not found' });
    }
    res.status(200).json(beasiswa);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.createBeasiswa = async (req, res) => {
  const { nama_beasiswa, penyelenggara, batasan_tahun, batasan_prodi, tanggal_deadline, biaya_daftar } = req.body;

  try {
    const newBeasiswa = await prisma.beasiswa.create({
      data: {
        nama_beasiswa,
        penyelenggara,
        batasan_tahun,
        batasan_prodi,
        tanggal_deadline: new Date(tanggal_deadline),
        biaya_daftar,
      },
    });
    res.status(201).json(newBeasiswa);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.updateBeasiswa = async (req, res) => {
  const { tanggal_deadline, ...restOfData } = req.body;
  const dataToUpdate = { ...restOfData };

  if (tanggal_deadline) {
    dataToUpdate.tanggal_deadline = new Date(tanggal_deadline);
  }

  // Pastikan biaya_daftar adalah angka
  if (dataToUpdate.biaya_daftar) {
    dataToUpdate.biaya_daftar = parseFloat(dataToUpdate.biaya_daftar);
  }

  try {
    const updatedBeasiswa = await prisma.beasiswa.update({
      where: { id: req.params.id },
      data: dataToUpdate,
    });
    res.status(200).json(updatedBeasiswa);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.deleteBeasiswa = async (req, res) => {
  try {
    await prisma.beasiswa.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: 'Beasiswa deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Get all participants for a beasiswa
// @route   GET /api/beasiswas/:id/peserta
// @access  Private/Admin
exports.getBeasiswaPeserta = async (req, res) => {
  try {
    const beasiswa = await prisma.beasiswa.findUnique({ where: { id: req.params.id } });
    if (!beasiswa) {
      return res.status(404).json({ message: 'Beasiswa not found' });
    }

    const peserta = await prisma.pesertaBeasiswa.findMany({
      where: { nama_beasiswa: beasiswa.nama_beasiswa },
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

// @desc    Upload beasiswa poster
// @route   POST /api/beasiswas/:id/poster
// @access  Private/Admin
exports.uploadBeasiswaPoster = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const posterUrl = req.file.location; // URL from Cloudflare R2

    const updatedBeasiswa = await prisma.beasiswa.update({
      where: { id: req.params.id },
      data: { posterUrl: posterUrl },
    });

    res.status(200).json({
      message: 'Beasiswa poster uploaded successfully',
      posterUrl: updatedBeasiswa.posterUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
