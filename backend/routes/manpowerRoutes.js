const express = require('express');
const router = express.Router();
const manpowerController = require('../controllers/manpowerController');

router.get('/', manpowerController.getAllManpower);
router.post('/', manpowerController.createManpower);
router.delete('/:id', manpowerController.deleteManpower);

module.exports = router;
