import express from 'express';
const router = express.Router();
import { trackActivity, getStats } from '../controllers/analyticsController.js';

router.post('/track', trackActivity);
router.get('/stats', getStats);

export default router;
