import sql from './lib/db.js';

async function main() {
  const columns = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'projects';
  `;
  console.log('Projects Schema:', columns);
  process.exit(0);
}

main().catch(console.error);
