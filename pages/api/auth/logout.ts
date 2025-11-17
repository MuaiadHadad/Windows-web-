import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  // Stateless fake logout
  return res.status(200).json({ ok: true });
}

