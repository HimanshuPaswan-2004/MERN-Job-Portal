import express from 'express';
import {
  createCompany,
  getMyCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('recruiter'), upload.single('logo'), createCompany);
router.get('/my', protect, authorize('recruiter'), getMyCompanies);
router.get('/:id', getCompanyById);
router.put('/:id', protect, authorize('recruiter'), upload.single('logo'), updateCompany);
router.delete('/:id', protect, authorize('recruiter'), deleteCompany);

export default router;
