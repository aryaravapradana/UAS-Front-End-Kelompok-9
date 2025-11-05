const express = require('express');
const router = express.Router();
  const upload = require('../utils/upload.js');
  const {
  getLombas,
  getLombaById,
  createLomba,
  updateLomba,
  deleteLomba,
  getLombaPeserta,
  uploadLombaPoster,
} = require('../controllers/lomba.controller.js');
const auth = require('../middleware/auth.middleware.js');
const admin = require('../middleware/admin.middleware.js');

router.route('/').get(getLombas).post(auth, admin, createLomba);
router.route('/:id').get(getLombaById).put(auth, admin, updateLomba).delete(auth, admin, deleteLomba);
router.route('/:id/peserta').get(auth, admin, getLombaPeserta);
router.route('/:id/poster').post(auth, admin, upload.single('poster'), uploadLombaPoster);

module.exports = router;
