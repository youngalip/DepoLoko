const express = require('express');
const router = express.Router();
const pantauanRodaController = require('../controllers/pantauanRodaController');

// GET all pantauan roda
router.get('/', pantauanRodaController.getAllPantauanRoda);

// POST new pantauan roda
router.post('/', pantauanRodaController.createPantauanRoda);

module.exports = router;
