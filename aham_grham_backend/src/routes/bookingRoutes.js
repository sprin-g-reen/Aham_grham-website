import express from 'express';
import { createBooking, getAllBookings } from '../controllers/bookingController.js';

const router = express.Router();

/**
 * Route: /api/bookings
 * POST: Submit a new booking (Public)
 * GET: Fetch all bookings (Admin)
 */
router.route('/')
  .post(createBooking)
  .get(getAllBookings);

export default router;
