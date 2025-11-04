const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserByNim,
  updateUser,
  deleteUser,
  upload, // Multer upload instance
  updateAvatar, // Controller for avatar update
  getMemberLombasForAdmin,
  getMemberBeasiswasForAdmin,
  getMemberTalksForAdmin,
  getMemberBootcampsForAdmin,
} = require('../controllers/user.controller.js');
const auth = require('../middleware/auth.middleware.js');
const admin = require('../middleware/admin.middleware.js');

// Member-specific routes
router.route('/profile').get(auth, getProfile).put(auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.put('/profile/avatar', auth, upload.single('avatar'), updateAvatar);

// Admin-only user management routes
router.route('/users').get(auth, admin, getAllUsers);
router.route('/users/:nim').get(auth, admin, getUserByNim).put(auth, admin, updateUser).delete(auth, admin, deleteUser);

// Admin-only member event history routes
router.route('/users/:nim/lombas').get(auth, admin, getMemberLombasForAdmin);
router.route('/users/:nim/beasiswas').get(auth, admin, getMemberBeasiswasForAdmin);
router.route('/users/:nim/talks').get(auth, admin, getMemberTalksForAdmin);
router.route('/users/:nim/bootcamps').get(auth, admin, getMemberBootcampsForAdmin);

module.exports = router;
