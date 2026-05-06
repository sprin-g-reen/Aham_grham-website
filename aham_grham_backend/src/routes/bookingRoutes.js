import express from 'express';
import { createBooking, getAllBookings, getUserBookings } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, getAllBookings);

router.get('/my', protect, getUserBookings);

export default router;
