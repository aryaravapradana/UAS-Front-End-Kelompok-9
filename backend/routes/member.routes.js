const express = require('express');
const router = express.Router();
const {
  registerLomba,
  getMemberLombas,
  registerBeasiswa,
  getMemberBeasiswas,
  registerTalk,
  getMemberTalks,
  registerBootcamp,
  getMemberBootcamps,
} = require('../controllers/member.controller.js');
const auth = require('../middleware/auth.middleware.js');

// Lomba registration and profile
router.post('/lombas/:id/register', auth, registerLomba);
router.get('/profile/lombas', auth, getMemberLombas);

// Beasiswa registration and profile
router.post('/beasiswas/:id/register', auth, registerBeasiswa);
router.get('/profile/beasiswas', auth, getMemberBeasiswas);

// Talk registration and profile
router.post('/talks/:id/register', auth, registerTalk);
router.get('/profile/talks', auth, getMemberTalks);

// Bootcamp registration and profile
router.post('/bootcamps/:id/register', auth, registerBootcamp);
router.get('/profile/bootcamps', auth, getMemberBootcamps);

module.exports = router;
