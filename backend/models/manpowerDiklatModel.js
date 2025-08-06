const db = require('../db');

// Ambil semua diklat untuk satu pegawai
exports.getDiklatByNipp = async (nipp) => {
  const result = await db.query('SELECT * FROM manpower_diklat WHERE nipp = $1 ORDER BY id DESC', [nipp]);
  return result.rows;
};

// Tambah/update diklat (replace jika sudah ada untuk nipp)
exports.upsertDiklat = async (nipp, data) => {
  // Hapus dulu data lama (jika ada)
  await db.query('DELETE FROM manpower_diklat WHERE nipp = $1', [nipp]);
  // Insert baru
  const result = await db.query(
    `INSERT INTO manpower_diklat (nipp, dto_prs, dto_pms, t2_prs, t2_pms, t3_prs, t3_pms, t4_mps, smdp, jmdp)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [nipp, data.dto_prs, data.dto_pms, data.t2_prs, data.t2_pms, data.t3_prs, data.t3_pms, data.t4_mps, data.smdp, data.jmdp]
  );
  return result.rows[0];
};

// Hapus diklat berdasarkan id
exports.deleteDiklat = async (id) => {
  const result = await db.query('DELETE FROM manpower_diklat WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
