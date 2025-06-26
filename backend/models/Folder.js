const pool = require('../config/db');

const Folder = {
  async create(name, userId, isPublic = false) {
    const res = await pool.query(
      'INSERT INTO folders (name, user_id, is_public) VALUES ($1, $2, $3) RETURNING *',
      [name, userId, isPublic]
    );
    return res.rows[0];
  },

  async findByUserId(userId) {
    const res = await pool.query('SELECT * FROM folders WHERE user_id = $1', [userId]);
    return res.rows;
  },

  async findById(folderId) {
    const res = await pool.query('SELECT * FROM folders WHERE id = $1', [folderId]);
    return res.rows[0];
  },

  async findAllPublic() {
    const res = await pool.query('SELECT * FROM folders WHERE is_public = TRUE');
    return res.rows;
  },

  async update(folderId, name, isPublic) {
    const res = await pool.query(
      'UPDATE folders SET name = $1, is_public = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, isPublic, folderId]
    );
    return res.rows[0];
  },

  async delete(folderId) {
    const res = await pool.query('DELETE FROM folders WHERE id = $1 RETURNING *', [folderId]);
    return res.rows[0];
  },
};

module.exports = Folder; 