const db = require('../config/db');

const Image = {
  async create(filename, stored_filename, mimetype, size, folder_id, user_id, url, thumbnail_filename, thumbnail_url, preview_filename, preview_url) {
    const { rows } = await db.query(
      'INSERT INTO images (filename, stored_filename, mimetype, size, folder_id, user_id, url, thumbnail_filename, thumbnail_url, preview_filename, preview_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id',
      [filename, stored_filename, mimetype, size, folder_id, user_id, url, thumbnail_filename, thumbnail_url, preview_filename, preview_url]
    );
    const id = rows[0].id;
    return { id, filename, stored_filename, mimetype, size, folder_id, user_id, url, thumbnail_filename, thumbnail_url, preview_filename, preview_url };
  },

  async updateThumbnail(imageId, thumbnailFilename, thumbnailUrl) {
    const { rows } = await db.query(
      'UPDATE images SET thumbnail_filename = $1, thumbnail_url = $2 WHERE id = $3 RETURNING *',
      [thumbnailFilename, thumbnailUrl, imageId]
    );
    return rows[0];
  },

  async findByFolderId(folderId) {
    let query = 'SELECT * FROM images';
    const params = [];
    if (folderId !== null) {
      query += ' WHERE folder_id = $1';
      params.push(folderId);
    }
    query += ' ORDER BY created_at DESC';
    const { rows } = await db.query(query, params);
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query('SELECT * FROM images WHERE id = $1', [id]);
    return rows[0];
  },

  async delete(id) {
    await db.query('DELETE FROM images WHERE id = $1', [id]);
  },

  async findByIds(ids) {
    if (!ids || ids.length === 0) {
      return [];
    }
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
    const { rows } = await db.query(`SELECT * FROM images WHERE id IN (${placeholders})`, ids);
    return rows;
  },
};

module.exports = Image; 