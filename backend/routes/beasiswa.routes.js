const express = require('express');
const router = express.Router();
  const upload = require('../utils/upload.js');
  const {
  getBeasiswas,
  getBeasiswaById,
  createBeasiswa,
  updateBeasiswa,
  deleteBeasiswa,
  getBeasiswaPeserta,
  uploadBeasiswaPoster,
} = require('../controllers/beasiswa.controller.js');
const auth = require('../middleware/auth.middleware.js');
const admin = require('../middleware/admin.middleware.js');

router.route('/').get(getBeasiswas).post(auth, admin, createBeasiswa);
router.route('/:id').get(getBeasiswaById).put(auth, admin, updateBeasiswa).delete(auth, admin, deleteBeasiswa);
router.route('/:id/peserta').get(auth, admin, getBeasiswaPeserta);
router.route('/:id/poster').post(auth, admin, upload.single('poster'), uploadBeasiswaPoster);

module.exports = router;
