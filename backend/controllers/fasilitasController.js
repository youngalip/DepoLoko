const fasilitasModel = require('../models/fasilitasModel');

// Ambil semua data fasilitas
exports.getAllFasilitas = async (req, res) => {
  try {
    const fasilitas = await fasilitasModel.getAllFasilitas();
    res.json({ fasilitas });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data fasilitas', error: err.message });
  }
};

// Tambah fasilitas baru
exports.createFasilitas = async (req, res) => {
  try {
    const newFasilitas = await fasilitasModel.createFasilitas(req.body);
    res.status(201).json({ fasilitas: newFasilitas });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambah fasilitas', error: err.message });
  }
};

// Hapus fasilitas
exports.deleteFasilitas = async (req, res) => {
  try {
    const deleted = await fasilitasModel.deleteFasilitas(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Data fasilitas tidak ditemukan' });
    }
    res.json({ message: 'Fasilitas berhasil dihapus', fasilitas: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus fasilitas', error: err.message });
  }
};
