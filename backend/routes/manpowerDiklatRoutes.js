const express = require('express');
const router = express.Router();
const manpowerDiklatController = require('../controllers/manpowerDiklatController');

// GET diklat by nipp
router.get('/:nipp', manpowerDiklatController.getDiklatByNipp);
// UPSERT diklat (replace all diklat for nipp)
router.post('/', manpowerDiklatController.upsertDiklat);
// DELETE diklat by id
router.delete('/:id', manpowerDiklatController.deleteDiklat);

module.exports = router;
