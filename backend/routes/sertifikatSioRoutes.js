const express = require('express');
const router = express.Router();
const sertifikatSioController = require('../controllers/sertifikatSioController');

router.get('/', sertifikatSioController.getAllSertifikatSio);
router.post('/', sertifikatSioController.createSertifikatSio);
router.put('/:id', sertifikatSioController.updateSertifikatSio);
router.delete('/:id', sertifikatSioController.deleteSertifikatSio);

module.exports = router;
