const express = require('express');
const router = express.Router();
const fasilitasController = require('../controllers/fasilitasController');

router.get('/', fasilitasController.getAllFasilitas);
router.post('/', fasilitasController.createFasilitas);
router.delete('/:id', fasilitasController.deleteFasilitas); // CRUD opsional

module.exports = router;
