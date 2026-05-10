import express from 'express';
import { getFooter, updateFooter } from '../controllers/footerController.js';

const router = express.Router();

router.route('/')
  .get(getFooter)
  .put(updateFooter);

export default router;
