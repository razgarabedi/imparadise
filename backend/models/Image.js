const pool = require('../config/db');

const Image = {
  async create(filename, storedFilename, mimetype, size, folderId, userId, url, thumbnailFilename = null, thumbnailUrl = null) {
    const res = await pool.query(
      'INSERT INTO images (filename, stored_filename, mimetype, size, folder_id, user_id, url, thumbnail_filename, thumbnail_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [filename, storedFilename, mimetype, size, folderId, userId, url, thumbnailFilename, thumbnailUrl]
    );
    return res.rows[0];
  },

  async updateThumbnail(imageId, thumbnailFilename, thumbnailUrl) {
    const res = await pool.query(
      'UPDATE images SET thumbnail_filename = $1, thumbnail_url = $2 WHERE id = $3 RETURNING *',
      [thumbnailFilename, thumbnailUrl, imageId]
    );
    return res.rows[0];
  },

  async findByFolderId(folderId) {
    if (folderId === null) {
      const res = await pool.query('SELECT * FROM images ORDER BY created_at DESC');
      return res.rows;
    }
    const res = await pool.query('SELECT * FROM images WHERE folder_id = $1 ORDER BY created_at DESC', [folderId]);
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