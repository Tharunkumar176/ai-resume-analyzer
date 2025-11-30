const express = require('express');
const router = express.Router();
const {
  analyzeResume,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Routes
router.post('/analyze', protect, upload.single('resume'), analyzeResume);
router.get('/history', protect, getAnalysisHistory);
router.get('/analysis/:id', protect, getAnalysisById);
router.delete('/analysis/:id', protect, deleteAnalysis);

module.exports = router;
