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
  return { p, data: JSON.parse(raw) as { users: UserRecord[] } };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  try {
    const { p, data } = await readDb();
    const exists = data.users.some((u) => u.email === email);
    if (exists) return res.status(409).json({ error: 'User already exists' });
    data.users.push({ email, password, state: {} });
    await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf-8');
    return res.status(201).json({ email });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}

