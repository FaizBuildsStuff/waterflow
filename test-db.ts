import sql from './lib/db';

async function main() {
  console.log('Altering table...');
  try {
    // 1. Add column
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS owner_id INTEGER`;
    
    // 2. Set default owner_id based on workspace owner_id
    await sql`
      UPDATE projects p
      SET owner_id = w.owner_id
      FROM workspaces w
      WHERE p.workspace_id = w.id AND p.owner_id IS NULL
    `;
    
    console.log('Successfully added owner_id and updated existing records.');
  } catch(e) {
    console.error('Error during ALTER TABLE:', e);
  }
  process.exit(0);
}

main().catch(console.error);
