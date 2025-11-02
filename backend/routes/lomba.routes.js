const express = require('express');
const router = express.Router();
  const {
  getLombas,
  getLombaById,
  createLomba,
  updateLomba,
  deleteLomba,
  getLombaPeserta,
} = require('../controllers/lomba.controller.js');
const auth = require('../middleware/auth.middleware.js');
const admin = require('../middleware/admin.middleware.js');

router.route('/').get(getLombas).post(auth, admin, createLomba);
router.route('/:id').get(getLombaById).put(auth, admin, updateLomba).delete(auth, admin, deleteLomba);
router.route('/:id/peserta').get(auth, admin, getLombaPeserta);

module.exports = router;
