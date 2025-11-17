import type { NextApiRequest, NextApiResponse } from 'next';
import { getUser, getState, updateState } from '../../../src/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const email = (req.headers['x-user-email'] || req.query.email) as string | undefined;
  if (!email) return res.status(401).json({ error: 'Missing user' });
  try {
    const user = await getUser(email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (req.method === 'GET') {
      const state = await getState(email);
      return res.status(200).json({ state });
    }
    if (req.method === 'PUT') {
      const state = req.body?.state ?? {};
      await updateState(email, state);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).end();
  } catch (e: any) {
    console.error('[api/user/state] Server error:', e);
    const msg = e?.message?.includes('ECONNREFUSED') ? 'Database unavailable' : 'Server error';
    return res.status(500).json({ error: msg });
  }
}
