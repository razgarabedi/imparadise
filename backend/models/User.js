const pool = require('../config/db');

const User = {
  async findByUsername(username) {
    const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return res.rows[0];
  },

  async findByEmail(email) {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
  },

  async create(username, email, passwordHash, role = 'user') {
    const res = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, passwordHash, role]
    );
    return res.rows[0];
  },

  async count() {
    const res = await pool.query('SELECT COUNT(*) FROM users');
    return parseInt(res.rows[0].count, 10);
  },

  async findAll() {
    const res = await pool.query('SELECT id, username, email, role, created_at, updated_at FROM users');
    return res.rows;
  },

  async updateRole(id, role) {
    const res = await pool.query(
      'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [role, id]
    );
    return res.rows[0];
  },

  async delete(id) {
    const res = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
  },
};

module.exports = User; 