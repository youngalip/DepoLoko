const manpowerDiklatModel = require('../models/manpowerDiklatModel');

// GET diklat by nipp
exports.getDiklatByNipp = async (req, res) => {
  try {
    const data = await manpowerDiklatModel.getDiklatByNipp(req.params.nipp);
    res.json({ diklat: data });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data diklat', detail: err.message });
  }
};

// UPSERT diklat (replace all diklat for nipp)
exports.upsertDiklat = async (req, res) => {
  try {
    const nipp = req.body.nipp;
    const newData = await manpowerDiklatModel.upsertDiklat(nipp, req.body);
    res.status(201).json({ diklat: newData });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambah/mengupdate diklat', detail: err.message });
  }
};

// DELETE diklat by id
exports.deleteDiklat = async (req, res) => {
  try {
    const deleted = await manpowerDiklatModel.deleteDiklat(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Data diklat tidak ditemukan' });
    res.json({ message: 'Diklat berhasil dihapus', diklat: deleted });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus diklat', detail: err.message });
  }
};
