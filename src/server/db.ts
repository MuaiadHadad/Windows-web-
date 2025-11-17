import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Optional: ssl for cloud providers
  ssl: process.env.PGSSL?.toLowerCase() === 'true' ? { rejectUnauthorized: false } : undefined,
});

let ensured = false;
async function ensureSchema() {
  if (ensured) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      password TEXT NOT NULL,
      state JSONB
    );
  `);
  ensured = true;
}

export async function getUser(email: string) {
  await ensureSchema();
  const { rows } = await pool.query('SELECT email, password, state FROM users WHERE email = $1', [email]);
  return rows[0] as { email: string; password: string; state: any } | undefined;
}

export async function createUser(email: string, passwordHash: string) {
  await ensureSchema();
  await pool.query('INSERT INTO users (email, password, state) VALUES ($1, $2, $3)', [email, passwordHash, {}]);
}

export async function updateState(email: string, state: any) {
  await ensureSchema();
  await pool.query('UPDATE users SET state = $1 WHERE email = $2', [state ?? {}, email]);
}

export async function getState(email: string) {
  await ensureSchema();
  const { rows } = await pool.query('SELECT state FROM users WHERE email = $1', [email]);
  return rows[0]?.state ?? {};
}
