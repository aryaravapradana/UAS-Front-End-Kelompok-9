const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth.middleware');

// Generate unique team code
function generateTeamCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TEAM-${code}`;
}

// POST /api/lombas/:id/register-solo - Register for solo competition
router.post('/:id/register-solo', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { nim } = req.member;

    // Check if lomba exists and is solo
    const lomba = await prisma.lomba.findUnique({
      where: { id },
    });

    if (!lomba) {
      return res.status(404).json({ message: 'Competition not found' });
    }

    if (lomba.max_anggota !== 1) {
      return res.status(400).json({ message: 'This is not a solo competition' });
    }

    // Check if already registered
    const existing = await prisma.pesertaLomba.findUnique({
      where: {
        nim_id_lomba: {
          nim,
          id_lomba: id,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ message: 'Already registered for this competition' });
    }

    // Create registration
    const registration = await prisma.pesertaLomba.create({
      data: {
        nim,
        id_lomba: id,
        tanggal_daftar: new Date(),
        is_team: false,
        is_leader: true, // Solo participant is their own "leader"
      },
    });

    res.status(201).json({
      message: 'Successfully registered for solo competition',
      registration,
    });
  } catch (error) {
    console.error('Error in solo registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/lombas/:id/create-team - Create team and register as leader
router.post('/:id/create-team', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { nim } = req.member;
    const { nama_tim } = req.body;

    if (!nama_tim || nama_tim.trim() === '') {
      return res.status(400).json({ message: 'Team name is required' });
    }

    // Check if lomba exists and is team-based
    const lomba = await prisma.lomba.findUnique({
      where: { id },
    });

    if (!lomba) {
      return res.status(404).json({ message: 'Competition not found' });
    }

    if (lomba.max_anggota === 1) {
      return res.status(400).json({ message: 'This is a solo competition' });
    }

    // Check if already registered
    const existing = await prisma.pesertaLomba.findUnique({
      where: {
        nim_id_lomba: {
          nim,
          id_lomba: id,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ message: 'Already registered for this competition' });
    }

    // Generate unique team code
    let kode_tim;
    let isUnique = false;
    
    while (!isUnique) {
      kode_tim = generateTeamCode();
      const existingCode = await prisma.pesertaLomba.findFirst({
        where: {
          id_lomba: id,
          kode_tim,
        },
      });
      if (!existingCode) {
        isUnique = true;
      }
    }

    // Create team registration
    const registration = await prisma.pesertaLomba.create({
      data: {
        nim,
        id_lomba: id,
        tanggal_daftar: new Date(),
        is_team: true,
        nama_tim: nama_tim.trim(),
        kode_tim,
        is_leader: true,
      },
    });

    res.status(201).json({
      message: 'Team created successfully',
      registration,
      team_code: kode_tim,
    });
  } catch (error) {
    console.error('Error in team creation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/lombas/:id/join-team - Join existing team with code
router.post('/:id/join-team', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { nim } = req.member;
    const { kode_tim } = req.body;

    if (!kode_tim || kode_tim.trim() === '') {
      return res.status(400).json({ message: 'Team code is required' });
    }

    // Check if lomba exists
    const lomba = await prisma.lomba.findUnique({
      where: { id },
    });

    if (!lomba) {
      return res.status(404).json({ message: 'Competition not found' });
    }

    // Check if already registered
    const existing = await prisma.pesertaLomba.findUnique({
      where: {
        nim_id_lomba: {
          nim,
          id_lomba: id,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ message: 'Already registered for this competition' });
    }

    // Find team by code
    const team = await prisma.pesertaLomba.findFirst({
      where: {
        id_lomba: id,
        kode_tim: kode_tim.trim(),
        is_team: true,
      },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team code not found' });
    }

    // Check if team is full
    const teamMembers = await prisma.pesertaLomba.count({
      where: {
        id_lomba: id,
        kode_tim: kode_tim.trim(),
      },
    });

    if (teamMembers >= lomba.max_anggota) {
      return res.status(400).json({ message: 'Team is full' });
    }

    // Join team
    const registration = await prisma.pesertaLomba.create({
      data: {
        nim,
        id_lomba: id,
        tanggal_daftar: new Date(),
        is_team: true,
        nama_tim: team.nama_tim,
        kode_tim: kode_tim.trim(),
        is_leader: false,
      },
    });

    res.status(201).json({
      message: 'Successfully joined team',
      registration,
      team_name: team.nama_tim,
    });
  } catch (error) {
    console.error('Error in joining team:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
