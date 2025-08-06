// routes/componentUsage.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const ComponentUsageController = require('../controllers/componentUsageController');

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

// GET /api/component-usage - Get component usage with filters
router.get('/', ComponentUsageController.getComponentUsage);

// GET /api/component-usage/summary - Get summary counters
router.get('/summary', ComponentUsageController.getSummaryCounters);

// GET /api/component-usage/analytics - Get analytics data for charts
router.get('/analytics', ComponentUsageController.getAnalytics);

// POST /api/component-usage/import - Import CSV
router.post('/import', upload.single('csvFile'), ComponentUsageController.importCSV);

// GET /api/component-usage/locomotives - Get distinct locomotives
router.get('/locomotives', ComponentUsageController.getLocomotives);

// GET /api/component-usage/maintenance-types - Get distinct maintenance types
router.get('/maintenance-types', ComponentUsageController.getMaintenanceTypes);

// GET /api/component-usage/depo-locations - Get distinct depo locations
router.get('/depo-locations', ComponentUsageController.getDepoLocations);

// GET /api/component-usage/years - Get distinct years
router.get('/years', ComponentUsageController.getYears);

// GET /api/component-usage/months - Get distinct months
router.get('/months', ComponentUsageController.getMonths);

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