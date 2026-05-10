import express from 'express';
import { createBooking, getAllBookings, getUserBookings, deleteBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, getAllBookings);

router.get('/my', protect, getUserBookings);

router.delete('/:id', protect, deleteBooking);

export default router;
