// routes/componentUsage.js - Complete with Import
const express = require('express');
const multer = require('multer');
const ComponentUsageController = require('../controllers/componentUsageController');
const router = express.Router();

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const fileName = file.originalname.toLowerCase();
    const isValidType = allowedTypes.some(type => fileName.endsWith(type));
    
    if (!isValidType) {
      return cb(new Error('Only CSV, XLSX, and XLS files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  }
});

// Test endpoint untuk memastikan route bekerja
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Component Usage route is working!',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/component-usage',
      'GET /api/component-usage/test',
      'POST /api/component-usage/import',
      'GET /api/component-usage/locomotives',
      'GET /api/component-usage/maintenance-types'
    ]
  });
});

// Main endpoints
router.get('/', ComponentUsageController.getComponentUsage);
router.post('/', ComponentUsageController.createComponentUsage);

// Import endpoint
router.post('/import', upload.single('csvFile'), ComponentUsageController.importCSV);

// Dropdown endpoints
router.get('/locomotives', ComponentUsageController.getLocomotives);
router.get('/maintenance-types', ComponentUsageController.getMaintenanceTypes);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  console.error('Route error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 20MB.',
        error_code: 'FILE_TOO_LARGE'
      });
    }
  }
  
  if (error.message.includes('Only CSV, XLSX, and XLS files are allowed')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only CSV, XLSX, and XLS files are allowed.',
      error_code: 'INVALID_FILE_TYPE'
    });
  }
  
  res.status(500).json({
    success: false,
    message: error.message || 'Internal server error',
    error_code: 'INTERNAL_ERROR'
  });
});

module.exports = router;