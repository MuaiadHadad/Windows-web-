import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

interface UserRecord {
  email: string;
  password: string;
  state?: any;
}

async function readDb() {
  const p = path.join(process.cwd(), 'data', 'users.json');
  const raw = await fs.readFile(p, 'utf-8');
  return JSON.parse(raw) as { users: UserRecord[] };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  try {
    const db = await readDb();
    const user = db.users.find((u) => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    return res.status(200).json({ email });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}

