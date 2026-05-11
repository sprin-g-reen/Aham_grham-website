import express from 'express';
const router = express.Router();
import { getActivities, clearActivities } from '../controllers/activityController.js';

router.route('/')
  .get(getActivities)
  .delete(clearActivities);

export default router;
