import express from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  updateJob,
  updateJobStatus,
  deleteJob,
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllJobs);
router.get('/my', protect, authorize('recruiter'), getMyJobs);
router.get('/:id', getJobById);

router.post('/', protect, authorize('recruiter'), createJob);
router.put('/:id', protect, authorize('recruiter'), updateJob);
router.patch('/:id/status', protect, authorize('recruiter'), updateJobStatus);
router.delete('/:id', protect, authorize('recruiter'), deleteJob);

export default router;
