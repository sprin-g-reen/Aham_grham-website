import express from 'express';
const router = express.Router();
import { getAbout, updateAbout } from '../controllers/aboutController.js';
import multer from 'multer';
import path from 'path';

// Multer setup for hero image upload
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
  .get(getAbout)
  .put(upload.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'ctaImage', maxCount: 1 }
  ]), updateAbout);

export default router;
