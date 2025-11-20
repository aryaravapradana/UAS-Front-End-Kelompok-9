const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth.middleware');

// GET /api/events/:type/:id/team - Get team members for an event
router.get('/:type/:id/team', auth, async (req, res) => {
  try {
    const { type, id } = req.params;
    const { nim } = req.member;

    let teamMembers = [];
    let userRegistration = null;

    // Only Lomba supports teams currently
    if (type.toLowerCase() === 'lomba') {
      // Find user's registration
      userRegistration = await prisma.pesertaLomba.findUnique({
        where: {
          nim_id_lomba: {
            nim,
            id_lomba: id,
          },
        },
      });

      if (!userRegistration) {
        return res.status(404).json({ message: 'Registration not found' });
      }

      // If it's a team event, get all team members
      if (userRegistration.is_team && userRegistration.kode_tim) {
        const members = await prisma.pesertaLomba.findMany({
          where: {
            id_lomba: id,
            kode_tim: userRegistration.kode_tim,
          },
          include: {
            member: {
              select: {
                nim: true,
                nama_lengkap: true,
                prodi: true,
                angkatan: true,
                profilePictureUrl: true,
              },
            },
          },
          orderBy: [
            { is_leader: 'desc' }, // Leader first
            { createdAt: 'asc' },  // Then by join date
          ],
        });

        teamMembers = members.map(m => ({
          nim: m.member.nim,
          nama_lengkap: m.member.nama_lengkap,
          prodi: m.member.prodi,
          angkatan: m.member.angkatan,
          profilePictureUrl: m.member.profilePictureUrl,
          is_leader: m.is_leader,
          joined_at: m.createdAt,
        }));
      }
    }

    res.json({
      is_team: userRegistration?.is_team || false,
      team_name: userRegistration?.nama_tim || null,
      team_code: userRegistration?.kode_tim || null,
      team_members: teamMembers,
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
