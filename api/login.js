'use strict';
const { redis, makeToken, passwordOk, missingConfig, json, readBody, clientIp, sha } = require('../lib/server');

const MAX_TRIES = 10;     // প্রতি ১৫ মিনিটে একই আইপি থেকে সর্বোচ্চ ১০ বার
const WINDOW_SEC = 15 * 60;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'method' });
  const missing = missingConfig();
  if (missing.length) return json(res, 500, { error: 'not_configured', missing });

  const key = 'chithi:rl:' + sha(clientIp(req)).slice(0, 24);
  try {
    const [count] = await redis([['INCR', key], ['EXPIRE', key, WINDOW_SEC]]);
    if (count > MAX_TRIES) return json(res, 429, { error: 'rate' });

    const { password } = readBody(req);
    if (!passwordOk(password)) return json(res, 401, { error: 'wrong' });

    await redis([['DEL', key]]);
    return json(res, 200, makeToken());
  } catch (e) {
    console.error('login', e.message);
    return json(res, 500, { error: 'server' });
  }
};
