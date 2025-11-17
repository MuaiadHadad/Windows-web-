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
  const email = (req.headers['x-user-email'] || req.query.email) as string | undefined;
  if (!email) return res.status(401).json({ error: 'Missing user' });
  try {
    const { p, data } = await readDb();
    const idx = data.users.findIndex((u) => u.email === email);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    if (req.method === 'GET') {
      return res.status(200).json({ state: data.users[idx].state ?? {} });
    }
    if (req.method === 'PUT') {
      const state = req.body?.state ?? {};
      data.users[idx].state = state;
      await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf-8');
      return res.status(200).json({ ok: true });
    }
    return res.status(405).end();
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}

