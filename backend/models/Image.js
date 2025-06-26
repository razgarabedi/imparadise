const db = require('../config/db');

const Image = {
  async create(filename, stored_filename, mimetype, size, folder_id, user_id, url, thumbnail_filename, thumbnail_url, preview_filename, preview_url) {
    const [result] = await db.query(
      'INSERT INTO images (filename, stored_filename, mimetype, size, folder_id, user_id, url, thumbnail_filename, thumbnail_url, preview_filename, preview_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [filename, stored_filename, mimetype, size, folder_id, user_id, url, thumbnail_filename, thumbnail_url, preview_filename, preview_url]
    );
    const id = result.insertId;
    return { id, filename, stored_filename, mimetype, size, folder_id, user_id, url, thumbnail_filename, thumbnail_url, preview_filename, preview_url };
  },

  async updateThumbnail(imageId, thumbnailFilename, thumbnailUrl) {
    const res = await db.query(
      'UPDATE images SET thumbnail_filename = $1, thumbnail_url = $2 WHERE id = $3 RETURNING *',
      [thumbnailFilename, thumbnailUrl, imageId]
    );
    return res.rows[0];
  },

  async findByFolderId(folderId) {
    let query = 'SELECT * FROM images';
    const params = [];
    if (folderId !== null) {
      query += ' WHERE folder_id = ?';
      params.push(folderId);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM images WHERE id = ?', [id]);
    return rows[0];
  },

  async delete(id) {
    await db.query('DELETE FROM images WHERE id = ?', [id]);
  },

  async findByIds(ids) {
    if (!ids || ids.length === 0) {
      return [];
    }
    const placeholders = ids.map(() => '?').join(',');
    const [rows] = await db.query(`SELECT * FROM images WHERE id IN (${placeholders})`, ids);
    return rows;
  },
};

module.exports = Image; 