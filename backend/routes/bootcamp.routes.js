const express = require('express');
const router = express.Router();
const upload = require('../utils/upload.js');
const {
  getBootcamps,
  getBootcampById,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampPeserta,
  uploadBootcampPoster,
  registerBootcamp,
} = require('../controllers/bootcamp.controller.js');
const auth = require('../middleware/auth.middleware.js');
const admin = require('../middleware/admin.middleware.js');

router.route('/').get(getBootcamps).post(auth, admin, upload.single('poster'), createBootcamp);
router.route('/:id').get(getBootcampById).put(auth, admin, upload.single('poster'), updateBootcamp).delete(auth, admin, deleteBootcamp);
router.route('/:id/peserta').get(auth, admin, getBootcampPeserta);
router.route('/:id/register').post(auth, registerBootcamp);

module.exports = router;
