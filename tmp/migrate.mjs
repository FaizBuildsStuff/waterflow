import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function migrate() {
  console.log('Starting migration...');
  try {
    // Create Project Roles table
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
    console.log('Project Roles table ready.');

    // Add slug to projects
    const projectCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'projects'`;
    const projectColNames = projectCols.map(c => c.column_name);
    
    if (!projectColNames.includes('slug')) {
      console.log('Adding slug column to projects...');
      await sql`ALTER TABLE projects ADD COLUMN slug TEXT UNIQUE;`;
      
      const projects = await sql`SELECT id, name FROM projects WHERE slug IS NULL`;
      for (const p of projects) {
        const slug = p.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + p.id;
        await sql`UPDATE projects SET slug = ${slug} WHERE id = ${p.id}`;
      }
      console.log('Project slugs generated.');
    }

    console.log('Migration successful.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
