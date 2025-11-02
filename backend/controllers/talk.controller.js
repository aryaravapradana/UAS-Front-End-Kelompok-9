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

exports.createTalk = async (req, res) => {
  const { nama_seminar, penyelenggara, tanggal_pelaksanaan, biaya_daftar, feedback_member } = req.body;

  try {
    const newTalk = await prisma.talk.create({
      data: {
        nama_seminar,
        penyelenggara,
        tanggal_pelaksanaan: new Date(tanggal_pelaksanaan),
        biaya_daftar,
        feedback_member,
      },
    });
    res.status(201).json(newTalk);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.updateTalk = async (req, res) => {
  try {
    const updatedTalk = await prisma.talk.update({
      where: { id: req.params.id },
      data: req.body,
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
