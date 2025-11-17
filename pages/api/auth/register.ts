import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { createUser, getUser } from '../../../src/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  try {
    const existing = await getUser(email);
    if (existing) return res.status(409).json({ error: 'User already exists' });
    const hash = await bcrypt.hash(password, 10);
    await createUser(email, hash);
    return res.status(201).json({ email });
  } catch (e: any) {
    console.error('[api/auth/register] Server error:', e);
    const msg = e?.message?.includes('ECONNREFUSED') ? 'Database unavailable' : 'Server error';
    return res.status(500).json({ error: msg });
  }
}
