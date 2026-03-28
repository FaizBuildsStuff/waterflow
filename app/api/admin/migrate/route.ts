import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    console.log('Starting migration via API...');
    
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
    
    // Add avatar_url to users
    const userCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'users'`;
    if (!userCols.map(c => c.column_name).includes('avatar_url')) {
      await sql`ALTER TABLE users ADD COLUMN avatar_url TEXT;`;
    }

    // Add subscription columns
    const userColNames = userCols.map(c => c.column_name);
    if (!userColNames.includes('subscription_tier')) {
      await sql`ALTER TABLE users ADD COLUMN subscription_tier TEXT DEFAULT 'free';`;
    }
    if (!userColNames.includes('subscription_status')) {
      await sql`ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT 'trialing';`;
    }
    if (!userColNames.includes('trial_ends_at')) {
      await sql`ALTER TABLE users ADD COLUMN trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '3 days');`;
    }
    if (!userColNames.includes('ai_usage_count')) {
      await sql`ALTER TABLE users ADD COLUMN ai_usage_count INTEGER DEFAULT 0;`;
    }
    if (!userColNames.includes('polar_customer_id')) {
      await sql`ALTER TABLE users ADD COLUMN polar_customer_id TEXT;`;
    }
    if (!userColNames.includes('polar_subscription_id')) {
      await sql`ALTER TABLE users ADD COLUMN polar_subscription_id TEXT;`;
    }

    // Add slug to projects
    const projectCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'projects'`;
    const projectColNames = projectCols.map(c => c.column_name);
    
    if (!projectColNames.includes('slug')) {
      await sql`ALTER TABLE projects ADD COLUMN slug TEXT UNIQUE;`;
      
      const projects = await sql`SELECT id, name FROM projects WHERE slug IS NULL`;
      for (const p of projects) {
        const slug = p.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + p.id;
        await sql`UPDATE projects SET slug = ${slug} WHERE id = ${p.id}`;
      }
    }

    // Add role_id to project_members (optional but good for custom roles)
    const memberCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'project_members'`;
    if (!memberCols.map(c => c.column_name).includes('role_id')) {
      await sql`ALTER TABLE project_members ADD COLUMN role_id INTEGER REFERENCES project_roles(id) ON DELETE SET NULL;`;
    }

    // Create Kanban Columns table
    await sql`
      CREATE TABLE IF NOT EXISTS kanban_columns (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        color TEXT DEFAULT 'bg-zinc-500',
        position INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Populate default columns for projects that don't have any
    const projectsRaw = await sql`SELECT id FROM projects`;
    for (const p of projectsRaw) {
      const [exists] = await sql`SELECT 1 FROM kanban_columns WHERE project_id = ${p.id} LIMIT 1`;
      if (!exists) {
        await sql`
          INSERT INTO kanban_columns (project_id, title, color, position)
          VALUES 
            (${p.id}, 'Todo', 'bg-zinc-500', 0),
            (${p.id}, 'In Progress', 'bg-primary', 1),
            (${p.id}, 'In Review', 'bg-amber-500', 2),
            (${p.id}, 'Done', 'bg-green-500', 3)
        `;
      }
    }

    // Create Docs table
    await sql`
      CREATE TABLE IF NOT EXISTS docs (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        is_public BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return NextResponse.json({ success: true, message: 'Migration successful' });
  } catch (err: any) {
    console.error('Migration error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
