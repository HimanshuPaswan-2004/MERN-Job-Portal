import express from 'express';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// @desc    Upload file (image or PDF)
// @route   POST /api/upload
// @access  Public
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a file' });
  }
  
  // Return the correct URL path for the uploaded file
  const fileName = req.file.filename;
  const fileUrl = `/uploads/${fileName}`;
  
  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      url: fileUrl,
      filename: fileName,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    }
  });
});

export default router;
