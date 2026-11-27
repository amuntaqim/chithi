'use strict';
const crypto = require('crypto');

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const PASSWORD = process.env.CHITHI_PASSWORD;

const LETTERS_KEY = 'chithi:letters';
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // ৩০ দিন

const sha = (s, enc = 'hex') => crypto.createHash('sha256').update(s).digest(enc);
const b64u = b => Buffer.from(b).toString('base64url');

/** সেটআপ ঠিক আছে কিনা — না থাকলে কোন জিনিসটা নেই তা জানায় */
function missingConfig() {
  const m = [];
  if (!PASSWORD) m.push('CHITHI_PASSWORD');
  if (!REDIS_URL || !REDIS_TOKEN) m.push('Upstash Redis (KV_REST_API_URL / KV_REST_API_TOKEN)');
  return m;
}

/** Upstash REST pipeline — একসাথে কয়েকটি Redis কমান্ড */
async function redis(commands) {
  const r = await fetch(REDIS_URL.replace(/\/$/, '') + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + REDIS_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands)
  });
  if (!r.ok) throw new Error('redis ' + r.status);
  const out = await r.json();
  const bad = out.find(x => x && x.error);
  if (bad) throw new Error(bad.error);
  return out.map(x => x.result);
}

/* ---- টোকেন (HMAC সই করা, ডাটাবেসে রাখতে হয় না) ---- */
const signKey = () => sha('chithi-token|' + PASSWORD, 'buffer');
function makeToken() {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = b64u(JSON.stringify({ exp }));
  const sig = b64u(crypto.createHmac('sha256', signKey()).update(payload).digest());
  return { token: payload + '.' + sig, exp };
}
function verifyToken(token) {
  if (typeof token !== 'string') return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const good = crypto.createHmac('sha256', signKey()).update(payload).digest();
  let given; try { given = Buffer.from(sig, 'base64url'); } catch { return false; }
  if (given.length !== good.length || !crypto.timingSafeEqual(given, good)) return false;
  try { return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now(); } catch { return false; }
}
function passwordOk(input) {
  const a = sha(String(input || ''), 'buffer'), b = sha(PASSWORD, 'buffer');
  return crypto.timingSafeEqual(a, b);
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}
function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch { return {}; }
}
const clientIp = req => String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();

module.exports = { redis, makeToken, verifyToken, passwordOk, missingConfig, json, readBody, clientIp, sha, LETTERS_KEY };
