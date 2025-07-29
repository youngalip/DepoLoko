const db = require('../db');

// Update Sertifikat SIO
exports.updateSertifikatSio = async (id, data) => {
  const { nipp, nama, jabatan, kedudukan, jenis_sertifikat, penerbit, nomor_sertifikat, tahun_perolehan, masa_aktif, link_sertifikat } = data;
  const result = await db.query(
    `UPDATE sertifikat_sio SET
      nipp = $1,
      nama = $2,
      jabatan = $3,
      kedudukan = $4,
      jenis_sertifikat = $5,
      penerbit = $6,
      nomor_sertifikat = $7,
      tahun_perolehan = $8,
      masa_aktif = $9,
      link_sertifikat = $10
    WHERE id = $11
    RETURNING *`,
    [nipp, nama, jabatan, kedudukan, jenis_sertifikat, penerbit, nomor_sertifikat, tahun_perolehan, masa_aktif, link_sertifikat, id]
  );
  return result.rows[0];
};

// Ambil semua data sertifikat SIO
exports.getAllSertifikatSio = async () => {
  const result = await db.query(`
    SELECT id, nipp, nama, jabatan, kedudukan, jenis_sertifikat, penerbit, nomor_sertifikat, tahun_perolehan, masa_aktif, link_sertifikat, created_at
    FROM sertifikat_sio
    ORDER BY id DESC
  `);
  return result.rows;
};

exports.createSertifikatSio = async (data) => {
  const { nipp, nama, jabatan, kedudukan, jenis_sertifikat, penerbit, nomor_sertifikat, tahun_perolehan, masa_aktif, link_sertifikat } = data;
  const result = await db.query(
    `INSERT INTO sertifikat_sio (nipp, nama, jabatan, kedudukan, jenis_sertifikat, penerbit, nomor_sertifikat, tahun_perolehan, masa_aktif, link_sertifikat, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW()) RETURNING *`,
    [nipp, nama, jabatan, kedudukan, jenis_sertifikat, penerbit, nomor_sertifikat, tahun_perolehan, masa_aktif, link_sertifikat]
  );
  return result.rows[0];
};

exports.deleteSertifikatSio = async (id) => {
  const result = await db.query('DELETE FROM sertifikat_sio WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
