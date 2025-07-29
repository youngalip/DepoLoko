const db = require('../db');

const relasiModel = require('./manpowerRelasiModel');

exports.getAllManpower = async () => {
  const result = await db.query('SELECT * FROM manpower ORDER BY id DESC');
  const manpowers = result.rows;
  // Query relasi untuk setiap manpower
  const withRelasi = await Promise.all(manpowers.map(async (mp) => {
    const diklat = await relasiModel.getDiklatByManpowerId(mp.id);
    const sertifikasi = await relasiModel.getSertifikasiByManpowerId(mp.id);
    const dto = await relasiModel.getDtoByManpowerId(mp.id);
    return { ...mp, diklat, sertifikasi, dto };
  }));
  return withRelasi;
};

exports.createManpower = async (data) => {
  const {
    nipp, nama, jabatan, regu, tempat_lahir, tanggal_lahir, tmt_pensiun, pendidikan, is_active
  } = data;
  const result = await db.query(
    `INSERT INTO manpower (nipp, nama, jabatan, regu, tempat_lahir, tanggal_lahir, tmt_pensiun, pendidikan, is_active, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW()) RETURNING *`,
    [nipp, nama, jabatan, regu, tempat_lahir, tanggal_lahir, tmt_pensiun, pendidikan, is_active]
  );
  return result.rows[0];
};

exports.deleteManpower = async (id) => {
  const result = await db.query('DELETE FROM manpower WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
