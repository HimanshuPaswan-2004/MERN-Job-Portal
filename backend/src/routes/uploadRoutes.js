import express from 'express';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// @desc    Upload file
// @route   POST /api/upload
// @access  Public
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a file' });
  }
  
  // Return the path to the uploaded file
  // Using forward slashes for cross-platform compatibility
  const filePath = `/${req.file.path.replace(/\\/g, '/')}`;
  
  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      url: filePath
    }
  });
});

export default router;
