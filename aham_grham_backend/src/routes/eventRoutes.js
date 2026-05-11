import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  getEvents, 
  createEvent, 
  updateEvent,
  deleteEvent,
  toggleBlogStatus
} from '../controllers/eventController.js';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

router.route('/')
  .get(getEvents)
  .post(createEvent);

router.route('/:id')
  .delete(deleteEvent)
  .put(updateEvent);

router.patch('/:id/toggle-blog', toggleBlogStatus);

export default router;
