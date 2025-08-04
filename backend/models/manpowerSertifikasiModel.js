const db = require('../db');

// Ambil semua sertifikasi untuk satu pegawai
exports.getSertifikasiByNipp = async (nipp) => {
  const result = await db.query('SELECT * FROM manpower_sertifikasi WHERE nipp = $1 ORDER BY id DESC', [nipp]);
  return result.rows;
};

// Tambah sertifikasi (multi-entry)
exports.createSertifikasi = async (data) => {
  const { nipp, sertifikasi, tanggal_terbit, nomor_sertifikat, berlaku_sampai, masa_berlaku, status } = data;
  const result = await db.query(
    `INSERT INTO manpower_sertifikasi (nipp, sertifikasi, tanggal_terbit, nomor_sertifikat, berlaku_sampai, masa_berlaku, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [nipp, sertifikasi, tanggal_terbit, nomor_sertifikat, berlaku_sampai, masa_berlaku, status]
  );
  return result.rows[0];
};

// Hapus sertifikasi berdasarkan id
exports.deleteSertifikasi = async (id) => {
  const result = await db.query('DELETE FROM manpower_sertifikasi WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
