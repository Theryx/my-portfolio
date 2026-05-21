import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_HVSsw8eQnZv0@ep-flat-river-apuaf9qm-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

const rows = await sql`SELECT id, content FROM projects WHERE id LIKE 'paysika%'`;
rows.forEach(row => {
  console.log('--- ID:', row.id, '---');
  console.log(row.content);
  console.log('\n');
});
