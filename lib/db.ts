import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_cCsiZ5mD0AgG@ep-calm-sun-anga7o8o-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sql = postgres(connectionString, {
  ssl: 'require',
});

export default sql;
