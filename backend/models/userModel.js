const pool = require('../db');

exports.findUserByUsernameOrEmail = async (usernameOrEmail) => {
  const res = await pool.query(
    'SELECT * FROM users WHERE username = $1 OR email = $1',
    [usernameOrEmail]
  );
  return res.rows[0];
};

// Ambil semua user
exports.getAllUsers = async () => {
  const res = await pool.query('SELECT id, username, email, nipp, role, nama_lengkap FROM users ORDER BY id');
  return res.rows;
};

// Hapus user berdasarkan id
exports.deleteUserById = async (id) => {
  const res = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

exports.createUser = async (user) => {
  const { username, email, nipp, password_hash, role, nama_lengkap } = user;
  const res = await pool.query(
    `INSERT INTO users (username, email, nipp, password_hash, role, nama_lengkap)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [username, email, nipp, password_hash, role, nama_lengkap]
  );
  return res.rows[0];
};