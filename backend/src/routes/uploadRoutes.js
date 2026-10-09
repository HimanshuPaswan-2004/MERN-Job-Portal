import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import path from 'path';

const router = express.Router();

// @desc    Upload file
// @route   POST /api/upload
// @access  Public
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a file' });
  }
  
  // Construct a clean URL path using just the filename to avoid OS path separator issues
  const filename = path.basename(req.file.filename || req.file.originalname);
  const filePath = `/uploads/${filename}`;
  
  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      url: filePath
    }
  });
});

export default router;

