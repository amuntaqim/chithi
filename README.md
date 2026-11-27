# দূরাগত বাতাসের চিঠি

Bengali letter-writing site. Plain HTML/CSS/JS — no build step.

## Deploy
1. Push this folder to a GitHub repo (index.html at the repo root).
2. Vercel → Add New Project → import the repo → Framework Preset: **Other** → Deploy.

## Password
Default: `chithi@2026`. To change it, open the live site, open the browser console and run:

    makeHash("your-new-password")

Paste the printed hash into `PASS_HASH` at the top of `js/app.js`, commit, push.

Note: this is a client-side gate. It keeps casual visitors out but is not real security.
For real protection use Vercel's Password Protection (paid plans).

## Where letters live
Saved letters are stored in the browser's localStorage on each device (nothing is uploaded).
Clearing browser data deletes them — export important ones as PDF/JPG.
