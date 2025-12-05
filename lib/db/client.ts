/**
 * Database Client
 * Vercel Postgres connection using @vercel/postgres
 */

import { sql } from '@vercel/postgres';

// Re-export sql for use in API routes
export { sql };

/**
 * Execute a database query
 */
export async function query<T>(query: string, values?: any[]): Promise<T[]> {
  try {
    const result = await sql.query(query, values);
    return result.rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Execute a single query that returns one row
 */
export async function queryOne<T>(query: string, values?: any[]): Promise<T | null> {
  const results = await query<T>(query, values);
  return results[0] || null;
}

/**
 * Begin a transaction
 */
export async function beginTransaction() {
  await sql`BEGIN`;
}

/**
 * Commit a transaction
 */
export async function commitTransaction() {
  await sql`COMMIT`;
}

/**
 * Rollback a transaction
 */
export async function rollbackTransaction() {
  await sql`ROLLBACK`;
}

/**
 * Health check
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
