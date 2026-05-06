import express from 'express';
import { 
  createAiTag, 
  getAllAiTags, 
  deleteAiTag 
} from '../controllers/aiTagController.js';

const router = express.Router();

router.route('/')
  .get(getAllAiTags)
  .post(createAiTag);

router.route('/:id')
  .delete(deleteAiTag);

export default router;
