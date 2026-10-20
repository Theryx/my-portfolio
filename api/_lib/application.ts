import type { getDb } from './db.js';

// The `application` column (job-application tracking) is added by
// scripts/migrate-applications.mjs. Write it separately and tolerate its
// absence, so company saves keep working on a database that predates it.
export async function saveApplication(
  sql: ReturnType<typeof getDb>,
  companyId: string,
  application: unknown,
): Promise<Record<string, unknown> | null> {
  if (!application || typeof application !== 'object' || Array.isArray(application)) return null;
  try {
    const rows = await sql`
      UPDATE companies SET application = ${JSON.stringify(application)}::jsonb
      WHERE id = ${companyId}
      RETURNING application`;
    return (rows[0]?.application as Record<string, unknown>) ?? null;
  } catch (err) {
    console.warn('companies.application not saved (run scripts/migrate-applications.mjs):', err);
    return null;
  }
}
