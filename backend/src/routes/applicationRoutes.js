import express from 'express';
import { applyForJob, getDashboardData, getMyApplications } from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('candidate'), getMyApplications);
router.get('/dashboard', protect, authorize('candidate'), getDashboardData);
router.post('/:jobId', protect, authorize('candidate'), applyForJob);

export default router;
