const db = require('../db');

const PantauanRoda = {
  async getAllPantauanRoda() {
    const [rows] = await db.query('SELECT * FROM pantauan_roda ORDER BY date DESC');
    return rows;
  },

  async createPantauanRoda(data) {
    const { loko, date, diameter, thickness, height, status, lifetime } = data;
    const [result] = await db.query(
      'INSERT INTO pantauan_roda (loko, date, diameter, thickness, height, status, lifetime) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [loko, date, diameter, thickness, height, status, lifetime]
    );
    return { id: result.insertId, ...data };
  },

  // Optional: delete, update, dsb
};

module.exports = PantauanRoda;
