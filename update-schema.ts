import sql from './lib/db';

async function main() {
  console.log('Ensuring project_roles table exists...');
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS project_roles (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        color TEXT DEFAULT '#1a7fe0',
        permissions JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, name)
      );
    `;

    console.log('Ensuring role_id column exists in project_members...');
    const memberCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'project_members'`;
    if (!memberCols.map((c: any) => c.column_name).includes("role_id")) {
      await sql`ALTER TABLE project_members ADD COLUMN role_id INTEGER REFERENCES project_roles(id) ON DELETE SET NULL;`;
    }

    console.log('Ensuring blocked_by_ids exists in tasks...');
    const taskCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'tasks'`;
    if (!taskCols.map((c: any) => c.column_name).includes("blocked_by_ids")) {
      await sql`ALTER TABLE tasks ADD COLUMN blocked_by_ids INTEGER[] DEFAULT '{}';`;
    }

    console.log('Database schema is up to date.');
  } catch (e) {
    console.error('Migration error:', e);
  }
  process.exit(0);
}

main().catch(console.error);
