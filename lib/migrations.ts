import sql from './db';

async function runMigrations() {
  console.log('Running migrations...');
  try {
    await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Medium'`;
    await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assignee_id INTEGER REFERENCES users(id)`;
    await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date TIMESTAMP WITH TIME ZONE`;
    await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS subtasks JSONB DEFAULT '[]'`;
    await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS time_tracked INTEGER DEFAULT 0`;
    await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS description TEXT`;
    console.log('Migrations complete.');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    process.exit(0);
  }
}

runMigrations();
