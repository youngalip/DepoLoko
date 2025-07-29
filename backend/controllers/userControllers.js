const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    const { username, email, nipp, password, role, nama_lengkap } = req.body;
    const existing = await userModel.findUserByUsernameOrEmail(username) || await userModel.findUserByUsernameOrEmail(email);
    if (existing) return res.status(400).json({ message: 'Username/email sudah terdaftar' });
    const password_hash = await bcrypt.hash(password, 10);
    const user = await userModel.createUser({ username, email, nipp, password_hash, role, nama_lengkap });
    res.status(201).json({ message: 'Register sukses', user: { ...user, password_hash: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Error register', error: err.message });
  }
};

// Ambil semua user
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error get users', error: err.message });
  }
};

// Hapus user berdasarkan id
exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await userModel.deleteUserById(id);
    if (!deleted) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json({ message: 'User dihapus', user: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Error delete user', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const user = await userModel.findUserByUsernameOrEmail(usernameOrEmail);
    if (!user) return res.status(400).json({ message: 'User tidak ditemukan' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ message: 'Password salah' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ message: 'Login sukses', token, user: { ...user, password_hash: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Error login', error: err.message });
  }
};