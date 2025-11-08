const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getBootcamps = async (req, res) => {
  try {
    const bootcamps = await prisma.bootcamp.findMany();
    res.status(200).json(bootcamps);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.getBootcampById = async (req, res) => {
  try {
    const bootcamp = await prisma.bootcamp.findUnique({ where: { id: req.params.id } });
    if (!bootcamp) {
      return res.status(404).json({ message: 'Bootcamp not found' });
    }
    res.status(200).json(bootcamp);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const R2_HOSTNAME = 'uccd.3760decf39ba4d09d0252a7a33b7d78b.r2.cloudflarestorage.com';
const WORKER_HOSTNAME = 'uccdphoto.aryaravathird.workers.dev';

const transformUrl = (url) => {
  if (!url) return null;
  const urlObject = new URL(url);
  if (urlObject.hostname === R2_HOSTNAME) {
    urlObject.hostname = WORKER_HOSTNAME;
    return urlObject.toString();
  }
  return url;
};

exports.createBootcamp = async (req, res) => {
  const { nama_bootcamp, penyelenggara, tanggal_deadline, biaya_daftar } = req.body;
  let posterUrl = req.file ? req.file.location : null;
  posterUrl = transformUrl(posterUrl);

  try {
    const newBootcamp = await prisma.bootcamp.create({
      data: {
        nama_bootcamp,
        penyelenggara,
        tanggal_deadline: new Date(tanggal_deadline),
        biaya_daftar: biaya_daftar ? parseFloat(biaya_daftar) : null,
        posterUrl,
      },
    });
    res.status(201).json(newBootcamp);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.updateBootcamp = async (req, res) => {
  const { nama_bootcamp, penyelenggara, tanggal_deadline, biaya_daftar } = req.body;
  let dataToUpdate = {
    nama_bootcamp,
    penyelenggara,
    tanggal_deadline: tanggal_deadline ? new Date(tanggal_deadline) : undefined,
    biaya_daftar: biaya_daftar ? parseFloat(biaya_daftar) : undefined,
  };

  if (req.file) {
    dataToUpdate.posterUrl = transformUrl(req.file.location);
  }

  try {
    const updatedBootcamp = await prisma.bootcamp.update({
      where: { id: req.params.id },
      data: dataToUpdate,
    });
    res.status(200).json(updatedBootcamp);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.deleteBootcamp = async (req, res) => {
  try {
    await prisma.bootcamp.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: 'Bootcamp deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Get all participants for a bootcamp
// @route   GET /api/bootcamps/:id/peserta
// @access  Private/Admin
exports.getBootcampPeserta = async (req, res) => {
  try {
    const peserta = await prisma.pesertaBootcamp.findMany({
      where: { id_bootcamp: req.params.id },
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

exports.registerBootcamp = async (req, res) => {
  const { id: id_bootcamp } = req.params;
  const { nim } = req.member;

  try {
    // Check if the user is already registered
    const existingRegistration = await prisma.pesertaBootcamp.findFirst({
      where: {
        id_bootcamp,
        nim,
      },
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this bootcamp' });
    }

    // Create new registration
    const newRegistration = await prisma.pesertaBootcamp.create({
      data: {
        id_bootcamp,
        nim,
        tanggal_daftar: new Date(),
        status_pembayaran: 'unpaid', // or 'paid' if free/handled differently
        status_hasil: 'pending',
      },
    });

    res.status(201).json({ message: 'Successfully registered for the bootcamp', registration: newRegistration });
  } catch (error) {
    console.error(error);
    // Handle specific Prisma errors if needed, e.g., foreign key constraint
    if (error.code === 'P2003') { // Foreign key constraint failed
      return res.status(404).json({ message: 'Bootcamp or Member not found' });
    }
    res.status(500).json({ message: 'Something went wrong during registration', error: error.message });
  }
};

// @desc    Upload bootcamp poster
// @route   POST /api/bootcamps/:id/poster
// @access  Private/Admin
exports.uploadBootcampPoster = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const posterUrl = req.file.location; // URL from Cloudflare R2

    const updatedBootcamp = await prisma.bootcamp.update({
      where: { id: req.params.id },
      data: { posterUrl: posterUrl },
    });

    res.status(200).json({
      message: 'Bootcamp poster uploaded successfully',
      posterUrl: updatedBootcamp.posterUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
