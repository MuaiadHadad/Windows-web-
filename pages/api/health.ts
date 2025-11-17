import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const start = Date.now();
    await pool.query('SELECT 1');
    return res.status(200).json({ ok: true, db: 'connected', ms: Date.now() - start });
  } catch (e: any) {
    console.error('[api/health] error', e);
    return res.status(500).json({ ok: false, error: e.message });
  }
}

