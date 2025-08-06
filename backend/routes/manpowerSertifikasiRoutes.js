const express = require('express');
const router = express.Router();
const manpowerSertifikasiController = require('../controllers/manpowerSertifikasiController');

// GET semua sertifikasi by nipp
router.get('/:nipp', manpowerSertifikasiController.getSertifikasiByNipp);
// POST tambah sertifikasi
router.post('/', manpowerSertifikasiController.createSertifikasi);
// DELETE sertifikasi by id
router.delete('/:id', manpowerSertifikasiController.deleteSertifikasi);

module.exports = router;
