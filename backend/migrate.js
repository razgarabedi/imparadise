const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

const migrate = async () => {
  const client = await pool.connect();
  try {
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      await client.query(sql);
    }

    console.log('All migrations completed successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    client.release();
    pool.end();
  }
};

migrate(); 