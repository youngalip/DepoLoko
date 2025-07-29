const db = require('../db');

exports.getDiklatByManpowerId = async (manpowerId) => {
  const result = await db.query('SELECT * FROM manpower_diklat WHERE manpower_id = $1', [manpowerId]);
  return result.rows;
};

exports.getSertifikasiByManpowerId = async (manpowerId) => {
  const result = await db.query('SELECT * FROM manpower_sertifikasi WHERE manpower_id = $1', [manpowerId]);
  return result.rows;
};

exports.getDtoByManpowerId = async (manpowerId) => {
  const result = await db.query('SELECT * FROM manpower_dto WHERE manpower_id = $1', [manpowerId]);
  return result.rows;
};
