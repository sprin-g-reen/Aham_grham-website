import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  getEvents, 
  createEvent, 
  updateEvent,
  deleteEvent 
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
  .post(upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), createEvent);

router.route('/:id')
  .delete(deleteEvent)
  .put(upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), updateEvent);

export default router;
