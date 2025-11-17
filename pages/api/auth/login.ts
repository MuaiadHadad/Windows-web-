import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { getUser } from '../../../src/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  try {
    const user = await getUser(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    return res.status(200).json({ email });
  } catch (e: any) {
    console.error('[api/auth/login] Server error:', e);
    const msg = e?.message?.includes('ECONNREFUSED') ? 'Database unavailable' : 'Server error';
    return res.status(500).json({ error: msg });
  }
}
