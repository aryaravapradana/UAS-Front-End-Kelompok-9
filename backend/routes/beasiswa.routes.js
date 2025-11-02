const express = require('express');
const router = express.Router();
  const {
  getBeasiswas,
  getBeasiswaById,
  createBeasiswa,
  updateBeasiswa,
  deleteBeasiswa,
  getBeasiswaPeserta,
} = require('../controllers/beasiswa.controller.js');
const auth = require('../middleware/auth.middleware.js');
const admin = require('../middleware/admin.middleware.js');

router.route('/').get(getBeasiswas).post(auth, admin, createBeasiswa);
router.route('/:id').get(getBeasiswaById).put(auth, admin, updateBeasiswa).delete(auth, admin, deleteBeasiswa);
router.route('/:id/peserta').get(auth, admin, getBeasiswaPeserta);

module.exports = router;
