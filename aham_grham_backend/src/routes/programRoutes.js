import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getPrograms,
  createProgram,
  deleteProgram,
  updateProgram
} from '../controllers/programController.js';

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
  .get(getPrograms)
  .post(upload.single('image'), createProgram);

router.route('/:id')
  .delete(deleteProgram)
  .put(upload.single('image'), updateProgram);

export default router;
