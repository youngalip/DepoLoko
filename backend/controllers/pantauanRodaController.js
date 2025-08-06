const PantauanRoda = require('../models/pantauanRodaModel');

exports.getAllPantauanRoda = async (req, res) => {
  try {
    const data = await PantauanRoda.getAllPantauanRoda();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data pantauan roda', detail: err.message });
  }
};

exports.createPantauanRoda = async (req, res) => {
  try {
    const newData = await PantauanRoda.createPantauanRoda(req.body);
    res.status(201).json({ pantauan_roda: newData });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambah data pantauan roda', detail: err.message });
  }
};
