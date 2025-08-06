const express = require('express');
const router = express.Router();
const LocomotiveController = require('../controllers/locomotiveController');

// GET /api/locomotives - Get all locomotives
router.get('/', LocomotiveController.getAll);

// GET /api/locomotives/:id - Get locomotive by id
router.get('/:id', LocomotiveController.getById);

module.exports = router;