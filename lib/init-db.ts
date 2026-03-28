import sql from './db';

async function initDb() {
  console.log('Initializing database...');
  try {
    // Create Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        avatar_url TEXT,
        onboarded BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Users table created or exists.');

    // Create Workspaces table
    await sql`
      CREATE TABLE IF NOT EXISTS workspaces (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role TEXT,
        team_size TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Workspaces table created or exists.');

    // Create Projects table
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        workspace_id INTEGER REFERENCES workspaces(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Projects table created or exists.');

    // Update Tasks table with metadata
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        status TEXT DEFAULT 'Todo',
        priority TEXT DEFAULT 'Medium',
        assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        due_date TIMESTAMP WITH TIME ZONE,
        subtasks JSONB DEFAULT '[]',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Tasks table updated or exists.');

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
    console.log('Kanban Columns table created or exists.');

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
    console.log('Docs table created or exists.');

    // Create Project Members table (for sharing)
    await sql`
      CREATE TABLE IF NOT EXISTS project_members (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role TEXT DEFAULT 'member',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, user_id)
      );
    `;
    console.log('Project Members table created or exists.');

    // Create Comments table
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Comments table created or exists.');

    // Migration logic to add columns if they don't exist
    const migrateDb = async () => {
      // Migrate Tasks
      const taskCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'tasks'`;
      const taskNames = taskCols.map(c => c.column_name);
      if (!taskNames.includes('description')) await sql`ALTER TABLE tasks ADD COLUMN description TEXT;`;
      
      // Migrate Users
      const userCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'users'`;
      if (!userCols.map(c => c.column_name).includes('avatar_url')) {
        await sql`ALTER TABLE users ADD COLUMN avatar_url TEXT;`;
      }

      if (!taskNames.includes('priority')) await sql`ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT 'Medium';`;
      if (!taskNames.includes('assignee_id')) await sql`ALTER TABLE tasks ADD COLUMN assignee_id INTEGER;`;
      if (!taskNames.includes('due_date')) await sql`ALTER TABLE tasks ADD COLUMN due_date TIMESTAMP WITH TIME ZONE;`;
      if (!taskNames.includes('subtasks')) await sql`ALTER TABLE tasks ADD COLUMN subtasks JSONB DEFAULT '[]';`;

      // Migrate Projects
      const projectCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'projects'`;
      if (!projectCols.map(c => c.column_name).includes('slug')) {
        await sql`ALTER TABLE projects ADD COLUMN slug TEXT UNIQUE;`;
        // Generate slugs for existing projects
        const projects = await sql`SELECT id, name FROM projects WHERE slug IS NULL`;
        for (const p of projects) {
          const slug = p.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + p.id;
          await sql`UPDATE projects SET slug = ${slug} WHERE id = ${p.id}`;
        }
      }
      // Migrate Kanban Columns
      const kanbanColsTable = await sql`SELECT 1 FROM information_schema.tables WHERE table_name = 'kanban_columns'`;
      if (kanbanColsTable.length > 0) {
        const projects = await sql`SELECT id FROM projects`;
        for (const p of projects) {
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
      }
    };
    await migrateDb();

    console.log('Database initialization complete.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    process.exit(0);
  }
}

initDb();
