const SertifikatSio = require('../models/sertifikatSioModel');

exports.getAllSertifikatSio = async (req, res) => {
  try {
    const data = await SertifikatSio.getAllSertifikatSio();
    res.json({ sertifikat_sio: data });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data sertifikat SIO' });
  }
};

// Update Sertifikat SIO
exports.updateSertifikatSio = async (req, res) => {
  try {
    const updated = await SertifikatSio.updateSertifikatSio(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Data sertifikat SIO tidak ditemukan' });
    res.json({ sertifikat_sio: updated });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengupdate sertifikat SIO', detail: err.message });
  }
};

exports.createSertifikatSio = async (req, res) => {
  try {
    const newData = await SertifikatSio.createSertifikatSio(req.body);
    res.status(201).json({ sertifikat_sio: newData });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambah sertifikat SIO', detail: err.message });
  }
};

exports.deleteSertifikatSio = async (req, res) => {
  try {
    const deleted = await SertifikatSio.deleteSertifikatSio(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Data sertifikat SIO tidak ditemukan' });
    res.json({ message: 'Sertifikat SIO berhasil dihapus', sertifikat_sio: deleted });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus sertifikat SIO', detail: err.message });
  }
};
