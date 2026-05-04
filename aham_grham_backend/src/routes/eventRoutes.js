import express from 'express';
import { 
  createEvent, 
  getAllEvents, 
  getSingleEvent, 
  deleteEvent 
} from '../controllers/eventController.js';

const router = express.Router();

/**
 * Route: /api/events
 * GET: Fetch all events
 * POST: Create a new event
 */
router.route('/')
  .get(getAllEvents)
  .post(createEvent);

/**
 * Route: /api/events/:id
 * GET: Fetch a single event
 * DELETE: Remove an event
 */
router.route('/:id')
  .get(getSingleEvent)
  .delete(deleteEvent);

export default router;
