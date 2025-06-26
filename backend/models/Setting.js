const pool = require('../config/db');

const Setting = {
  async get(key) {
    const res = await pool.query('SELECT * FROM settings WHERE key = $1', [key]);
    return res.rows[0];
  },

  async getAll() {
    const res = await pool.query('SELECT * FROM settings');
    return res.rows;
  },

  async update(key, value) {
    const res = await pool.query(
      'UPDATE settings SET value = $1 WHERE key = $2 RETURNING *',
      [value, key]
    );
    return res.rows[0];
  },

  async getMultiple(keys) {
    const query = 'SELECT key, value FROM settings WHERE key = ANY($1::text[])';
    const { rows } = await pool.query(query, [keys]);
    return rows;
  },
};

module.exports = Setting; 