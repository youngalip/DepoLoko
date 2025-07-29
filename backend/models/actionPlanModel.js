const db = require('../db');

// GET all action plan
exports.getAllActionPlan = async () => {
  const result = await db.query('SELECT * FROM action_plan ORDER BY tanggal DESC, id DESC');
  return result.rows;
};

// GET by id
exports.getActionPlanById = async (id) => {
  const result = await db.query('SELECT * FROM action_plan WHERE id = $1', [id]);
  return result.rows[0];
};

// CREATE action plan
exports.createActionPlan = async (data) => {
  const {
    nama_pemeriksa, tanggal, nomor_lokomotif, komponen, aktivitas, prioritas, status, target_date, completed_date, foto_path, keterangan
  } = data;
  const result = await db.query(
    `INSERT INTO action_plan (nama_pemeriksa, tanggal, nomor_lokomotif, komponen, aktivitas, prioritas, status, target_date, completed_date, foto_path, keterangan)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [nama_pemeriksa, tanggal, nomor_lokomotif, komponen, aktivitas, prioritas, status, target_date, completed_date, foto_path, keterangan]
  );
  return result.rows[0];
};

// DELETE action plan
exports.deleteActionPlan = async (id) => {
  const result = await db.query('DELETE FROM action_plan WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
