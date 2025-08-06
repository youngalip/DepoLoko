const express = require('express');
const multer = require('multer');
const path = require('path');
const FaultHistoryController = require('../controllers/faultHistoryController');

const router = express.Router();

// Configure multer for file upload (in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== '.csv') {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// GET /api/fault-history - Get fault history with filters
router.get('/', FaultHistoryController.getFaultHistory);

// GET /api/fault-history/summary - Get summary counters
router.get('/summary', FaultHistoryController.getSummaryCounters);

// POST /api/fault-history/import - Import CSV
router.post('/import', upload.single('csvFile'), FaultHistoryController.importCSV);

// GET /api/fault-history/locomotives - Get locomotives for dropdown
router.get('/locomotives', FaultHistoryController.getLocomotives);

// GET /api/fault-history/fault-types - Get distinct fault types
router.get('/fault-types', FaultHistoryController.getFaultTypes);

// GET /api/fault-history/fault-codes - Get distinct fault codes
router.get('/fault-codes', FaultHistoryController.getFaultCodes);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
  }
  
  res.status(400).json({
    success: false,
    message: error.message
  });
});

module.exports = router;