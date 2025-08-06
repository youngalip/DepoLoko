const db = require('../db');

exports.getAllManpower = async () => {
  const pegawai = await db.query('SELECT * FROM manpower ORDER BY nipp DESC');
  const result = await Promise.all(pegawai.rows.map(async (row) => {
    const diklat = await db.query('SELECT * FROM manpower_diklat WHERE nipp = $1 ORDER BY id DESC', [row.nipp]);
    const sertifikasi = await db.query('SELECT * FROM manpower_sertifikasi WHERE nipp = $1 ORDER BY id DESC', [row.nipp]);
    return { ...row, diklat: diklat.rows, sertifikasi: sertifikasi.rows };
  }));
  return result;
};

exports.createManpower = async (data) => {
  const {
    nipp, nama, jabatan, regu, tempat_lahir, tanggal_lahir, tmt_pensiun, pendidikan, is_active
  } = data;

  // Validasi field wajib
  if (!nipp || !nama || !jabatan || !pendidikan || !tmt_pensiun || !tanggal_lahir) {
    throw new Error('Field wajib tidak boleh kosong!');
  }

  // Validasi nipp unik
  const cekNipp = await db.query('SELECT nipp FROM manpower WHERE nipp = $1', [nipp]);
  if (cekNipp.rows.length > 0) {
    throw new Error('NIPP sudah terdaftar!');
  }

  // Otomatisasi usia, counter pensiun, kategori pensiun
  const tahunNow = new Date().getFullYear();
  const tahunLahir = new Date(tanggal_lahir).getFullYear();
  const tahunPensiun = new Date(tmt_pensiun).getFullYear();
  const usia = tahunNow - tahunLahir;
  const counter_pensiun = tahunPensiun - tahunNow;
  let kategori_pensiun = '';
  if (counter_pensiun < 2) kategori_pensiun = '<2 tahun';
  else if (counter_pensiun <= 5) kategori_pensiun = '2-5 tahun';
  else kategori_pensiun = '>5 tahun';

  const result = await db.query(
    `INSERT INTO manpower (nipp, nama, jabatan, regu, tempat_lahir, tanggal_lahir, tmt_pensiun, pendidikan, usia, counter_pensiun, kategori_pensiun, is_active, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),NOW()) RETURNING *`,
    [nipp, nama, jabatan, regu, tempat_lahir, tanggal_lahir, tmt_pensiun, pendidikan, usia, counter_pensiun, kategori_pensiun, is_active]
  );
  return result.rows[0];
};

exports.deleteManpower = async (nipp) => {
  const result = await db.query('DELETE FROM manpower WHERE nipp = $1 RETURNING *', [nipp]);
  return result.rows[0];
};

// Ambil detail satu pegawai + join diklat & sertifikasi
exports.getDetailManpowerByNipp = async (nipp) => {
  const pegawai = await db.query('SELECT * FROM manpower WHERE nipp = $1', [nipp]);
  if (!pegawai.rows[0]) return null;
  const diklat = await db.query('SELECT * FROM manpower_diklat WHERE nipp = $1 ORDER BY id DESC', [nipp]);
  const sertifikasi = await db.query('SELECT * FROM manpower_sertifikasi WHERE nipp = $1 ORDER BY id DESC', [nipp]);
  return {
    ...pegawai.rows[0],
    diklat: diklat.rows,
    sertifikasi: sertifikasi.rows
  };
};
