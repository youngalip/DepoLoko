// routes/performance.js - Updated with CSV import route
const express = require('express');
const multer = require('multer');
const router = express.Router();
const PerformanceController = require('../controllers/performanceController');

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Only accept CSV files
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // ⚠️ INCREASE: 50MB limit (was 10MB)
    fieldSize: 25 * 1024 * 1024  // ⚠️ ADD: field size limit
  }
});

// ⚠️ ALSO: Add error handling middleware
router.post('/import-csv', upload.single('csv_file'), (req, res, next) => {
  // Handle multer errors
  if (req.multerError) {
    return res.status(400).json({
      success: false,
      message: `Upload error: ${req.multerError.message}`
    });
  }
  next();
}, PerformanceController.importCSV);

// GET /api/performance/chart - Get chart data
router.get('/chart', PerformanceController.getChartData);

// GET /api/performance/columns - Get available columns
router.get('/columns', PerformanceController.getAvailableColumns);

// POST /api/performance/import-csv - Import CSV file
router.post('/import-csv', upload.single('csv_file'), PerformanceController.importCSV);

module.exports = router;