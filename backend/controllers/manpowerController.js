const manpowerModel = require('../models/manpowerModel');

exports.getAllManpower = async (req, res) => {
  try {
    const data = await manpowerModel.getAllManpower();
    res.json({ manpower: data });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data manpower', detail: err.message });
  }
};

exports.createManpower = async (req, res) => {
  try {
    const newData = await manpowerModel.createManpower(req.body);
    res.status(201).json({ manpower: newData });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambah manpower', detail: err.message });
  }
};

exports.deleteManpower = async (req, res) => {
  try {
    const deleted = await manpowerModel.deleteManpower(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Data manpower tidak ditemukan' });
    res.json({ message: 'Manpower berhasil dihapus', manpower: deleted });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus manpower', detail: err.message });
  }
};
