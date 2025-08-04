const manpowerSertifikasiModel = require('../models/manpowerSertifikasiModel');

// GET semua sertifikasi by nipp
exports.getSertifikasiByNipp = async (req, res) => {
  try {
    const data = await manpowerSertifikasiModel.getSertifikasiByNipp(req.params.nipp);
    res.json({ sertifikasi: data });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data sertifikasi', detail: err.message });
  }
};

// POST tambah sertifikasi (multi-entry)
exports.createSertifikasi = async (req, res) => {
  try {
    const newData = await manpowerSertifikasiModel.createSertifikasi(req.body);
    res.status(201).json({ sertifikasi: newData });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambah sertifikasi', detail: err.message });
  }
};

// DELETE sertifikasi by id
exports.deleteSertifikasi = async (req, res) => {
  try {
    const deleted = await manpowerSertifikasiModel.deleteSertifikasi(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Data sertifikasi tidak ditemukan' });
    res.json({ message: 'Sertifikasi berhasil dihapus', sertifikasi: deleted });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus sertifikasi', detail: err.message });
  }
};
