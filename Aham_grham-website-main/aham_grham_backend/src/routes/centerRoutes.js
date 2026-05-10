import express from 'express';
import { getCenters, createCenter, updateCenter, deleteCenter } from '../controllers/centerController.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `center-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

router.get('/', getCenters);
router.post('/', upload.single('image'), createCenter);
router.put('/:id', upload.single('image'), updateCenter);
router.delete('/:id', deleteCenter);

export default router;
