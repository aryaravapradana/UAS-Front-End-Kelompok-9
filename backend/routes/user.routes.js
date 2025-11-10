const express = require('express');
const router = express.Router();
const upload = require('../utils/upload.js');
const {
  getProfile,
  updateProfile,
  getAllUsers,
  createUser, // Import createUser
  getUserByNim,
  updateUser,
  deleteUser,
  deleteUserEmail, // Import deleteUserEmail
  getMemberLombasForAdmin,
  getMemberBeasiswasForAdmin,
  getMemberTalksForAdmin,
  getMemberBootcampsForAdmin,
  uploadProfilePicture,
} = require('../controllers/user.controller.js');
const auth = require('../middleware/auth.middleware.js');
const admin = require('../middleware/admin.middleware.js');

// Member-specific routes
router.route('/profile').get(auth, getProfile).put(auth, updateProfile);
router.route('/profile/picture').post(auth, upload.single('profilePicture'), uploadProfilePicture);

// Admin-only user management routes
router.route('/users')
  .get(auth, admin, getAllUsers)
  .post(auth, admin, upload.single('profilePicture'), createUser); // Add middleware

router.route('/users/:nim')
  .get(auth, admin, getUserByNim)
  .put(auth, admin, upload.single('profilePicture'), updateUser) // Add middleware
  .delete(auth, admin, deleteUser);

router.route('/users/:nim/email')
  .delete(auth, admin, deleteUserEmail); // New route to delete user email

// Admin-only member event history routes
router.route('/users/:nim/lombas').get(auth, admin, getMemberLombasForAdmin);
router.route('/users/:nim/beasiswas').get(auth, admin, getMemberBeasiswasForAdmin);
router.route('/users/:nim/talks').get(auth, admin, getMemberTalksForAdmin);
router.route('/users/:nim/bootcamps').get(auth, admin, getMemberBootcampsForAdmin);

module.exports = router;
