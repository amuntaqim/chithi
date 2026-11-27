(() => {
'use strict';

/* ================= সেটিং ================= */
// পাসওয়ার্ড বদলাতে: সাইট খুলে ব্রাউজার কনসোলে  makeHash("নতুন-পাসওয়ার্ড")  চালান,
// যে হ্যাশ পাবেন সেটি নিচে বসিয়ে দিন। (ডিফল্ট পাসওয়ার্ড: chithi@2026)
const PASS_HASH = '13818c9124e89577bc11280a671015c7feed5fe7631c238aedd5b59c337bba30';

const LS_LETTERS = 'chithi.letters.v1';
const LS_DRAFT = 'chithi.draft.v1';
const SS_OK = 'chithi.unlocked';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const bn = n => Number(n).toLocaleString('bn-BD');

/* ================= আইকন ================= */
const UI = {
  undo:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
  redo:'<path d="m15 14 5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h3"/>',
  left:'<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>',
  center:'<path d="M4 6h16M7 10h10M4 14h16M7 18h10"/>',
  right:'<path d="M4 6h16M10 10h10M4 14h16M10 18h10"/>',
  justify:'<path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>',
  ul:'<path d="M10 6h10M10 12h10M10 18h10"/><circle cx="4.5" cy="6" r=".8"/><circle cx="4.5" cy="12" r=".8"/><circle cx="4.5" cy="18" r=".8"/>',
  ol:'<path d="M11 6h9M11 12h9M11 18h9"/><path d="M4 4.5 5.2 4v4M3.8 13.5c0-1.2 2.4-1.2 2.4 0 0 1-2.4 1.6-2.4 2.5h2.4M3.8 19.2h2.2l-1.1 1.2c1 0 1.4.5 1.4 1.1 0 .9-1.3 1.3-2.5.9"/>',
  eraser:'<path d="m7 21-4.3-4.3a1 1 0 0 1 0-1.4l9.6-9.6a1 1 0 0 1 1.4 0l5.6 5.6a1 1 0 0 1 0 1.4L11 21"/><path d="M22 21H7M5 11l9 9"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  smile:'<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
  color:'<path d="M6 16 12 3l6 13M8.2 11.5h7.6"/><rect class="bar" x="4" y="19" width="16" height="3" rx="1"/>',
  mark:'<path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>',
  paper:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  save:'<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/>',
  down:'<path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m21 16-5-5-8 9"/>',
  trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  back:'<path d="m15 18-6-6 6-6"/>',
  pen:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'
};
const ico = n => `<svg viewBox="0 0 24 24" aria-hidden="true">${UI[n]}</svg>`;
$$('[data-ico]').forEach(el => el.insertAdjacentHTML('afterbegin', ico(el.dataset.ico)));

// চিঠিতে বসানোর ২ডি আইকন (ফ্ল্যাট রঙিন)
const STICKERS = [
  ['হৃদয়','<path fill="#e0405a" d="M16 28C6 21 3 15 3 10.5 3 6.9 5.9 4 9.5 4c2.7 0 5 1.5 6.5 3.8C17.5 5.5 19.8 4 22.5 4 26.1 4 29 6.9 29 10.5 29 15 26 21 16 28z"/>'],
  ['তারা','<path fill="#f6b83d" stroke="#e39a12" stroke-width="1.2" stroke-linejoin="round" d="m16 3 3.8 8.6 9.2 1-6.9 6.2 2 9.2L16 23.3 7.9 28l2-9.2L3 12.6l9.2-1z"/>'],
  ['ফুল','<g fill="#f08fb0"><circle cx="16" cy="8.5" r="5.5"/><circle cx="24" cy="14" r="5.5"/><circle cx="21" cy="23" r="5.5"/><circle cx="11" cy="23" r="5.5"/><circle cx="8" cy="14" r="5.5"/></g><circle cx="16" cy="16.5" r="4.5" fill="#f6c744"/>'],
  ['সূর্য','<g stroke="#f6b83d" stroke-width="2.6" stroke-linecap="round"><path d="M16 2.5v4M16 25.5v4M2.5 16h4M25.5 16h4M6.5 6.5l2.8 2.8M22.7 22.7l2.8 2.8M25.5 6.5l-2.8 2.8M9.3 22.7l-2.8 2.8"/></g><circle cx="16" cy="16" r="7" fill="#f9c846"/>'],
  ['মেঘ','<path fill="#8ec5f5" d="M9.5 25a6 6 0 0 1-.9-11.9 8 8 0 0 1 15.3-1.6A6.5 6.5 0 0 1 23 25z"/><path fill="#b9dcfa" d="M9.5 25a6 6 0 0 1-.9-11.9A8 8 0 0 1 14 7.2 9 9 0 0 0 10 16a6 6 0 0 0 3 9z" opacity=".6"/>'],
  ['চাঁদ','<path fill="#f3c75a" d="M22 4a12.5 12.5 0 1 0 6 22.5A10 10 0 0 1 22 4z"/>'],
  ['পাতা','<path fill="#6aa84f" d="M5 27C5 13 13 6 27 5c0 14-6 22-20 22z"/><path d="M5 27 20 12" stroke="#3f7a2f" stroke-width="1.8" stroke-linecap="round"/>'],
  ['খাম','<rect x="3" y="7" width="26" height="18" rx="2.5" fill="#fff" stroke="#c0392b" stroke-width="2"/><path d="m3.8 8.5 12.2 9.5 12.2-9.5" fill="none" stroke="#c0392b" stroke-width="2" stroke-linejoin="round"/>'],
  ['ডাকবাক্স','<path fill="#d62828" d="M10 28V12a6 6 0 0 1 12 0v16z"/><rect x="12" y="13.5" width="8" height="2.6" rx=".8" fill="#3a0d0d"/><rect x="8" y="27" width="16" height="2.6" rx="1" fill="#8f1d1d"/><circle cx="16" cy="4.2" r="1.6" fill="#8f1d1d"/>'],
  ['পাখি','<polygon fill="#6e4529" points="7,17 1.5,23 9,22"/><ellipse cx="15" cy="18" rx="9" ry="7.5" fill="#8a5a3c"/><circle cx="22" cy="12" r="5.2" fill="#8a5a3c"/><ellipse cx="20.5" cy="18.5" rx="5" ry="5.2" fill="#f2762e"/><polygon fill="#f2b84b" points="26.6,11.3 30.5,12.6 26.6,13.9"/><circle cx="23.6" cy="11" r="1" fill="#222"/><path d="M13 25v3M17 25v3" stroke="#6e4529" stroke-width="1.5" stroke-linecap="round"/>'],
  ['গান','<path d="M12 24V8l14-3v16" fill="none" stroke="#5b6ee1" stroke-width="2.6" stroke-linejoin="round"/><circle cx="9" cy="24" r="3.6" fill="#5b6ee1"/><circle cx="23" cy="21" r="3.6" fill="#5b6ee1"/>'],
  ['চা','<path d="M6 12h17v8a7 7 0 0 1-7 7h-3a7 7 0 0 1-7-7z" fill="#fff" stroke="#a0522d" stroke-width="2"/><path d="M23 14h2.5a3.5 3.5 0 0 1 0 7H22.5" fill="none" stroke="#a0522d" stroke-width="2"/><path d="M11 8c0-2 2-2 2-4M17 8c0-2 2-2 2-4" fill="none" stroke="#b8a89a" stroke-width="1.8" stroke-linecap="round"/>'],
  ['হাসি','<circle cx="16" cy="16" r="12.5" fill="#f9d65c"/><circle cx="11.5" cy="13" r="1.7" fill="#7a4b00"/><circle cx="20.5" cy="13" r="1.7" fill="#7a4b00"/><path d="M10 19c2 4.2 10 4.2 12 0" fill="none" stroke="#7a4b00" stroke-width="2" stroke-linecap="round"/>'],
  ['কলম','<path d="M26 4C14 5 8 13 8 22l-3 6 6-3c9 0 17-6 15-21z" fill="#7aa7e0"/><path d="M5 28 19 13" stroke="#2f5fa8" stroke-width="1.8" stroke-linecap="round"/>'],
  ['ঘুড়ি','<polygon points="16,3 26,14 16,26 6,14" fill="#e94f6a"/><path d="M16 3v23M6 14h20" stroke="#fff" stroke-width="1.3" opacity=".8"/><path d="M16 26c-3 1-1 3-4 4s0 2-1 2" fill="none" stroke="#6b7d3a" stroke-width="1.6" stroke-linecap="round"/>'],
  ['কাগজের বিমান','<polygon points="3,15 29,4 22,28 16,19" fill="#fff" stroke="#4a90d9" stroke-width="2" stroke-linejoin="round"/><path d="m29 4-13 15v7l3.5-5" fill="none" stroke="#4a90d9" stroke-width="2" stroke-linejoin="round"/>']
];
const svgWrap = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${inner}</svg>`;
const svgURI = inner => 'data:image/svg+xml;utf8,' + encodeURIComponent(svgWrap(inner));

/* ================= ছোট সহায়ক ================= */
const toastEl = $('#toast'); let toastT;
function toast(msg, ms = 2200) {
  clearTimeout(toastT); toastEl.textContent = msg; toastEl.classList.add('show');
  if (ms) toastT = setTimeout(() => toastEl.classList.remove('show'), ms);
}
const hideToast = () => { clearTimeout(toastT); toastEl.classList.remove('show'); };

const dlg = $('#dlg');
function ask(text, okLabel = 'ঠিক আছে') {
  return new Promise(res => {
    $('#dlgText').textContent = text; $('#dlgOk').textContent = okLabel; dlg.returnValue = '';
    dlg.addEventListener('close', () => res(dlg.returnValue === 'ok'), { once: true });
    dlg.showModal();
  });
}
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ================= পাসওয়ার্ড ================= */
async function sha256(t) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}
window.makeHash = async p => { const h = await sha256(p); console.log(h); return h; };

const gate = $('#gate'), pw = $('#pw'), gateMsg = $('#gateMsg');
gate.addEventListener('submit', async e => {
  e.preventDefault();
  let ok = false;
  try { ok = (await sha256(pw.value)) === PASS_HASH; }
  catch { gateMsg.textContent = 'এই ব্রাউজারে যাচাই করা যাচ্ছে না। https অথবা localhost-এ খুলুন।'; return; }
  if (ok) { sessionStorage.setItem(SS_OK, '1'); unlock(); }
  else {
    gateMsg.textContent = 'পাসওয়ার্ড মেলেনি। আবার চেষ্টা করুন।';
    gate.classList.remove('shake'); void gate.offsetWidth; gate.classList.add('shake'); pw.select();
  }
});
function unlock() {
  gate.hidden = true; $('#homeNav').hidden = false; $('#lockBtn').hidden = false;
  pw.value = ''; gateMsg.textContent = ''; updateCount();
}
function lock() {
  sessionStorage.removeItem(SS_OK); closeDrawer(); closePops(); showView('home');
  gate.hidden = false; $('#homeNav').hidden = true; $('#lockBtn').hidden = true;
}
$('#lockBtn').addEventListener('click', lock);

function showView(name) {
  if (name === 'app' && sessionStorage.getItem(SS_OK) !== '1') name = 'home';
  $('#home').hidden = name !== 'home'; $('#app').hidden = name !== 'app';
  window.scrollTo(0, 0);
}

/* ================= সংরক্ষণ ================= */
const loadAll = () => { try { return JSON.parse(localStorage.getItem(LS_LETTERS)) || []; } catch { return []; } };
function storeAll(a) {
  try { localStorage.setItem(LS_LETTERS, JSON.stringify(a)); return true; }
  catch { toast('জায়গা ভরে গেছে — কিছু চিঠি মুছুন অথবা PDF করে রাখুন', 3500); return false; }
}
const updateCount = () => { $('#homeCount').textContent = bn(loadAll().length); };

/* ================= এডিটর ================= */
const paper = $('#paper');
const fDate = $('#fDate'), fSal = $('#fSal'), fBody = $('#fBody'), fClose = $('#fClose');
const FLDS = [fDate, fSal, fBody, fClose];
let cur = { id: null }, dirty = false, paperStyle = 'letter';
let lastFld = fBody, savedRange = null;

const PERIODS = h => h < 4 ? 'রাত' : h < 6 ? 'ভোর' : h < 12 ? 'সকাল' : h < 15 ? 'দুপুর' : h < 18 ? 'বিকাল' : h < 20 ? 'সন্ধ্যা' : 'রাত';
function fmtDate(d = new Date()) {
  return new Intl.DateTimeFormat('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}
function fmtTime(d = new Date()) {
  const h = d.getHours(), m = d.getMinutes();
  return `${PERIODS(h)} ${bn(h % 12 || 12)}:${m < 10 ? '০' + bn(m) : bn(m)}`;
}

function setPaper(k) {
  paperStyle = k;
  paper.classList.remove('p-letter', 'p-plain', 'p-lined'); paper.classList.add('p-' + k);
  const p = $('#pop-paper'); if (p) $$('button', p).forEach(b => b.classList.toggle('on', b.dataset.k === k));
}
const snap = () => ({ id: cur.id, date: fDate.innerHTML, sal: fSal.innerHTML, body: fBody.innerHTML, close: fClose.innerHTML, paper: paperStyle, t: Date.now() });
function restore(s) {
  fDate.innerHTML = s.date || ''; fSal.innerHTML = s.sal || ''; fBody.innerHTML = s.body || ''; fClose.innerHTML = s.close || '';
  setPaper(s.paper || 'letter'); cur.id = s.id || null;
}
const textOf = html => { const d = document.createElement('div'); d.innerHTML = html; return d.textContent.trim(); };
function isEmpty() {
  return !textOf(fSal.innerHTML) && !textOf(fBody.innerHTML) && !textOf(fClose.innerHTML) && !fBody.querySelector('img');
}
function newLetter() {
  cur.id = null; fDate.innerHTML = fmtDate(); fSal.innerHTML = ''; fBody.innerHTML = ''; fClose.innerHTML = '';
  dirty = false; refreshMeta(); saveDraft();
}
const saveDraft = () => { try { localStorage.setItem(LS_DRAFT, JSON.stringify({ ...snap(), dirty })); } catch {} };
let draftT; const queueDraft = () => { clearTimeout(draftT); draftT = setTimeout(saveDraft, 500); };

function refreshMeta() {
  const txt = [fSal, fBody, fClose].map(f => f.innerText).join(' ').trim();
  const n = txt ? txt.split(/\s+/).length : 0;
  $('#wordCount').textContent = `${bn(n)} শব্দ`;
  $('#status').textContent = dirty ? 'অসংরক্ষিত' : (cur.id ? 'সংরক্ষিত' : (isEmpty() ? 'নতুন' : 'অসংরক্ষিত'));
}
function markDirty() { dirty = true; refreshMeta(); queueDraft(); }

function titleOf(s) {
  let t = textOf(s.sal).replace(/[,،\s]+$/, '');
  if (!t) t = textOf(s.body).slice(0, 28);
  return t || 'শিরোনামহীন চিঠি';
}

async function save() {
  if (isEmpty()) { toast('আগে কিছু লিখুন'); return; }
  const list = loadAll(), s = snap();
  if (!s.id) s.id = uid();
  const i = list.findIndex(x => x.id === s.id);
  if (i >= 0) list[i] = s; else list.unshift(s);
  if (storeAll(list)) {
    cur.id = s.id; dirty = false; saveDraft(); refreshMeta(); updateCount(); renderList(); toast('সংরক্ষিত হয়েছে');
  }
}
async function removeCurrent() {
  const list = loadAll(), saved = cur.id && list.some(x => x.id === cur.id);
  if (!saved && isEmpty()) { toast('মোছার মতো কিছু নেই'); return; }
  const ok = await ask(saved ? 'এই চিঠিটি মুছে ফেলবেন? আর ফিরে পাওয়া যাবে না।' : 'এই লেখাটুকু মুছে ফেলবেন?', 'মুছুন');
  if (!ok) return;
  if (saved) { storeAll(list.filter(x => x.id !== cur.id)); updateCount(); renderList(); }
  newLetter(); toast('মুছে ফেলা হয়েছে');
}
async function confirmDiscard() {
  if (dirty && !isEmpty()) return ask('বর্তমান চিঠির অসংরক্ষিত পরিবর্তন হারিয়ে যাবে। এগিয়ে যাবেন?', 'এগিয়ে যান');
  return true;
}

/* ---------- ক্ষেত্রগুলোর আচরণ ---------- */
function normalize(f) { if (!f.textContent.trim() && !f.querySelector('img')) f.innerHTML = ''; }
FLDS.forEach((f, i) => {
  f.addEventListener('input', () => { normalize(f); markDirty(); });
  f.addEventListener('paste', e => {
    e.preventDefault();
    let t = (e.clipboardData || window.clipboardData).getData('text/plain');
    if (f === fSal) t = t.replace(/\s*\n+\s*/g, ' ');
    document.execCommand('insertText', false, t);
  });
  if (f === fSal) f.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); FLDS[i + 1].focus(); }
  });
});
document.addEventListener('selectionchange', () => {
  const sel = getSelection(); if (!sel.rangeCount) return;
  const r = sel.getRangeAt(0), f = FLDS.find(x => x.contains(r.commonAncestorContainer));
  if (f) { lastFld = f; savedRange = r.cloneRange(); updateToggles(); }
});
function focusFld() {
  if (!FLDS.includes(document.activeElement)) {
    lastFld.focus();
    if (savedRange) { const s = getSelection(); s.removeAllRanges(); s.addRange(savedRange); }
  }
}
function cmd(name, val = null) {
  focusFld(); document.execCommand('styleWithCSS', false, true); document.execCommand(name, false, val); markDirty();
}
const TOGGLES = ['bold', 'italic', 'underline', 'strikeThrough', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'insertUnorderedList', 'insertOrderedList'];
function updateToggles() {
  $$('[data-cmd]').forEach(b => {
    if (!TOGGLES.includes(b.dataset.cmd)) return;
    let on = false; try { on = document.queryCommandState(b.dataset.cmd); } catch {}
    b.setAttribute('aria-pressed', on);
  });
}
function insertText(t) { focusFld(); document.execCommand('insertText', false, t); markDirty(); }
function insertSticker(inner) {
  focusFld();
  document.execCommand('insertHTML', false, `<img class="ic" alt="" draggable="false" src="${svgURI(inner)}">`);
  markDirty();
}
function applySize(m) {
  focusFld();
  if (getSelection().isCollapsed) { toast('আগে লেখাটুকু বেছে নিন'); return; }
  document.execCommand('styleWithCSS', false, false);
  document.execCommand('fontSize', false, '7');
  $$('font[size="7"]', lastFld).forEach(f => {
    const s = document.createElement('span');
    s.style.fontSize = `calc(var(--fs) * ${m})`;
    while (f.firstChild) s.appendChild(f.firstChild);
    $$('[style*="font-size"]', s).forEach(x => { x.style.fontSize = ''; });
    f.replaceWith(s);
  });
  markDirty();
}

/* ---------- টুলবার ও পপওভার ---------- */
const COLORS = ['#2a2220', '#9b0008', '#d62828', '#e67e22', '#c9971c', '#6b7d3a', '#2e7d4f', '#1b8a8f', '#2f86e3', '#1a3f8f', '#7b3fa0', '#d6457a'];
const MARKS = ['#fff3a3', '#ffd6e1', '#cfe6ff', '#d8f0c8', '#ffe0b8', 'none'];
const SIZES = [['ছোট', .85], ['সাধারণ', 1], ['বড়', 1.3], ['আরও বড়', 1.7], ['শিরোনাম', 2.2]];
const PAPERS = [['letter', 'আকাশি পত্র'], ['plain', 'সাদা কাগজ'], ['lined', 'রুল টানা']];

const GROUPS = [
  [{ c: 'undo', i: 'undo', t: 'পূর্বাবস্থা' }, { c: 'redo', i: 'redo', t: 'আবার করুন' }],
  [{ p: 'size', h: '<span class="tx">আ</span>', t: 'লেখার মাপ' },
   { c: 'bold', h: '<span class="tx">B</span>', t: 'গাঢ়' },
   { c: 'italic', h: '<span class="tx" style="font-style:italic;font-family:serif">I</span>', t: 'বাঁকা' },
   { c: 'underline', h: '<span class="tx" style="text-decoration:underline">U</span>', t: 'নিচে দাগ' },
   { c: 'strikeThrough', h: '<span class="tx" style="text-decoration:line-through">S</span>', t: 'মাঝ দাগ' }],
  [{ p: 'color', i: 'color', t: 'লেখার রঙ' }, { p: 'mark', i: 'mark', t: 'হাইলাইট' }],
  [{ c: 'justifyLeft', i: 'left', t: 'বাঁয়ে' }, { c: 'justifyCenter', i: 'center', t: 'মাঝে' },
   { c: 'justifyRight', i: 'right', t: 'ডানে' }, { c: 'justifyFull', i: 'justify', t: 'দুই পাশে সমান' }],
  [{ c: 'insertUnorderedList', i: 'ul', t: 'বুলেট তালিকা' }, { c: 'insertOrderedList', i: 'ol', t: 'ক্রমিক তালিকা' }],
  [{ a: 'date', i: 'calendar', t: 'আজকের তারিখ বসান' }, { a: 'time', i: 'clock', t: 'এখনকার সময় বসান' }, { p: 'icons', i: 'smile', t: 'আইকন' }],
  [{ p: 'paper', i: 'paper', t: 'কাগজের ধরন' }, { c: 'removeFormat', i: 'eraser', t: 'ফরম্যাট মুছুন' }]
];
const toolbar = $('#toolbar');
GROUPS.forEach(g => {
  const d = document.createElement('div'); d.className = 'tgroup';
  g.forEach(it => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'tb'; b.title = it.t; b.setAttribute('aria-label', it.t);
    b.innerHTML = it.h || ico(it.i);
    if (it.c) b.dataset.cmd = it.c; if (it.p) b.dataset.pop = it.p; if (it.a) b.dataset.act = it.a;
    d.appendChild(b);
  });
  toolbar.appendChild(d);
});
toolbar.addEventListener('mousedown', e => { if (e.target.closest('.tb')) e.preventDefault(); });

const pops = {};
function makePop(id, cls, html) {
  const d = document.createElement('div');
  d.className = 'pop'; d.id = 'pop-' + id; d.hidden = true; d.innerHTML = `<div class="${cls}">${html}</div>`;
  d.addEventListener('mousedown', e => e.preventDefault());
  document.body.appendChild(d); pops[id] = d; return d;
}
makePop('size', 'pop-list', SIZES.map(([n, m]) => `<button type="button" data-m="${m}" style="font-size:${14 + m * 4}px">${n}</button>`).join(''));
makePop('color', 'pop-colors', COLORS.map(c => `<button type="button" class="swatch" data-c="${c}" style="background:${c}" aria-label="${c}"></button>`).join(''));
makePop('mark', 'pop-colors', MARKS.map(c => c === 'none'
  ? `<button type="button" class="swatch none" data-c="none" aria-label="হাইলাইট নেই"></button>`
  : `<button type="button" class="swatch" data-c="${c}" style="background:${c}" aria-label="${c}"></button>`).join(''));
makePop('icons', 'pop-icons', STICKERS.map(([n, s], i) => `<button type="button" data-i="${i}" title="${n}" aria-label="${n}">${svgWrap(s)}</button>`).join(''));
makePop('paper', 'pop-list', PAPERS.map(([k, n]) => `<button type="button" data-k="${k}">${n}</button>`).join(''));

pops.size.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { applySize(+b.dataset.m); closePops(); } });
pops.color.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  cmd('foreColor', b.dataset.c); toolbar.querySelector('[data-pop="color"]').style.setProperty('--bar', b.dataset.c); closePops();
});
pops.mark.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  cmd('hiliteColor', b.dataset.c === 'none' ? 'transparent' : b.dataset.c); closePops();
});
pops.icons.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { insertSticker(STICKERS[+b.dataset.i][1]); closePops(); } });
pops.paper.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { setPaper(b.dataset.k); markDirty(); closePops(); } });
setPaper('letter');

function closePops(except) {
  Object.entries(pops).forEach(([k, p]) => { if (k !== except) p.hidden = true; });
  $$('[data-pop]').forEach(b => { if (b.dataset.pop !== except) b.classList.remove('on'); });
}
toolbar.addEventListener('click', e => {
  const b = e.target.closest('.tb'); if (!b) return;
  if (b.dataset.cmd) { closePops(); cmd(b.dataset.cmd); updateToggles(); }
  else if (b.dataset.act) {
    closePops(); focusFld();
    // তারিখের ঘরে সময় বসালে আগের লেখার পরে নতুন লাইনে বসবে
    if (b.dataset.act === 'time' && lastFld === fDate && fDate.textContent.trim()) document.execCommand('insertLineBreak');
    insertText(b.dataset.act === 'date' ? fmtDate() : fmtTime());
  }
  else if (b.dataset.pop) {
    const id = b.dataset.pop, p = pops[id], wasOpen = !p.hidden;
    closePops(id); p.hidden = wasOpen; b.classList.toggle('on', !wasOpen);
    if (!wasOpen) {
      const r = b.getBoundingClientRect(), side = matchMedia('(min-width:1060px)').matches;
      const left = side ? r.right + 10 : r.left, top = side ? r.top : r.bottom + 6;
      p.style.left = Math.max(8, Math.min(left, innerWidth - p.offsetWidth - 8)) + 'px';
      p.style.top = Math.max(8, Math.min(top, innerHeight - p.offsetHeight - 8)) + 'px';
    }
  }
});
document.addEventListener('pointerdown', e => { if (!e.target.closest('.pop,[data-pop]')) closePops(); });
window.addEventListener('scroll', () => closePops(), { passive: true });
window.addEventListener('resize', () => closePops());

/* ================= আমার চিঠি (ড্রয়ার) ================= */
const drawer = $('#drawer'), scrim = $('#scrim'), listEl = $('#list');
function openDrawer() {
  renderList(); scrim.hidden = false; requestAnimationFrame(() => scrim.classList.add('open'));
  drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false');
}
function closeDrawer() {
  drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); scrim.classList.remove('open');
  setTimeout(() => { if (!drawer.classList.contains('open')) scrim.hidden = true; }, 220);
}
function renderList() {
  const list = loadAll().sort((a, b) => b.t - a.t);
  if (!list.length) {
    listEl.innerHTML = '<div class="empty">এখনও কোনো চিঠি সংরক্ষণ করা হয়নি।<br>একটি চিঠি লিখে “সংরক্ষণ” চাপুন।</div>'; return;
  }
  listEl.innerHTML = '';
  list.forEach(s => {
    const it = document.createElement('div');
    it.className = 'item' + (s.id === cur.id ? ' current' : ''); it.tabIndex = 0; it.setAttribute('role', 'button');
    const h = document.createElement('h3'); h.textContent = titleOf(s);
    const tm = document.createElement('time');
    tm.textContent = `${fmtDate(new Date(s.t))}, ${fmtTime(new Date(s.t))}`;
    const p = document.createElement('p'); p.textContent = textOf(s.body).slice(0, 90) || '—';
    const del = document.createElement('button');
    del.type = 'button'; del.className = 'tb'; del.title = 'মুছুন'; del.setAttribute('aria-label', 'মুছুন'); del.innerHTML = ico('trash');
    del.addEventListener('click', async ev => {
      ev.stopPropagation();
      if (!await ask(`“${titleOf(s)}” মুছে ফেলবেন? আর ফিরে পাওয়া যাবে না।`, 'মুছুন')) return;
      storeAll(loadAll().filter(x => x.id !== s.id)); updateCount();
      if (cur.id === s.id) newLetter();
      renderList(); toast('মুছে ফেলা হয়েছে');
    });
    const open = async () => {
      if (s.id !== cur.id && !await confirmDiscard()) return;
      restore(s); dirty = false; refreshMeta(); saveDraft(); closeDrawer(); showView('app');
    };
    it.addEventListener('click', open);
    it.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); open(); } });
    it.append(h, del, tm, p); listEl.appendChild(it);
  });
}
scrim.addEventListener('click', closeDrawer);
$('#drawerClose').addEventListener('click', closeDrawer);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeDrawer(); closePops(); }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && !$('#app').hidden) { e.preventDefault(); save(); }
});

/* ================= এক্সপোর্ট (PDF / JPG) ================= */
// html2canvas নিজের ক্লোন ডকুমেন্টে লেখা আঁকে — সেখানে ফন্ট আগে লোড হয়ে না থাকলে অন্য ফন্ট এসে যায়।
async function loadFonts(doc) {
  try {
    await Promise.all([400, 500, 600, 700].flatMap(w => [
      doc.fonts.load(`${w} 20px "Noto Serif Bengali"`, 'আমার চিঠি অআকখ'),
      doc.fonts.load(`${w} 20px "Noto Serif Bengali"`, 'ABC abc 123')
    ]));
    await doc.fonts.ready;
  } catch {}
}
async function renderCanvas() {
  if (typeof html2canvas === 'undefined') throw new Error('lib');
  closePops(); getSelection().removeAllRanges(); document.activeElement && document.activeElement.blur();
  await loadFonts(document);
  const w = paper.offsetWidth, h = paper.offsetHeight;
  const scale = Math.max(1, Math.min(Math.max(2, 1800 / w), 3, 16000 / h));
  const canvas = await html2canvas(paper, {
    scale, backgroundColor: '#ffffff', useCORS: true, logging: false,
    onclone: async d => { d.getElementById('paper').classList.add('exporting'); await loadFonts(d); }
  });
  return { canvas, w, h };
}
const stamp = () => new Date().toISOString().slice(0, 10);
function download(url, name) {
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
}
async function exportAs(kind) {
  const btn = $(kind === 'pdf' ? '#pdfBtn' : '#jpgBtn'); btn.disabled = true; toast('তৈরি হচ্ছে…', 0);
  try {
    const { canvas, w, h } = await renderCanvas();
    if (kind === 'jpg') {
      canvas.toBlob(b => { const u = URL.createObjectURL(b); download(u, `chithi-${stamp()}.jpg`); setTimeout(() => URL.revokeObjectURL(u), 4000); }, 'image/jpeg', 0.95);
    } else {
      if (!window.jspdf) throw new Error('lib');
      const wp = w * 0.75, hp = h * 0.75; // px → pt; পাতার মাপ লেখার দৈর্ঘ্য অনুযায়ী বাড়ে
      const pdf = new window.jspdf.jsPDF({ unit: 'pt', format: [wp, hp], orientation: hp >= wp ? 'p' : 'l', compress: true });
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.93), 'JPEG', 0, 0, wp, hp);
      pdf.save(`chithi-${stamp()}.pdf`);
    }
    hideToast(); toast('ডাউনলোড শুরু হয়েছে');
  } catch (err) {
    console.error(err); hideToast();
    toast(err.message === 'lib' ? 'এক্সপোর্ট লাইব্রেরি লোড হয়নি — ইন্টারনেট দেখে আবার চেষ্টা করুন' : 'এক্সপোর্ট করা যায়নি, আবার চেষ্টা করুন', 3500);
  } finally { btn.disabled = false; }
}

/* ================= বোতামের সংযোগ ================= */
$('#goWrite').addEventListener('click', () => showView('app'));
$('#goList').addEventListener('click', () => { showView('app'); openDrawer(); });
$('#backBtn').addEventListener('click', () => showView('home'));
$('#listBtn').addEventListener('click', openDrawer);
$('#newBtn').addEventListener('click', async () => {
  if (!await confirmDiscard()) return;
  newLetter(); fSal.focus(); toast('নতুন চিঠি');
});
$('#saveBtn').addEventListener('click', save);
$('#delBtn').addEventListener('click', removeCurrent);
$('#pdfBtn').addEventListener('click', () => exportAs('pdf'));
$('#jpgBtn').addEventListener('click', () => exportAs('jpg'));

/* ================= শুরু ================= */
(function init() {
  let d = null; try { d = JSON.parse(localStorage.getItem(LS_DRAFT)); } catch {}
  if (d && (d.id || textOf(d.sal || '') || textOf(d.body || '') || textOf(d.close || ''))) { restore(d); dirty = !!d.dirty; refreshMeta(); }
  else newLetter();
  if (sessionStorage.getItem(SS_OK) === '1') unlock();
  updateCount();
})();

})();
