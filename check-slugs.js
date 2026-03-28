import sql from './lib/db.js';

async function checkSlugs() {
  try {
    const projects = await sql`
      SELECT id, name, slug FROM projects WHERE slug IS NULL OR slug = 'null'
    `;
    console.log('Projects with null slugs:', projects);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSlugs();
