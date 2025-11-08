const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, resendVerificationEmail } = require('../controllers/auth.controller.js');
const auth = require('../middleware/auth.middleware.js');

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', auth, resendVerificationEmail);

module.exports = router;
