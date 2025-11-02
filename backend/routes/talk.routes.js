const express = require('express');
const router = express.Router();
const {
  getTalks,
  getTalkById,
  createTalk,
  updateTalk,
  deleteTalk,
} = require('../controllers/talk.controller.js');
const auth = require('../middleware/auth.middleware.js');

  deleteTalk,
  getTalkPeserta,
} = require('../controllers/talk.controller.js');
const auth = require('../middleware/auth.middleware.js');
const admin = require('../middleware/admin.middleware.js');

router.route('/').get(getTalks).post(auth, admin, createTalk);
router.route('/:id').get(getTalkById).put(auth, admin, updateTalk).delete(auth, admin, deleteTalk);
router.route('/:id/peserta').get(auth, admin, getTalkPeserta);

module.exports = router;
