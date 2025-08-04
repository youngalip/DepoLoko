const express = require('express');
const router = express.Router();
const manpowerController = require('../controllers/manpowerController');

router.get('/', manpowerController.getAllManpower);
router.get('/:nipp', manpowerController.getDetailManpowerByNipp);
router.post('/', manpowerController.createManpower);
router.delete('/:nipp', manpowerController.deleteManpower);

module.exports = router;
