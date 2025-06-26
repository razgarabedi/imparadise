const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

const migrate = async () => {
  const client = await pool.connect();
  try {
    // Ensure migrations table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Get already executed migrations
    const executedMigrations = await client.query('SELECT name FROM migrations');
    const executedMigrationNames = executedMigrations.rows.map(row => row.name);

    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      if (!executedMigrationNames.includes(file)) {
        console.log(`Running migration: ${file}`);
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        await client.query('BEGIN');
        try {
          await client.query(sql);
          await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
          await client.query('COMMIT');
          console.log(`Migration ${file} completed successfully.`);
        } catch (error) {
          await client.query('ROLLBACK');
          console.error(`Error in migration ${file}:`, error.message);
        }
      }
    }

    console.log('All pending migrations have been attempted.');
  } catch (error) {
    console.error('Migration process failed:', error);
  } finally {
    client.release();
    // Keep the pool alive for the application
  }
};

if (require.main === module) {
  migrate().then(() => pool.end());
}

module.exports = migrate; 