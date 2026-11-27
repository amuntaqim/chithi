'use strict';
const { redis, verifyToken, missingConfig, json, readBody, LETTERS_KEY } = require('../lib/server');

const MAX_BATCH = 300;
const MAX_LETTER_BYTES = 250 * 1024;
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;
const PAPERS = ['letter', 'plain', 'lined', 'night'];
const str = v => (typeof v === 'string' ? v : '');

/** শুধু জানা ক্ষেত্রগুলো রাখা হয় */
function clean(l) {
  if (!l || typeof l !== 'object' || !ID_RE.test(String(l.id))) return null;
  const t = Number(l.t);
  if (!Number.isFinite(t) || t <= 0) return null;
  if (l.del) return { id: l.id, t, del: true };
  const out = {
    id: l.id, t, date: str(l.date), sal: str(l.sal), body: str(l.body), close: str(l.close),
    paper: PAPERS.includes(l.paper) ? l.paper : 'letter'
  };
  return Buffer.byteLength(JSON.stringify(out)) > MAX_LETTER_BYTES ? null : out;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'method' });
  if (missingConfig().length) return json(res, 500, { error: 'not_configured' });

  const auth = String(req.headers.authorization || '');
  if (!verifyToken(auth.startsWith('Bearer ') ? auth.slice(7) : '')) return json(res, 401, { error: 'auth' });

  try {
    const body = readBody(req);
    const incoming = (Array.isArray(body.letters) ? body.letters : []).slice(0, MAX_BATCH).map(clean).filter(Boolean);

    if (incoming.length) {
      // যেটা নতুন (t বেশি) সেটাই জেতে
      const existing = await redis([['HMGET', LETTERS_KEY, ...incoming.map(l => l.id)]]);
      const writes = [];
      incoming.forEach((l, i) => {
        let oldT = 0;
        try { oldT = JSON.parse(existing[0][i]).t || 0; } catch {}
        if (l.t > oldT) writes.push(l.id, JSON.stringify(l));
      });
      if (writes.length) await redis([['HSET', LETTERS_KEY, ...writes]]);
    }

    const [flat] = await redis([['HGETALL', LETTERS_KEY]]);
    const letters = [];
    for (let i = 1; i < (flat || []).length; i += 2) { try { letters.push(JSON.parse(flat[i])); } catch {} }
    return json(res, 200, { letters, now: Date.now() });
  } catch (e) {
    console.error('sync', e.message);
    return json(res, 500, { error: 'server' });
  }
};
