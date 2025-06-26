const pool = require('../config/db');

const Image = {
  async create(filename, storedFilename, mimetype, size, folderId, userId, url) {
    const res = await pool.query(
      'INSERT INTO images (filename, stored_filename, mimetype, size, folder_id, user_id, url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [filename, storedFilename, mimetype, size, folderId, userId, url]
    );
    return res.rows[0];
  },

  async findByFolderId(folderId) {
    const res = await pool.query('SELECT * FROM images WHERE folder_id = $1', [folderId]);
    return res.rows;
  },

  async findById(imageId) {
    const res = await pool.query('SELECT * FROM images WHERE id = $1', [imageId]);
    return res.rows[0];
  },

  async delete(imageId) {
    const res = await pool.query('DELETE FROM images WHERE id = $1 RETURNING *', [imageId]);
    return res.rows[0];
  },
};

module.exports = Image; 