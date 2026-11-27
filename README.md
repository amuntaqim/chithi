# দূরাগত বাতাসের চিঠি

Bengali letter-writing site with password login and cross-device sync.
Static front-end (HTML/CSS/JS) + two small Vercel serverless functions (`/api/login`, `/api/sync`) + Upstash Redis for storage. No build step.

## Deploy (one time, ~5 minutes)
1. Push this folder to a GitHub repo (`index.html` at the repo root).
2. Vercel → Add New Project → import the repo → Framework Preset: **Other** → Deploy.
3. In the Vercel project: **Storage** (or Marketplace) → **Upstash → Redis** → create a free database → connect it to this project (all environments).
   This automatically adds `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
4. **Settings → Environment Variables** → add `CHITHI_PASSWORD` = your password (Production, Preview, Development).
5. **Deployments → ⋯ → Redeploy** (new variables only apply to new deployments).

To change the password later: edit `CHITHI_PASSWORD`, redeploy. (All devices will need to log in again.)

## How sync works
- Every device keeps a local copy, so writing works offline.
- Save/delete pushes changes to the server; the app also pulls on open, when you come back to the tab, when the connection returns, and every minute.
- If the same letter is edited on two devices, the most recent save wins. Deletes sync too.
- The password is checked on the server (10 tries per 15 minutes per IP). Letters are only returned to a logged-in device.
- "লক করুন" syncs, then removes the letters from that device (they stay on the server).
- "এই ডিভাইসে মনে রাখুন" keeps you logged in for 30 days on that device; otherwise login lasts until the tab/browser session ends.

## Local testing
Opening `index.html` directly can't reach `/api`. Use `npx vercel dev` (after `vercel link` and `vercel env pull`) to test locally.
