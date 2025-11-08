const express = require('express');
const router = express.Router();
const upload = require('../utils/upload.js');
const {
  getTalks,
  getTalkById,
  createTalk,
  updateTalk,
  deleteTalk,
  getTalkPeserta,
  uploadTalkPoster,
} = require('../controllers/talk.controller.js');
const auth = require('../middleware/auth.middleware.js');
const admin = require('../middleware/admin.middleware.js');

router.route('/').get(getTalks).post(auth, admin, upload.single('poster'), createTalk);
router.route('/:id').get(getTalkById).put(auth, admin, upload.single('poster'), updateTalk).delete(auth, admin, deleteTalk);
router.route('/:id/peserta').get(auth, admin, getTalkPeserta);

module.exports = router;
