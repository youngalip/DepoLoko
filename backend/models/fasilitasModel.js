const db = require('../db');

// Ambil semua data fasilitas
exports.getAllFasilitas = async () => {
  const result = await db.query('SELECT * FROM fasilitas');
  return result.rows;
};

// Hapus fasilitas berdasarkan id
exports.deleteFasilitas = async (id) => {
  const result = await db.query('DELETE FROM fasilitas WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

// Tambah fasilitas baru (full mapping sesuai tabel)
exports.createFasilitas = async (data) => {
  const {
    nomor_aset,
    nama_fasilitas,
    kategori,
    jumlah_satuan,
    baik,
    pantauan,
    rusak,
    spesifikasi,
    merk,
    tahun_pengadaan,
    tahun_mulai_dinas,
    tanggal_perawatan,
    kategori_standardisasi,
    tanggal_sertifikasi,
    lokasi_penyimpanan,
    umur_komponen,
    foto_path,
    is_active
  } = data;
  const result = await db.query(
    `INSERT INTO fasilitas (
      nomor_aset, nama_fasilitas, kategori, jumlah_satuan, baik, pantauan, rusak, spesifikasi, merk, tahun_pengadaan, tahun_mulai_dinas, tanggal_perawatan, kategori_standardisasi, tanggal_sertifikasi, lokasi_penyimpanan, umur_komponen, foto_path, is_active
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18
    ) RETURNING *`,
    [
      nomor_aset,
      nama_fasilitas,
      kategori,
      jumlah_satuan,
      baik,
      pantauan,
      rusak,
      spesifikasi,
      merk,
      tahun_pengadaan,
      tahun_mulai_dinas,
      tanggal_perawatan,
      kategori_standardisasi,
      tanggal_sertifikasi,
      lokasi_penyimpanan,
      umur_komponen,
      foto_path,
      is_active
    ]
  );
  return result.rows[0];
};
