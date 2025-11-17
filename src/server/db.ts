import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'app.db');
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  email TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  state TEXT
);
`);

export function getUser(email: string) {
  const stmt = db.prepare('SELECT email, password, state FROM users WHERE email = ?');
  return stmt.get(email) as { email: string; password: string; state: string | null } | undefined;
}

export function createUser(email: string, passwordHash: string) {
  const stmt = db.prepare('INSERT INTO users (email, password, state) VALUES (?, ?, ?)');
  stmt.run(email, passwordHash, JSON.stringify({}));
}

export function updateState(email: string, state: any) {
  const stmt = db.prepare('UPDATE users SET state = ? WHERE email = ?');
  stmt.run(JSON.stringify(state ?? {}), email);
}

export function getState(email: string) {
  const stmt = db.prepare('SELECT state FROM users WHERE email = ?');
  const row = stmt.get(email) as { state: string | null } | undefined;
  try { return row?.state ? JSON.parse(row.state) : {}; } catch { return {}; }
}

