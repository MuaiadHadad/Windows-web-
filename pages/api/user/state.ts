import type { NextApiRequest, NextApiResponse } from 'next';
import { getUser, getState, updateState } from '../../../src/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const email = (req.headers['x-user-email'] || req.query.email) as string | undefined;
  if (!email) return res.status(401).json({ error: 'Missing user' });
  const user = getUser(email);
  if (!user) return res.status(404).json({ error: 'User not found' });

  try {
    if (req.method === 'GET') {
      return res.status(200).json({ state: getState(email) });
    }
    if (req.method === 'PUT') {
      const state = req.body?.state ?? {};
      updateState(email, state);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).end();
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}
