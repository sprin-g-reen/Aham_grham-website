import express from 'express';
const router = express.Router();
import {
  getTestimonials,
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
  bulkCreateTestimonials,
} from '../controllers/testimonialController.js';
import multer from 'multer';
import path from 'path';

// Multer setup for image uploads
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
  .get(getTestimonials)
  .post(upload.single('image'), createTestimonial);

router.post('/bulk', bulkCreateTestimonials);

router.route('/:id')
  .delete(deleteTestimonial)
  .put(upload.single('image'), updateTestimonial);

export default router;
