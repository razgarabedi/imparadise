const db = require('../config/db');

class User {
  static async findByUsername(username) {
    const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return rows[0];
  }

  static async findByEmail(email) {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  }

  static async findById(id) {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
  }

  static async create(username, email, passwordHash, role = 'user') {
    const { rows } = await db.query(
      'INSERT INTO users (username, email, password_hash, role, storage_limit, storage_used) VALUES ($1, $2, $3, $4, 5368709120, 0) RETURNING *',
      [username, email, passwordHash, role]
    );
    return rows[0];
  }

  static async count() {
    const { rows } = await db.query('SELECT COUNT(*) FROM users');
    return parseInt(rows[0].count, 10);
  }

  static async findAll() {
    const { rows } = await db.query('SELECT id, username, email, role, created_at, updated_at, storage_limit, storage_used FROM users');
    return rows;
  }

  static async updateRole(id, role) {
    const { rows } = await db.query(
      'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [role, id]
    );
    return rows[0];
  }

  static async delete(id) {
    const { rows } = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return rows[0];
  }

  static async updateStorageUsed(userId, storageChange) {
    const { rows } = await db.query(
      'UPDATE users SET storage_used = storage_used + $1 WHERE id = $2 RETURNING *',
      [storageChange, userId]
    );
    return rows[0];
  }

  static async updateStorageLimit(userId, newLimit) {
    const { rows } = await db.query(
      'UPDATE users SET storage_limit = $1 WHERE id = $2 RETURNING *',
      [newLimit, userId]
    );
    return rows[0];
  }

  static async updateProfile(id, username, email) {
    const { rows } = await db.query(
      'UPDATE users SET username = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, username, email, role, created_at, updated_at',
      [username, email, id]
    );
    return rows[0];
  }

  static async updatePassword(id, passwordHash) {
    const { rows } = await db.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id',
      [passwordHash, id]
    );
    return rows[0];
  }

  static async updateProfilePicture(id, profilePictureUrl) {
    const { rows } = await db.query(
      'UPDATE users SET profile_picture_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, profile_picture_url',
      [profilePictureUrl, id]
    );
    return rows[0];
  }
}

module.exports = User; 