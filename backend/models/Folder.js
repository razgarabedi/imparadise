const db = require('../config/db');

const Folder = {
  async create(name, userId, isPublic = false) {
    const { rows } = await db.query(
      'INSERT INTO folders (name, user_id, is_public) VALUES ($1, $2, $3) RETURNING id',
      [name, userId, isPublic]
    );
    const id = rows[0].id;
    return { id, name, user_id: userId, is_public: isPublic };
  },

  async findByUserId(userId) {
    const { rows } = await db.query('SELECT * FROM folders WHERE user_id = $1', [userId]);
    return rows;
  },

  async findById(folderId) {
    const { rows } = await db.query('SELECT * FROM folders WHERE id = $1', [folderId]);
    return rows[0];
  },

  async findAllPublic() {
    const { rows } = await db.query('SELECT * FROM folders WHERE is_public = TRUE');
    return rows;
  },

  async update(folderId, name, isPublic) {
    await db.query(
      'UPDATE folders SET name = $1, is_public = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [name, isPublic, folderId]
    );
    return { id: folderId, name, is_public: isPublic };
  },

  async delete(folderId) {
    await db.query('DELETE FROM folders WHERE id = $1', [folderId]);
    return { id: folderId };
  },
};

module.exports = Folder; 