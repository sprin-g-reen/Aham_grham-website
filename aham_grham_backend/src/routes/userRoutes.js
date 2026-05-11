import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  verifyEmail,
  resetPassword,
  logoutUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.post('/verify-email', verifyEmail);
router.post('/reset-password', resetPassword);

export default router;
