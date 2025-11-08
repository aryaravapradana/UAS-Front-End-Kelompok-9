const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getTalks = async (req, res) => {
  try {
    const talks = await prisma.talk.findMany();
    res.status(200).json(talks);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.getTalkById = async (req, res) => {
  try {
    const talk = await prisma.talk.findUnique({ where: { id: req.params.id } });
    if (!talk) {
      return res.status(404).json({ message: 'Talk not found' });
    }
    res.status(200).json(talk);
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

exports.createTalk = async (req, res) => {
  const { nama_seminar, penyelenggara, tanggal_pelaksanaan, biaya_daftar, feedback_member } = req.body;
  let posterUrl = req.file ? req.file.location : null;
  posterUrl = transformUrl(posterUrl);

  try {
    const newTalk = await prisma.talk.create({
      data: {
        nama_seminar,
        penyelenggara,
        tanggal_pelaksanaan: new Date(tanggal_pelaksanaan),
        biaya_daftar: biaya_daftar ? parseFloat(biaya_daftar) : null,
        feedback_member,
        posterUrl,
      },
    });
    res.status(201).json(newTalk);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.updateTalk = async (req, res) => {
  const { nama_seminar, penyelenggara, tanggal_pelaksanaan, biaya_daftar, feedback_member } = req.body;
  let dataToUpdate = {
    nama_seminar,
    penyelenggara,
    tanggal_pelaksanaan: tanggal_pelaksanaan ? new Date(tanggal_pelaksanaan) : undefined,
    biaya_daftar: biaya_daftar ? parseFloat(biaya_daftar) : undefined,
    feedback_member,
  };

  if (req.file) {
    dataToUpdate.posterUrl = transformUrl(req.file.location);
  }

  try {
    const updatedTalk = await prisma.talk.update({
      where: { id: req.params.id },
      data: dataToUpdate,
    });
    res.status(200).json(updatedTalk);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.deleteTalk = async (req, res) => {
  try {
    await prisma.talk.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: 'Talk deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Get all participants for a talk
// @route   GET /api/talks/:id/peserta
// @access  Private/Admin
exports.getTalkPeserta = async (req, res) => {
  try {
    const peserta = await prisma.pesertaTalk.findMany({
      where: { id_talk: req.params.id },
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

// @desc    Upload talk poster
// @route   POST /api/talks/:id/poster
// @access  Private/Admin
exports.uploadTalkPoster = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const posterUrl = req.file.location; // URL from Cloudflare R2

    const updatedTalk = await prisma.talk.update({
      where: { id: req.params.id },
      data: { posterUrl: posterUrl },
    });

    res.status(200).json({
      message: 'Talk poster uploaded successfully',
      posterUrl: updatedTalk.posterUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
