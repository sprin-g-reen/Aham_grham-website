import express from 'express';
const router = express.Router();
import { getHero, updateHero } from '../controllers/heroController.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `hero-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.route('/')
  .get(getHero)
  .put(upload.single('heroImage'), updateHero);

export default router;
