const {
  useState,
  useEffect,
  useRef
} = React;

/* ---------- Supabase ---------- */
const SUPABASE_URL = 'https://gygsgjiatmpshsbrzhok.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5Z3NnamlhdG1wc2hzYnJ6aG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMjAwMzYsImV4cCI6MjEwMTU5NjAzNn0.RYjEeSZxI5vknAPzrAP2Zw9o4TaMptm9FrwskSBuu_o';
const sbClient = typeof window !== 'undefined' && window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

/* ---------- constants ---------- */
const PALETTE = ['#0071e3', '#34c759', '#ff9500', '#ff3b30', '#af52de', '#5ac8fa'];
const NONRECURRING_COLOR = '#8e8e93';
const ICONS = [{
  key: 'home',
  path: 'M3 11.5L12 4l9 7.5M5.5 10v9a1 1 0 0 0 1 1h4v-6h3v6h4a1 1 0 0 0 1-1v-9'
}, {
  key: 'car',
  path: 'M4 16h16M5 16l1.5-5a2 2 0 0 1 2-1.5h7a2 2 0 0 1 2 1.5L19 16M6 16v2.5a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1V16M19 16v2.5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V16'
}, {
  key: 'plane',
  path: 'M3 12l18-9-9 18-2-8-7-1z'
}, {
  key: 'gift',
  path: 'M4 8h16v4H4zM5 12h14v9H5zM12 8v13M8.5 8a1.8 1.8 0 1 1 3.5-0.7A1.8 1.8 0 1 1 15.5 8'
}, {
  key: 'heart',
  path: 'M12 20s-7-4.35-9.5-8.5C.5 8 2 4.5 6 4.5c2.2 0 3.7 1.2 6 3.7 2.3-2.5 3.8-3.7 6-3.7 4 0 5.5 3.5 3.5 7C19 15.65 12 20 12 20z'
}, {
  key: 'star',
  path: 'M12 2l2.9 6.5L21 9.3l-5 4.6L17.5 21 12 17.6 6.5 21 8 13.9l-5-4.6 6.1-.8L12 2z'
}];
const MORE_ICONS = [{
  key: 'book',
  path: 'M4 4.5A2.5 2.5 0 0 1 6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5v-15zM4 19.5A2.5 2.5 0 0 1 6.5 17H20'
}, {
  key: 'briefcase',
  path: 'M3 7h18v13H3zM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18'
}, {
  key: 'grad',
  path: 'M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 1 3 3 6 3s6-2 6-3v-5'
}, {
  key: 'wallet',
  path: 'M3 7h15a3 3 0 0 1 3 3v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7zM16 12h3'
}, {
  key: 'phone',
  path: 'M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM11 18h2'
}, {
  key: 'camera',
  path: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'
}, {
  key: 'shield',
  path: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z'
}];
const MORE_COLORS = ['#ff2d55', '#5856d6', '#a2845e', '#8e8e93', '#ffcc00', '#30d158'];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAY_NAMES = ["M", "T", "W", "T", "F", "S", "S"];
const STORAGE_KEY = 'pf_data_v2';

/* category icons (auto-guessed from name) */
const CATEGORY_ICON_PATHS = {
  home: 'M3 11.5L12 4l9 7.5M5.5 10v9a1 1 0 0 0 1 1h4v-6h3v6h4a1 1 0 0 0 1-1v-9',
  shield: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z',
  car: 'M4 16h16M5 16l1.5-5a2 2 0 0 1 2-1.5h7a2 2 0 0 1 2 1.5L19 16M6 16v2.5a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1V16M19 16v2.5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V16',
  bag: 'M6 8h12l-1 12H7L6 8zM9 8V6a3 3 0 0 1 6 0v2',
  bolt: 'M13 2L4 14h6l-1 8 9-12h-6l1-8z',
  phone: 'M6 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2C10.5 21 3 13.5 3 5a2 2 0 0 1 2-2z',
  heart: 'M12 20s-7-4.35-9.5-8.5C.5 8 2 4.5 6 4.5c2.2 0 3.7 1.2 6 3.7 2.3-2.5 3.8-3.7 6-3.7 4 0 5.5 3.5 3.5 7C19 15.65 12 20 12 20z',
  wrench: 'M14.7 6.3a4 4 0 1 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2 2.8-2.8z',
  star: 'M12 2l2.9 6.5L21 9.3l-5 4.6L17.5 21 12 17.6 6.5 21 8 13.9l-5-4.6 6.1-.8L12 2z'
};
const CATEGORY_ICON_RULES = [{
  re: /arriendo|renta|alquiler|hipoteca|rent|mortgage/i,
  icon: 'home'
}, {
  re: /seguro|insurance/i,
  icon: 'shield'
}, {
  re: /gasolina|combustible|auto|carro|veh[ií]c|gas|fuel|car/i,
  icon: 'car'
}, {
  re: /comida|super|mercado|restaurante|food|groceries|grocery|restaurant/i,
  icon: 'bag'
}, {
  re: /servicio|luz|agua|internet|el[eé]ctric|utilit|electric|water/i,
  icon: 'bolt'
}, {
  re: /celular|tel[eé]fono|phone|cell/i,
  icon: 'phone'
}, {
  re: /personal|skincare|belleza/i,
  icon: 'heart'
}, {
  re: /mantenimiento|reparaci[oó]n|maintenance|repair/i,
  icon: 'wrench'
}];
function categoryIconPath(name) {
  const rule = CATEGORY_ICON_RULES.find(r => r.re.test(name || ''));
  return CATEGORY_ICON_PATHS[rule ? rule.icon : 'star'];
}
function pad2(n) {
  return String(n).padStart(2, '0');
}
function entryDateStr(e) {
  return e.date || toDateStr(e.year, e.month, e.day || 1);
}
function parseMonthYearLabel(label) {
  const parts = (label || '').split(' ');
  const mi = MONTH_NAMES.indexOf(parts[0]);
  const yr = parseInt(parts[1], 10);
  return {
    month: mi,
    year: yr
  };
}
function buildPersistPayload(state) {
  return {
    tab: state.tab,
    income: state.income,
    payFrequency: state.payFrequency,
    nextPaydayDate: state.nextPaydayDate,
    paycheckLog: state.paycheckLog,
    nonRecurringBudget: state.nonRecurringBudget,
    hasSeenWelcome: state.hasSeenWelcome,
    skippedBudgetSetup: state.skippedBudgetSetup,
    incomeHistory: state.incomeHistory,
    seenTabIntro: state.seenTabIntro,
    incomeProfile: state.incomeProfile,
    studentAge: state.studentAge,
    investsWithParents: state.investsWithParents,
    employmentType: state.employmentType,
    hasFixedContracts: state.hasFixedContracts,
    language: state.language,
    pendingLeftover: state.pendingLeftover,
    spendingBoost: state.spendingBoost,
    notificationsEnabled: state.notificationsEnabled,
    dismissedTips: state.dismissedTips,
    lastProcessedMonth: state.lastProcessedMonth,
    lastProcessedYear: state.lastProcessedYear,
    expenseCategories: state.expenseCategories,
    expenseLog: state.expenseLog,
    plannedExpenses: state.plannedExpenses,
    hustles: state.hustles,
    goals: state.goals,
    investments: state.investments,
    selectedGoalId: state.selectedGoalId,
    _updatedAt: Date.now()
  };
}
function toDateStr(year, month, day) {
  return year + '-' + pad2(month + 1) + '-' + pad2(day);
}
function buildCalendarWeeks(year, month) {
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
const storageAdapter = {
  async get(key) {
    if (typeof window !== 'undefined' && window.storage && typeof window.storage.get === 'function') {
      try {
        return await window.storage.get(key);
      } catch (e) {/* fall through to localStorage */}
    }
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? {
        key,
        value: raw,
        shared: false
      } : null;
    } catch (e) {
      return null;
    }
  },
  async set(key, value) {
    if (typeof window !== 'undefined' && window.storage && typeof window.storage.set === 'function') {
      try {
        return await window.storage.set(key, value);
      } catch (e) {/* fall through to localStorage */}
    }
    window.localStorage.setItem(key, value);
    return {
      key,
      value,
      shared: false
    };
  }
};

/* ---------- helpers ---------- */
function css(s) {
  const o = {};
  (s || '').split(';').forEach(rule => {
    if (!rule.trim()) return;
    const idx = rule.indexOf(':');
    if (idx < 0) return;
    const prop = rule.slice(0, idx).trim().replace(/-([a-z])/g, (m, c) => c.toUpperCase());
    const val = rule.slice(idx + 1).trim();
    if (prop) o[prop] = val;
  });
  return o;
}
function fmt(n) {
  return '$' + Math.round(n || 0).toLocaleString('en-US');
}
function pfRevealRef(el) {
  if (!el || el._pfRevealed) return;
  if (typeof IntersectionObserver === 'undefined') {
    el.classList.add('pf-visible');
    return;
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('pf-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
  io.observe(el);
  el._pfRevealed = true;
}
function sum(rows) {
  return rows.reduce((a, r) => a + (parseFloat(r.amount) || 0), 0);
}
function monthsBetween(from, to) {
  return Math.max((to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()), 1);
}
function addMonths(date, n) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}
// --- Time horizon per goal ---
// If the goal has an exact customDate, derive the horizon in months from today.
// Otherwise fall back to the coarse goal.horizon selector ('short'|'medium'|'long').
function goalHorizonMonths(goal, today) {
  if (goal && goal.customDate) {
    const cd = new Date(goal.customDate + 'T00:00:00');
    if (!isNaN(cd.getTime())) {
      const m = (cd.getFullYear() - today.getFullYear()) * 12 + (cd.getMonth() - today.getMonth());
      return Math.max(m, 0);
    }
  }
  return null;
}
function classifyHorizonMonths(m) {
  if (m == null) return null;
  return m < 36 ? 'short' : m < 84 ? 'medium' : 'long';
}
function goalHorizonClass(goal, today) {
  const m = goalHorizonMonths(goal, today);
  if (m != null) return classifyHorizonMonths(m);
  return goal && goal.horizon ? goal.horizon : null;
}
// Simple keyword heuristic to guess whether an investment is equity/stocks,
// used only when the user hasn't set investment.assetType explicitly.
function guessAssetType(inv) {
  if (inv && inv.assetType) return inv.assetType;
  const txt = ((inv && inv.fund || '') + ' ' + (inv && inv.name || '')).toLowerCase();
  if (!txt.trim()) return null;
  const equity = ['stock', 'stocks', 'equity', 'equities', 'acci', 's&p', 'sp500', 'sp 500', 'index', 'indice', 'índice', 'etf', 'vti', 'voo', 'vt ', 'qqq', 'nasdaq', 'total market', 'growth', '401k', 'roth', 'ira', 'brokerage'];
  const bonds = ['bond', 'bonos', 'treasury', 'tesoro', 'bnd', 'agg', 'fixed income', 'renta fija'];
  const cash = ['cash', 'savings', 'ahorro', 'high yield', 'high-yield', 'hysa', 'money market', 'cd ', 'certificate'];
  if (bonds.some(k => txt.includes(k))) return 'bonds';
  if (cash.some(k => txt.includes(k))) return 'cash';
  if (equity.some(k => txt.includes(k))) return 'equity';
  return null;
}
// Money contributed (principal, no market gain) into funds linked to a goal.
// A goal's shown progress = its own logged savings + what's deposited in its funds.
function linkedFundContrib(goal, investments) {
  if (!goal || !investments) return 0;
  return investments.filter(i => i.goalId === goal.id).reduce((a, i) => a + (i.amount || 0), 0);
}
function goalCurrentTotal(goal, investments) {
  return (goal.current || 0) + linkedFundContrib(goal, investments);
}
function buildGoalSparkline(goal, monthlyBoosted, today) {
  const N = 6;
  const months = [];
  for (let i = N - 1; i >= 0; i--) {
    const d = addMonths(today, -i);
    months.push({ year: d.getFullYear(), month: d.getMonth() });
  }
  const monthSums = months.map(m => (goal.savingsLog || []).filter(e => {
    const p = parseMonthYearLabel(e.label);
    return p.year === m.year && p.month === m.month;
  }).reduce((a, e) => a + e.amount, 0));
  let running = 0;
  const actual = monthSums.map(v => (running += v));
  return { actual };
}
function buildInvestmentSparkline(inv, today) {
  const N = 6;
  const months = [];
  for (let i = N - 1; i >= 0; i--) {
    const d = addMonths(today, -i);
    months.push({ year: d.getFullYear(), month: d.getMonth() });
  }
  const monthSums = months.map(m => (inv.log || []).filter(e => {
    const d = new Date(e.date + 'T00:00:00');
    return d.getFullYear() === m.year && d.getMonth() === m.month;
  }).reduce((a, e) => a + e.amount, 0));
  let running = 0;
  const actual = monthSums.map(v => (running += v));
  return { actual };
}
function smoothCurveD(pts) {
  if (pts.length < 2) return '';
  let d = 'M ' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const mx = (x0 + x1) / 2;
    d += ' Q ' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' ' + mx.toFixed(1) + ' ' + ((y0 + y1) / 2).toFixed(1);
  }
  const last = pts[pts.length - 1];
  d += ' T ' + last[0].toFixed(1) + ' ' + last[1].toFixed(1);
  return d;
}
function GoalSparkline({ actual, color, height, showDot }) {
  const H = height || 54,
    pad = 6;
  const [w, setW] = React.useState(280);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setW(Math.max(40, Math.round(el.clientWidth)));
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const W = w;
  const N = actual.length;
  const maxY = Math.max(1, ...actual);
  const xAt = i => pad + (W - pad * 2) * (N > 1 ? i / (N - 1) : 0);
  const yAt = v => H - pad - (H - pad * 2) * (v / maxY);
  const coords = actual.map((v, i) => [xAt(i), yAt(v)]);
  const d = smoothCurveD(coords);
  const last = coords[coords.length - 1];
  const dot = showDot !== false;
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      width: '100%',
      minWidth: 0,
      lineHeight: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: '0 0 ' + W + ' ' + H,
    height: H,
    preserveAspectRatio: "none",
    style: {
      display: 'block',
      width: '100%',
      height: H
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: d,
    fill: "none",
    stroke: color,
    strokeWidth: 2.5,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), dot && /*#__PURE__*/React.createElement("circle", {
    cx: last[0],
    cy: last[1],
    r: 3.5,
    fill: color
  })));
}
function MultiSparkline({ series, color, height }) {
  const H = height || 72,
    pad = 6;
  const [w, setW] = React.useState(280);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setW(Math.max(40, Math.round(el.clientWidth)));
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const W = w;
  const N = Math.max(2, ...series.map(s => s.length));
  const maxY = Math.max(1, ...series.reduce((a, s) => a.concat(s), []));
  const xAt = i => pad + (W - pad * 2) * (N > 1 ? i / (N - 1) : 0);
  const yAt = v => H - pad - (H - pad * 2) * (v / maxY);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      width: '100%',
      minWidth: 0,
      lineHeight: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: '0 0 ' + W + ' ' + H,
    preserveAspectRatio: "none",
    style: {
      display: 'block',
      width: '100%',
      height: H
    }
  }, series.map((s, idx) => {
    const coords = s.map((v, i) => [xAt(i), yAt(v)]);
    const d = smoothCurveD(coords);
    const last = coords[coords.length - 1];
    const op = Math.max(0.32, 1 - idx * 0.55);
    return /*#__PURE__*/React.createElement("g", {
      key: idx,
      opacity: op
    }, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "none",
      stroke: color,
      strokeWidth: 2.5,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      vectorEffect: "non-scaling-stroke"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: last[0],
      cy: last[1],
      r: 3.5,
      fill: color
    }));
  })));
}
function currentMonthKey() {
  const d = new Date();
  return d.getFullYear() + '-' + d.getMonth();
}
function iconPathFor(key) {
  const f = ICONS.concat(MORE_ICONS).find(i => i.key === key);
  return f ? f.path : ICONS[0].path;
}
async function sha256Hex(str) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
function readLock() {
  try { const raw = localStorage.getItem('pf_lock_v1'); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
}
function writeLock(v) {
  try { if (v) localStorage.setItem('pf_lock_v1', JSON.stringify(v)); else localStorage.removeItem('pf_lock_v1'); } catch (e) {}
}
function b64FromBuf(buf) {
  let str = ''; const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str);
}
function bufFromB64(b64) {
  const bin = atob(b64); const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}
async function bioSupported() {
  try { return !!(window.PublicKeyCredential && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()); } catch (e) { return false; }
}
async function bioRegister(userId) {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const cred = await navigator.credentials.create({ publicKey: {
    challenge: challenge, rp: { name: 'Financial Planner' },
    user: { id: new TextEncoder().encode(userId || 'user'), name: userId || 'user', displayName: userId || 'user' },
    pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
    authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' }, timeout: 60000 } });
  return b64FromBuf(cred.rawId);
}
async function bioVerify(credId) {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  await navigator.credentials.get({ publicKey: {
    challenge: challenge, allowCredentials: [{ type: 'public-key', id: bufFromB64(credId) }],
    userVerification: 'required', timeout: 60000 } });
  return true;
}
function isBlankState(st) {
  // A brand-new / not-yet-set-up device: no onboarding done and no real data.
  // We must never let this state overwrite or out-timestamp a real cloud backup.
  return !!st && !st.hasSeenWelcome && (!st.goals || st.goals.length === 0) && (!st.expenseCategories || st.expenseCategories.length === 0) && (!st.expenseLog || st.expenseLog.length === 0);
}
function defaultState() {
  const today = new Date();
  return {
    tab: 'inicio',
    income: 0,
    payFrequency: 'monthly',
    nextPaydayDate: '',
    paycheckLog: [],
    nonRecurringBudget: 0,
    hasSeenWelcome: false,
    skippedBudgetSetup: false,
    incomeHistory: [],
    seenTabIntro: {
      inicio: false,
      metas: false,
      gastos: false,
      extra: false,
      invest: false
    },
    incomeProfile: 'salary',
    studentAge: null,
    investsWithParents: null,
    employmentType: 'fulltime',
    hasFixedContracts: null,
    language: 'en',
    pendingLeftover: null,
    spendingBoost: 0,
    notificationsEnabled: false,
    dismissedTips: {},
    lastProcessedMonth: today.getMonth(),
    lastProcessedYear: today.getFullYear(),
    expenseCategories: [],
    expenseLog: [],
    plannedExpenses: [],
    hustles: [],
    goals: [],
    selectedGoalId: null,
    investments: [],
    logMonth: today.getMonth(),
    logYear: today.getFullYear()
  };
}
function monthlyIncomeOf(s) {
  return s.payFrequency === 'biweekly' ? (s.income || 0) * 26 / 12 : s.income || 0;
}
function nextPaydayFrom(anchorStr, today) {
  if (!anchorStr) return null;
  let d = new Date(anchorStr + 'T00:00:00');
  if (isNaN(d.getTime())) return null;
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  while (d.getTime() < t.getTime()) d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 14);
  while (d.getTime() - 14 * 86400000 >= t.getTime()) d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 14);
  return d;
}
function receivedThisMonth(s, today) {
  const y = today.getFullYear(),
    m = today.getMonth();
  return (s.paycheckLog || []).filter(p => {
    const d = new Date(p.date + 'T00:00:00');
    return d.getFullYear() === y && d.getMonth() === m;
  }).reduce((a, p) => a + p.amount, 0);
}
function actualMonthlyIncomeOf(s, today) {
  if (s.payFrequency !== 'biweekly') return s.income || 0;
  // Budget against the smoothed monthly income (≈2.17 paychecks/mo). A single
  // paycheck logged mid-month is only part of the month's income, so it must NOT
  // replace the monthly figure — otherwise "available this month" collapses to $0
  // until every paycheck is in. Actual deposits only RAISE income above the
  // expectation (a 3-paycheck month, a bonus, or extra "other" deposits).
  const received = receivedThisMonth(s, today);
  const expected = monthlyIncomeOf(s);
  return Math.max(received, expected);
}
function computeCtx(s) {
  const today = new Date();
  const totalExpenses = sum(s.expenseCategories) + (s.nonRecurringBudget || 0) + (s.spendingBoost || 0);
  const hustleTotal = sum(s.hustles);
  const generalHustleTotal = s.hustles.filter(h => !h.goalId).reduce((a, h) => a + (h.amount || 0), 0);
  const monthlyIncome = actualMonthlyIncomeOf(s, today);
  const usingActualPaychecks = s.payFrequency === 'biweekly' && receivedThisMonth(s, today) > 0;
  const baseAvailable = monthlyIncome - totalExpenses;
  const boostedAvailable = monthlyIncome + generalHustleTotal - totalExpenses;
  // Investments can opt into the same auto/manual split as goals.
  // An investment participates only if its effective mode is 'auto' or 'manual'
  // (default new/existing investments are 'off' and don't take a share).
  const invs = s.investments || [];
  // A fund synced to a goal is that goal's *vehicle* — the goal's own share of the
  // split flows into it. It is NOT a separate claimant, so it doesn't take an extra %.
  // Only funds with their own independent mode participate as separate claimants.
  const effInvMode = i => {
    if (i.goalId && i.syncWithGoal) return 'off';
    return i.mode === 'auto' || i.mode === 'manual' ? i.mode : 'off';
  };
  const effInvPercent = i => {
    if (i.goalId && i.syncWithGoal) return 0;
    return i.percent || 0;
  };
  // A completed goal (fully funded) stops taking a share of the split, so the
  // freed-up % flows to the remaining active goals/investments automatically.
  const goalActive = g => !(g.target > 0 && goalCurrentTotal(g, s.investments) >= g.target);
  const manualGoalTotal = s.goals.filter(g => g.mode === 'manual' && goalActive(g)).reduce((a, g) => a + (g.percent || 0), 0);
  const manualInvTotal = invs.filter(i => effInvMode(i) === 'manual').reduce((a, i) => a + (effInvPercent(i) || 0), 0);
  const manualPercentTotal = manualGoalTotal + manualInvTotal;
  const autoGoalCount = s.goals.filter(g => g.mode !== 'manual' && goalActive(g)).length;
  const autoInvCount = invs.filter(i => effInvMode(i) === 'auto').length;
  const autoCount = Math.max(autoGoalCount + autoInvCount, 1);
  const autoPercentEach = Math.max(100 - manualPercentTotal, 0) / autoCount;
  const assignedByGoal = {};
  s.hustles.forEach(h => {
    if (h.goalId) assignedByGoal[h.goalId] = (assignedByGoal[h.goalId] || 0) + (h.amount || 0);
  });
  return {
    totalExpenses,
    hustleTotal,
    generalHustleTotal,
    monthlyIncome,
    usingActualPaychecks,
    baseAvailable,
    boostedAvailable,
    manualPercentTotal,
    autoCount,
    autoPercentEach,
    assignedByGoal,
    effInvMode,
    effInvPercent,
    today
  };
}

/* ---------- app ---------- */
function InfoTip({
  text
}) {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState(null);
  const btnRef = React.useRef(null);
  // Position the tooltip in viewport (fixed) coordinates, clamped to the screen so
  // it can never push past the right/left edge and widen the app. 8px min margin.
  const place = React.useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const M = 8;
    const w = Math.min(230, vw - M * 2);
    let left = r.left; // try to align left edge with the icon
    if (left + w > vw - M) left = vw - M - w; // would overflow right → pull left
    if (left < M) left = M; // don't go past left edge either
    setPos({
      top: r.bottom + 6,
      left,
      width: w
    });
  }, []);
  React.useEffect(() => {
    if (!open) return;
    place();
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open, place]);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("button", {
    ref: btnRef,
    onClick: () => setOpen(o => !o),
    style: {
      background: '#e5e5ea',
      border: 'none',
      borderRadius: '50%',
      width: 16,
      height: 16,
      fontSize: 10,
      fontWeight: 700,
      color: '#6e6e73',
      cursor: 'pointer',
      lineHeight: '16px',
      padding: 0,
      marginLeft: 6,
      verticalAlign: 'middle'
    }
  }, "i"), open && pos && /*#__PURE__*/React.createElement("span", {
    onClick: () => setOpen(false),
    style: {
      position: 'fixed',
      top: pos.top,
      left: pos.left,
      zIndex: 60,
      background: '#1d1d1f',
      color: '#fff',
      fontSize: 11.5,
      fontWeight: 400,
      lineHeight: 1.45,
      padding: '10px 12px',
      borderRadius: 10,
      width: pos.width,
      boxSizing: 'border-box',
      boxShadow: '0 10px 26px rgba(0,0,0,0.25)',
      display: 'block',
      textTransform: 'none',
      letterSpacing: 'normal'
    }
  }, text));
}
// Height (px) the on-screen keyboard is covering, via the visual viewport. Used to
// lift bottom-sheet modals above the keyboard so their inputs stay visible.
function useKeyboardInset() {
  const [inset, setInset] = React.useState(0);
  React.useEffect(() => {
    const vv = typeof window !== 'undefined' ? window.visualViewport : null;
    if (!vv) return;
    const onResize = () => {
      const gap = window.innerHeight - vv.height - vv.offsetTop;
      setInset(gap > 80 ? gap : 0);
    };
    vv.addEventListener('resize', onResize);
    vv.addEventListener('scroll', onResize);
    onResize();
    return () => {
      vv.removeEventListener('resize', onResize);
      vv.removeEventListener('scroll', onResize);
    };
  }, []);
  return inset;
}
const STRINGS = {
  en: {
    tabHome: 'Home',
    tabGoals: 'Goals',
    tabExpenses: 'Expenses',
    tabExtra: 'Extra',
    tabInvest: 'Portfolio',
    edit: 'Edit',
    done: 'Done',
    log: 'Log',
    save: 'Save',
    checkIn: 'Check in',
    checked: '✓ Checked',
    on: 'On',
    turnOn: 'Turn on',
    off: 'Off',
    exportData: '⬇ Export data',
    importData: '⬆ Import data',
    sendFeedback: '✉️ Send feedback',
    resetApp: 'Reset app',
    quarterlyReport: '⬇ Quarterly report',
    annualReport: '⬇ Annual report',
    addExpense: '+ Add expense',
    addGoal: 'Goal',
    addSideHustle: '+ Add side hustle',
    addInvestment: '+ Add investment',
    reports: 'Reports',
    backupTransfer: 'Backup & transfer',
    feedback: 'Feedback',
    reset: 'Reset',
    plannedBudget: 'Planned budget',
    nonRecurringAllowance: 'Non-recurring allowance',
    investments: 'Portfolio',
    extraIncome: 'Extra income',
    goals: 'Goals',
    logSavings: 'Log savings',
    savingsLogged: 'Savings logged',
    thisYear: 'This year',
    target: 'Target',
    current: 'Current',
    color: 'Color',
    icon: 'Icon',
    depositReminder: 'Deposit reminder',
    setReminder: 'Set reminder',
    savingsProjection: 'Savings projection (next 12 months)',
    hitDate: 'Want to hit a specific date?',
    timeHorizon: 'Time horizon',
    horizonShort: 'Soon (under 3 years)',
    horizonMedium: 'In a few years (3–7)',
    horizonLong: 'Long term / retirement (7+)',
    horizonShortTag: 'Short term',
    horizonMediumTag: 'Medium term',
    horizonLongTag: 'Long term',
    horizonHint: 'No exact date? Pick a rough timeframe instead.',
    investShareTitle: 'Monthly savings share',
    investShareOff: 'Off',
    investShareHint: 'Include this fund in the automatic split of your extra money.',
    linkToGoal: 'For which goal?',
    notLinked: 'Not linked',
    matchGoalPct: "Match the goal's %",
    assetTypeLabel: 'What kind of fund is it?',
    assetTypeHint: 'Only used to flag if it fits your goal’s time horizon.',
    assetEquity: 'Stocks',
    assetEquityDesc: 'can rise and fall with the market',
    assetBonds: 'Bonds',
    assetBondsDesc: 'steadier',
    assetOther: 'Other',
    assetOtherDesc: 'real estate, crypto, etc.',
    assetUnsure: 'Not sure',
    assetUnsureDesc: 'no heads-up either way',
    guideEquityShort: 'Heads up: this looks like stocks, but its goal is short term. Money you’ll need within ~3 years is usually kept in cash or bonds, so a market dip right before you need it can’t hurt you. You can keep it — just worth weighing.',
    guideEquityMedium: 'Note: stocks for a medium-term goal (3–7 yrs) carries some timing risk. A blend of stocks and bonds is a common middle ground. Your call.',
    monthSummaryTitle: 'Month summary',
    msIncome: 'Income',
    msSpent: 'Spent',
    msLeftover: 'Left over',
    msByCategory: 'By category',
    msNonRecurring: 'Non-recurring',
    msAssignTitle: 'Put your leftover to work',
    msAssignHint: 'Suggested from your plan — edit anything before confirming.',
    msUseSuggestion: 'Use plan suggestion',
    msSpending: 'Spending money',
    msLeftToAssign: 'left to assign',
    msOverAssigned: "that's more than you have",
    msConfirm: 'Confirm',
    msSaveAll: 'Save it all per my plan',
    msKeepSpending: 'Keep as spending money',
    msNoLeftover: 'No leftover to review right now.',
    msIncomeNote: 'Income shown is your current monthly setting.',
    notifToggle: 'End-of-month reminder',
    notifToggleDesc: 'Get a notification to review and assign your leftover.',
    notifBlocked: 'Notifications are turned off in your device or browser settings — turn them on there to receive it.',
    coachEyebrow: 'Guide',
    coachSeeAll: 'See all tips',
    coachNotNow: 'Not now',
    coachGotIt: 'Got it',
    coachAllGood: "You're on track — no tips right now.",
    guideTitle: 'Guide',
    guideIntro: 'General rules of thumb based on your setup — not personalized advice. Apply or edit anything.',
    retireGoalName: 'Retirement',
    tipRetireTitle: 'Give your Roth IRA a retirement target',
    tipRetireBody: 'A Roth IRA is for retirement. I can add a “Retirement” goal with a target estimated by the 25× rule — save about 25× a year of your spending. Then withdrawing ~4%/yr from it would cover your costs without running out. Fully editable.',
    retireCreate: 'Create goal',
    retireNote: 'Target estimated with the 25× rule (25 × a year of your spending). Withdrawing ~4%/yr from it would roughly cover your expenses — it’s a general guide, so adjust it to your case.',
    settings: 'Settings',
    welcome: 'Welcome',
    getStarted: 'Get started',
    monthlyIncome: 'Monthly income',
    incomePerPaycheck: 'Income / paycheck',
    availableMonth: 'Available / month',
    totalSaved: 'Total saved',
    totalInvested: 'Total invested',
    spentSoFar: 'spent so far',
    allowanceLabel: 'Allowance',
    fixedContractsLabel: 'Fixed contracts income',
    freelanceExtrasLabel: 'Freelance extras',
    languageLabel: 'Language',
    profileQTitle: 'What do you do?',
    profileAllowance: "I'm a student",
    profileSalary: 'I have a fixed job',
    profileFreelance: "I'm a freelancer or entrepreneur",
    howOldQ: 'How old are you?',
    yourAge: 'Your age',
    investQ: 'Do you invest along with your parents?',
    investYes: 'Yes, we invest together',
    investNo: "No / I'm not sure",
    employmentQ: 'Full-time or part-time?',
    fulltimeLabel: 'Full-time',
    parttimeLabel: 'Part-time',
    payFreqQ: 'How do you get paid?',
    monthlyLabel: 'Monthly',
    biweeklyLabel: 'Biweekly',
    fixedContractsQ: 'Do you have fixed contracts?',
    yesLabel: 'Yes',
    noLabel: 'No, it varies',
    continueLabel: 'Continue',
    gotIt: 'Got it',
    completed: 'Completed',
    profileMenu: 'Profile',
    reportsMenu: 'Reports',
    moreMenu: 'Backup, feedback & reset',
    profileMenuDesc: 'Language and how you get money',
    reportsMenuDesc: 'Download quarterly and annual reports',
    moreMenuDesc: 'Export/import data, send feedback, reset',
    tabIntroHome: "This is your money at a glance. The ring tracks your spending against budget this month. Set your income above, and check back here daily.",
    tabIntroGoals: "Set savings targets and see exactly how your monthly money splits between them. Log a deposit any time, or set a target date to see what it takes to get there.",
    tabIntroExpenses: "Tap any day on the calendar to log what you spent, or plan ahead. Mark categories as 'Fixed' if they're always the same amount — those auto-fill for you.",
    tabIntroExtra: "Track side income here. Assign it to a goal, and each month you tap 'Check in' it gets added to that goal's savings.",
    tabIntroInvest: "Track what's growing outside your goals. Just enter what you invested and what it's worth today — update it every so often."
  },
  es: {
    tabHome: 'Inicio',
    tabGoals: 'Metas',
    tabExpenses: 'Gastos',
    tabExtra: 'Extra',
    tabInvest: 'Portafolio',
    edit: 'Editar',
    done: 'Listo',
    log: 'Registrar',
    save: 'Guardar',
    checkIn: 'Confirmar mes',
    checked: '✓ Confirmado',
    on: 'Activado',
    turnOn: 'Activar',
    off: 'Apagado',
    exportData: '⬇ Exportar datos',
    importData: '⬆ Importar datos',
    sendFeedback: '✉️ Enviar comentarios',
    resetApp: 'Reiniciar app',
    quarterlyReport: '⬇ Reporte trimestral',
    annualReport: '⬇ Reporte anual',
    addExpense: '+ Agregar gasto',
    addGoal: 'Meta',
    addSideHustle: '+ Agregar ingreso extra',
    addInvestment: '+ Agregar inversión',
    reports: 'Reportes',
    backupTransfer: 'Respaldo y transferencia',
    feedback: 'Comentarios',
    reset: 'Reiniciar',
    plannedBudget: 'Presupuesto planificado',
    nonRecurringAllowance: 'Presupuesto no recurrente',
    investments: 'Portafolio',
    extraIncome: 'Ingreso extra',
    goals: 'Metas',
    logSavings: 'Registrar ahorro',
    savingsLogged: 'Ahorros registrados',
    thisYear: 'Este año',
    target: 'Meta',
    current: 'Actual',
    color: 'Color',
    icon: 'Ícono',
    depositReminder: 'Recordatorio de depósito',
    setReminder: 'Recordatorio',
    savingsProjection: 'Proyección de ahorro (próximos 12 meses)',
    hitDate: '¿Quieres llegar en una fecha específica?',
    timeHorizon: 'Horizonte de tiempo',
    horizonShort: 'Pronto (menos de 3 años)',
    horizonMedium: 'En unos años (3–7)',
    horizonLong: 'Largo plazo / retiro (7+)',
    horizonShortTag: 'Corto plazo',
    horizonMediumTag: 'Mediano plazo',
    horizonLongTag: 'Largo plazo',
    horizonHint: '¿Sin fecha exacta? Elige un plazo aproximado.',
    investShareTitle: 'Parte del ahorro mensual',
    investShareOff: 'No',
    investShareHint: 'Incluye este fondo en el reparto automático de tu dinero extra.',
    linkToGoal: '¿Para qué meta?',
    notLinked: 'Sin vincular',
    matchGoalPct: 'Igualar el % de la meta',
    assetTypeLabel: '¿Qué tipo de fondo es?',
    assetTypeHint: 'Solo se usa para avisarte si encaja con el horizonte de tu meta.',
    assetEquity: 'Acciones',
    assetEquityDesc: 'puede subir y bajar con el mercado',
    assetBonds: 'Bonos',
    assetBondsDesc: 'más estable',
    assetOther: 'Otros',
    assetOtherDesc: 'bienes raíces, cripto, etc.',
    assetUnsure: 'No estoy seguro',
    assetUnsureDesc: 'sin aviso en ningún sentido',
    guideEquityShort: 'Ojo: esto parece acciones, pero su meta es de corto plazo. El dinero que necesitarás en ~3 años suele mantenerse en efectivo o bonos, para que una caída del mercado justo antes no te afecte. Puedes dejarlo así — solo algo a considerar.',
    guideEquityMedium: 'Nota: acciones para una meta de mediano plazo (3–7 años) tiene algo de riesgo de tiempo. Una mezcla de acciones y bonos es un término medio común. Tú decides.',
    monthSummaryTitle: 'Resumen del mes',
    msIncome: 'Ingreso',
    msSpent: 'Gastado',
    msLeftover: 'Sobrante',
    msByCategory: 'Por categoría',
    msNonRecurring: 'No recurrente',
    msAssignTitle: 'Pon tu sobrante a trabajar',
    msAssignHint: 'Sugerido según tu plan — edítalo antes de confirmar.',
    msUseSuggestion: 'Usar sugerencia del plan',
    msSpending: 'Dinero disponible',
    msLeftToAssign: 'por asignar',
    msOverAssigned: 'es más de lo que tienes',
    msConfirm: 'Confirmar',
    msSaveAll: 'Guardar todo según mi plan',
    msKeepSpending: 'Dejar como dinero disponible',
    msNoLeftover: 'No hay sobrante por revisar ahora.',
    msIncomeNote: 'El ingreso mostrado es tu configuración mensual actual.',
    notifToggle: 'Aviso de fin de mes',
    notifToggleDesc: 'Recibe una notificación para revisar y asignar tu sobrante.',
    notifBlocked: 'Las notificaciones están desactivadas en los ajustes de tu dispositivo o navegador — actívalas ahí para recibirla.',
    coachEyebrow: 'Guía',
    coachSeeAll: 'Ver todas',
    coachNotNow: 'Ahora no',
    coachGotIt: 'Entendido',
    coachAllGood: 'Todo en orden — nada que sugerir ahora.',
    guideTitle: 'Guía',
    guideIntro: 'Reglas generales según tu configuración — no es asesoría personalizada. Aplica o edita lo que quieras.',
    retireGoalName: 'Retiro',
    tipRetireTitle: 'Ponle meta a tu Roth IRA',
    tipRetireBody: 'Un Roth IRA es para el retiro. Puedo crear una meta “Retiro” con un objetivo estimado con la regla del 25×: guardar ~25 veces tus gastos de un año. Así, retirar ~4% al año de ahí te cubriría sin quedarte sin dinero. Es totalmente editable.',
    retireCreate: 'Crear meta',
    retireNote: 'Objetivo estimado con la regla del 25× (25 × un año de tus gastos). Retirar ~4%/año de ahí cubriría más o menos tus gastos — es una guía general, ajústalo a tu caso.',
    settings: 'Ajustes',
    welcome: 'Bienvenida',
    getStarted: 'Comenzar',
    monthlyIncome: 'Ingreso mensual',
    incomePerPaycheck: 'Ingreso / pago',
    availableMonth: 'Disponible / mes',
    totalSaved: 'Total ahorrado',
    totalInvested: 'Total invertido',
    spentSoFar: 'gastado hasta ahora',
    allowanceLabel: 'Mesada',
    fixedContractsLabel: 'Ingreso de contratos fijos',
    freelanceExtrasLabel: 'Extras freelance',
    languageLabel: 'Idioma',
    profileQTitle: '¿En qué trabajas?',
    profileAllowance: 'Soy estudiante',
    profileSalary: 'Tengo un trabajo fijo',
    profileFreelance: 'Soy freelance o emprendedor',
    howOldQ: '¿Cuántos años tienes?',
    yourAge: 'Tu edad',
    investQ: '¿Inviertes junto con tus padres?',
    investYes: 'Sí, invertimos juntos',
    investNo: 'No / no estoy seguro',
    employmentQ: '¿Tiempo completo o medio tiempo?',
    fulltimeLabel: 'Tiempo completo',
    parttimeLabel: 'Medio tiempo',
    payFreqQ: '¿Cómo te pagan?',
    monthlyLabel: 'Mensual',
    biweeklyLabel: 'Quincenal',
    fixedContractsQ: '¿Tienes contratos fijos?',
    yesLabel: 'Sí',
    noLabel: 'No, varía',
    continueLabel: 'Continuar',
    gotIt: 'Entendido',
    completed: 'Completada',
    profileMenu: 'Perfil',
    reportsMenu: 'Reportes',
    moreMenu: 'Respaldo, comentarios y reinicio',
    profileMenuDesc: 'Idioma y cómo recibes dinero',
    reportsMenuDesc: 'Descarga reportes trimestrales y anuales',
    moreMenuDesc: 'Exportar/importar datos, enviar comentarios, reiniciar',
    tabIntroHome: 'Aquí ves tu dinero de un vistazo. El anillo muestra tu gasto contra el presupuesto de este mes. Pon tu ingreso arriba, y revisa esta pantalla seguido.',
    tabIntroGoals: 'Pon metas de ahorro y ve exactamente cómo se reparte tu dinero mensual entre ellas. Registra un depósito cuando quieras, o pon una fecha objetivo para ver qué necesitas hacer para lograrla.',
    tabIntroExpenses: 'Toca cualquier día del calendario para registrar lo que gastaste, o planifica con anticipación. Marca las categorías como "Fixed" si siempre es el mismo monto — esas se autocompletan.',
    tabIntroExtra: 'Registra aquí tus ingresos extra. Asígnalos a una meta, y cada mes que toques "Check in" se suma al ahorro de esa meta.',
    tabIntroInvest: 'Registra lo que está creciendo fuera de tus metas. Solo pon cuánto invertiste y cuánto vale hoy — actualízalo cada cierto tiempo.'
  }
};
function GoalIconGlyph({
  icon,
  size
}) {
  const known = ICONS.concat(MORE_ICONS).some(i => i.key === icon);
  if (known) {
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: size,
      height: size,
      fill: "none",
      stroke: "#fff",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: iconPathFor(icon)
    }));
  }
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: size * 0.85,
      lineHeight: 1
    }
  }, icon || '⭐');
}
function LockScreen(props) {
  const lang = props.lang;
  const cfg = props.config;
  const [pin, setPin] = useState('');
  const [err, setErr] = useState(false);
  const [bioAvail, setBioAvail] = useState(false);
  useEffect(function () {
    let ok = true;
    bioSupported().then(function (v) { if (ok) setBioAvail(v && !!(cfg && cfg.bio && cfg.credId)); });
    return function () { ok = false; };
  }, []);
  function submit(next) {
    sha256Hex(next + (cfg.salt || '')).then(function (h) {
      if (h === cfg.pinHash) { props.onUnlock(); }
      else { setErr(true); setPin(''); setTimeout(function () { setErr(false); }, 700); }
    });
  }
  function press(d) { if (pin.length >= 4) return; const next = pin + d; setPin(next); if (next.length === 4) submit(next); }
  function back() { setPin(pin.slice(0, -1)); }
  function doBio() { bioVerify(cfg.credId).then(function () { props.onUnlock(); }).catch(function () { setErr(true); setTimeout(function () { setErr(false); }, 700); }); }
  const keyStyle = { width: 74, height: 74, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.18)', color: '#fff', fontSize: 27, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system,BlinkMacSystemFont,\"SF Pro Display\",Inter,system-ui,sans-serif' };
  function lockIcon(sz) { return React.createElement('svg', { viewBox: '0 0 24 24', width: sz, height: sz, fill: 'none', stroke: '#fff', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }, React.createElement('rect', { x: 4, y: 11, width: 16, height: 10, rx: 2.5 }), React.createElement('path', { d: 'M7.5 11V7.5a4.5 4.5 0 0 1 9 0V11' }), React.createElement('circle', { cx: 12, cy: 15.5, r: 1.35, fill: '#fff', stroke: 'none' })); }
  function faceIcon(sz) { return React.createElement('svg', { viewBox: '0 0 24 24', width: sz, height: sz, fill: 'none', stroke: '#fff', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }, React.createElement('path', { d: 'M4 8.5V6.5A2.5 2.5 0 0 1 6.5 4H8.5' }), React.createElement('path', { d: 'M15.5 4H17.5A2.5 2.5 0 0 1 20 6.5V8.5' }), React.createElement('path', { d: 'M20 15.5V17.5A2.5 2.5 0 0 1 17.5 20H15.5' }), React.createElement('path', { d: 'M8.5 20H6.5A2.5 2.5 0 0 1 4 17.5V15.5' }), React.createElement('path', { d: 'M8.7 9.7V11.2' }), React.createElement('path', { d: 'M15.3 9.7V11.2' }), React.createElement('path', { d: 'M12 9.5V12.6L10.9 13.2' }), React.createElement('path', { d: 'M8.9 15.3C10.1 16.5 13.9 16.5 15.1 15.3' })); }
  function backIcon(sz) { return React.createElement('svg', { viewBox: '0 0 24 24', width: sz, height: sz, fill: 'none', stroke: '#fff', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }, React.createElement('path', { d: 'M21 5H8.6a2 2 0 0 0-1.6.8l-4.2 5.6a1 1 0 0 0 0 1.2l4.2 5.6a2 2 0 0 0 1.6.8H21a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z' }), React.createElement('path', { d: 'M17 9.5l-5 5' }), React.createElement('path', { d: 'M12 9.5l5 5' })); }
  function keyBtn(d) { return React.createElement('button', { key: d, onClick: function () { press(d); }, style: keyStyle }, d); }
  return React.createElement('div', { style: css('position:fixed;inset:0;z-index:200;background:linear-gradient(135deg,#0071e3,#5ac8fa);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;color:#fff;text-align:center;font-family:-apple-system,BlinkMacSystemFont,\"SF Pro Display\",Inter,system-ui,sans-serif;') },
    React.createElement('div', { style: { width: 66, height: 66, borderRadius: 20, background: 'rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 } }, lockIcon(30)),
    React.createElement('div', { style: css('font-size:20px;font-weight:700;margin-bottom:5px;letter-spacing:-0.01em;') }, lang === 'es' ? 'Ingresa tu PIN' : 'Enter your PIN'),
    React.createElement('div', { style: css('font-size:13px;opacity:0.85;margin-bottom:24px;') }, lang === 'es' ? 'Para proteger tu informaci\u00F3n' : 'To protect your information'),
    React.createElement('div', { style: { display: 'flex', gap: 14, marginBottom: 26 } },
      [0, 1, 2, 3].map(function (i) { return React.createElement('div', { key: i, style: { width: 14, height: 14, borderRadius: '50%', background: i < pin.length ? '#fff' : 'transparent', border: '1.5px solid rgba(255,255,255,0.7)' } }); })
    ),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 74px)', gap: 18, justifyContent: 'center' } },
      ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(function (d) { return keyBtn(d); }).concat([
        bioAvail ? React.createElement('button', { key: 'bio', onClick: doBio, 'aria-label': 'Face ID', style: keyStyle }, faceIcon(30)) : React.createElement('div', { key: 'sp' }),
        keyBtn('0'),
        React.createElement('button', { key: 'bk', onClick: back, 'aria-label': 'Delete', style: keyStyle }, backIcon(26))
      ])
    ),
    err && React.createElement('div', { style: css('font-size:14px;margin-top:18px;font-weight:600;') }, lang === 'es' ? 'PIN incorrecto' : 'Wrong PIN'),
    React.createElement('button', { onClick: props.onSignOut, style: css('margin-top:28px;background:none;border:none;color:#fff;opacity:0.85;font-size:13px;font-weight:600;text-decoration:underline;cursor:pointer;font-family:-apple-system,BlinkMacSystemFont,\"SF Pro Display\",Inter,system-ui,sans-serif;') }, lang === 'es' ? 'Cerrar sesi\u00F3n' : 'Sign out')
  );
}
function SecuritySettings(props) {
  const lang = props.lang;
  const cfg = props.config;
  const hasPin = !!(cfg && cfg.pinHash);
  const [mode, setMode] = useState('idle');
  const [entry, setEntry] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [bioAvail, setBioAvail] = useState(false);
  const [msg, setMsg] = useState('');
  useEffect(function () { let ok = true; bioSupported().then(function (v) { if (ok) setBioAvail(v); }); return function () { ok = false; }; }, []);
  function resetEntry() { setMode('idle'); setEntry(''); setFirstPin(''); }
  function press(d) {
    if (entry.length >= 4) return;
    const next = entry + d; setEntry(next);
    if (next.length < 4) return;
    if (mode === 'new') { setFirstPin(next); setEntry(''); setMode('confirm'); }
    else if (mode === 'confirm') {
      if (next === firstPin) {
        const salt = String(Date.now()) + String(Math.floor(1000 + (Date.now() % 9000)));
        sha256Hex(next + salt).then(function (h) {
          const nc = { pinHash: h, salt: salt, bio: false, credId: null };
          writeLock(nc); props.setConfig(nc);
          try { sessionStorage.setItem('pf_unlocked', '1'); } catch (e) {}
          setMsg(lang === 'es' ? 'PIN activado' : 'PIN enabled'); resetEntry();
        });
      } else { setMsg(lang === 'es' ? 'No coincidi\u00F3, intenta de nuevo' : 'Did not match, try again'); setFirstPin(''); setEntry(''); setMode('new'); }
    }
  }
  function back() { setEntry(entry.slice(0, -1)); }
  function removePin() { writeLock(null); props.setConfig(null); setMsg(lang === 'es' ? 'PIN eliminado' : 'PIN removed'); resetEntry(); }
  function toggleBio() {
    if (!cfg) return;
    if (cfg.bio) { const c = Object.assign({}, cfg, { bio: false, credId: null }); writeLock(c); props.setConfig(c); setMsg(lang === 'es' ? 'Desactivado' : 'Disabled'); }
    else { bioRegister(props.userId).then(function (id) { const c = Object.assign({}, cfg, { bio: true, credId: id }); writeLock(c); props.setConfig(c); setMsg(lang === 'es' ? 'Face ID / huella activado' : 'Face ID / fingerprint enabled'); }).catch(function () { setMsg(lang === 'es' ? 'No se pudo activar' : 'Could not enable'); }); }
  }
  const keyStyle = { width: 64, height: 64, borderRadius: '50%', border: 'none', background: '#f5f5f7', color: '#1d1d1f', fontSize: 24, fontWeight: 600, cursor: 'pointer' };
  function keyBtn(d) { return React.createElement('button', { key: d, onClick: function () { press(d); }, style: keyStyle }, d); }
  if (mode === 'new' || mode === 'confirm') {
    return React.createElement('div', { style: css('background:#fff;border-radius:16px;padding:22px;text-align:center;') },
      React.createElement('div', { style: css('font-size:15px;font-weight:700;margin-bottom:6px;') }, mode === 'new' ? (lang === 'es' ? 'Crea un PIN de 4 d\u00EDgitos' : 'Create a 4-digit PIN') : (lang === 'es' ? 'Confirma tu PIN' : 'Confirm your PIN')),
      React.createElement('div', { style: { display: 'flex', gap: 12, justifyContent: 'center', margin: '18px 0 22px' } },
        [0, 1, 2, 3].map(function (i) { return React.createElement('div', { key: i, style: { width: 13, height: 13, borderRadius: '50%', background: i < entry.length ? '#0071e3' : '#e5e5ea' } }); })
      ),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 64px)', gap: 12, justifyContent: 'center' } },
        ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(function (d) { return keyBtn(d); }).concat([
          React.createElement('div', { key: 'sp' }), keyBtn('0'),
          React.createElement('button', { key: 'bk', onClick: back, style: keyStyle }, '\u232B')
        ])
      ),
      React.createElement('button', { onClick: resetEntry, style: css('margin-top:18px;background:none;border:none;color:#86868b;font-size:13px;cursor:pointer;') }, lang === 'es' ? 'Cancelar' : 'Cancel')
    );
  }
  return React.createElement('div', null,
    React.createElement('div', { style: css('background:#fff;border-radius:16px;padding:18px;margin-bottom:12px;') },
      React.createElement('div', { style: css('font-size:14px;font-weight:700;color:#1d1d1f;margin-bottom:4px;') }, hasPin ? (lang === 'es' ? 'Bloqueo con PIN activado' : 'PIN lock is on') : (lang === 'es' ? 'Bloqueo con PIN' : 'PIN lock')),
      React.createElement('div', { style: css('font-size:12.5px;color:#86868b;line-height:1.4;margin-bottom:14px;') }, lang === 'es' ? 'Pide un PIN de 4 d\u00EDgitos cada vez que abres la app.' : 'Ask for a 4-digit PIN every time you open the app.'),
      !hasPin ? React.createElement('button', { onClick: function () { setMsg(''); setMode('new'); setEntry(''); setFirstPin(''); }, style: css('width:100%;background:#0071e3;color:#fff;border:none;padding:11px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;') }, lang === 'es' ? 'Crear PIN' : 'Set up PIN')
      : React.createElement('div', { style: { display: 'flex', gap: 10 } },
          React.createElement('button', { onClick: function () { setMsg(''); setMode('new'); setEntry(''); setFirstPin(''); }, style: css('flex:1;background:#f5f5f7;color:#1d1d1f;border:none;padding:11px;border-radius:10px;font-size:13.5px;font-weight:600;cursor:pointer;') }, lang === 'es' ? 'Cambiar PIN' : 'Change PIN'),
          React.createElement('button', { onClick: removePin, style: css('flex:1;background:#fff;color:#ff3b30;border:1px solid #ffd4d1;padding:11px;border-radius:10px;font-size:13.5px;font-weight:600;cursor:pointer;') }, lang === 'es' ? 'Quitar PIN' : 'Remove PIN')
        )
    ),
    hasPin && bioAvail && React.createElement('div', { style: css('background:#fff;border-radius:16px;padding:18px;display:flex;align-items:center;justify-content:space-between;gap:12px;') },
      React.createElement('div', null,
        React.createElement('div', { style: css('font-size:14px;font-weight:700;color:#1d1d1f;') }, lang === 'es' ? 'Face ID / Huella' : 'Face ID / Fingerprint'),
        React.createElement('div', { style: css('font-size:12.5px;color:#86868b;margin-top:2px;') }, lang === 'es' ? 'Desbloquea sin escribir el PIN' : 'Unlock without typing the PIN')
      ),
      React.createElement('button', { onClick: toggleBio, style: { width: 46, height: 27, borderRadius: 14, background: cfg && cfg.bio ? '#0071e3' : '#e5e5ea', border: 'none', cursor: 'pointer', position: 'relative', padding: 0, flex: 'none' } },
        React.createElement('span', { style: { position: 'absolute', top: 2, left: cfg && cfg.bio ? 21 : 2, width: 23, height: 23, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)' } })
      )
    ),
    msg && React.createElement('div', { style: css('font-size:12.5px;color:#0071e3;font-weight:600;margin-top:12px;text-align:center;') }, msg)
  );
}
function App() {
  const [state, setState] = useState(null);
  const [storageWarning, setStorageWarning] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [quickAddGoalId, setQuickAddGoalId] = useState(null);
  const [logAmount, setLogAmount] = useState('');
  const [logName, setLogName] = useState('');
  const [logType, setLogType] = useState('recurring');
  const [logCategory, setLogCategory] = useState('');
  const todayStr = (() => {
    const t = new Date();
    return toDateStr(t.getFullYear(), t.getMonth(), t.getDate());
  })();
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [editingIncome, setEditingIncome] = useState(false);
  const [editingTarget, setEditingTarget] = useState(false);
  const [editingCurrent, setEditingCurrent] = useState(false);
  const [showColorPopup, setShowColorPopup] = useState(false);
  const [showIconPopup, setShowIconPopup] = useState(false);
  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [editingGoalMeta, setEditingGoalMeta] = useState(false);
  const [editingGoalName, setEditingGoalName] = useState(false);
  const [showAddPaycheck, setShowAddPaycheck] = useState(false);
  const [showAddSavingsEntry, setShowAddSavingsEntry] = useState(false);
  const [newSavingsMonth, setNewSavingsMonth] = useState(new Date().getMonth());
  const [newSavingsYear, setNewSavingsYear] = useState(new Date().getFullYear());
  const [newSavingsAmount, setNewSavingsAmount] = useState('');
  const [editingSavingsEntryId, setEditingSavingsEntryId] = useState(null);
  const [editingSavingsAmount, setEditingSavingsAmount] = useState('');
  const [newPaycheckDate, setNewPaycheckDate] = useState('');
  const [newPaycheckAmount, setNewPaycheckAmount] = useState('');
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [allocatingLeftover, setAllocatingLeftover] = useState(false);
  const [welcomeStep, setWelcomeStep] = useState(0);
  const [settingsView, setSettingsView] = useState('menu');
  const [showGoalDetail, setShowGoalDetail] = useState(false);
  const [showEmergencyFundPicker, setShowEmergencyFundPicker] = useState(false);
  const [efEarnsInterest, setEfEarnsInterest] = useState(null);
  const [efApyInput, setEfApyInput] = useState('');
  const [showEfApyModal, setShowEfApyModal] = useState(false);
  const [efApyEdit, setEfApyEdit] = useState('');
  const [showInvestDetail, setShowInvestDetail] = useState(false);
  const [showAddFundModal, setShowAddFundModal] = useState(false);
  const [newFundName, setNewFundName] = useState('');
  const [newFundRetirement, setNewFundRetirement] = useState(null);
  const [editingInvestmentName, setEditingInvestmentName] = useState(false);
  const [editingRetirement, setEditingRetirement] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [investLogAmount, setInvestLogAmount] = useState('');
  const [investValueEdit, setInvestValueEdit] = useState('');
  const [editingLogId, setEditingLogId] = useState(null);
  const [editingLogAmount, setEditingLogAmount] = useState('');
  const [showDayLog, setShowDayLog] = useState(false);
  const [showPaycheckModal, setShowPaycheckModal] = useState(false);
  const [paycheckAmount, setPaycheckAmount] = useState('');
  const [depositType, setDepositType] = useState('paycheck'); // 'paycheck' | 'other'
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const keyboardInset = useKeyboardInset();
  // While a Home log sheet is open, lock the page so the background can't scroll
  // (iOS otherwise auto-scrolls the page when the keyboard opens, dragging the
  // sheet back down under the keyboard). Scrolling inside the sheet still works.
  useEffect(() => {
    if (!showPaycheckModal && !showExpenseModal) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const prevent = e => {
      if (e.target && e.target.closest && e.target.closest('.pf-modal-in')) return;
      e.preventDefault();
    };
    document.addEventListener('touchmove', prevent, { passive: false });
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
      document.removeEventListener('touchmove', prevent);
    };
  }, [showPaycheckModal, showExpenseModal]);
  const expensesCalRef = useRef(null);
  const [expensesCalH, setExpensesCalH] = useState(0);
  useEffect(function () {
    if (!expensesCalRef.current || typeof ResizeObserver === 'undefined') return;
    const el = expensesCalRef.current;
    const measure = function () { setExpensesCalH(Math.ceil(el.offsetHeight)); };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return function () { ro.disconnect(); };
  });
  const homeHeroRef = useRef(null);
  const [homeHeroH, setHomeHeroH] = useState(230);
  useEffect(function () {
    if (!homeHeroRef.current || typeof ResizeObserver === 'undefined') return;
    const el = homeHeroRef.current;
    const measure = function () { setHomeHeroH(Math.ceil(el.offsetHeight)); };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return function () { ro.disconnect(); };
  });
  const [lockCfg, setLockCfg] = useState(function () { return readLock(); });
  const [locked, setLocked] = useState(function () {
    try {
      const c = readLock();
      return !!(c && c.pinHash) && sessionStorage.getItem('pf_unlocked') !== '1';
    } catch (e) { return false; }
  });
  useEffect(function () {
    if (typeof document === 'undefined') return;
    const LOCK_AFTER_MS = 90000;
    let hiddenAt = 0;
    function onVis() {
      if (document.visibilityState === 'hidden') {
        hiddenAt = Date.now();
      } else if (document.visibilityState === 'visible') {
        const c = readLock();
        if (c && c.pinHash && hiddenAt && Date.now() - hiddenAt > LOCK_AFTER_MS) {
          try { sessionStorage.removeItem('pf_unlocked'); } catch (e) {}
          setLocked(true);
        }
        hiddenAt = 0;
      }
    }
    document.addEventListener('visibilitychange', onVis);
    return function () { document.removeEventListener('visibilitychange', onVis); };
  }, []);
  const [selectedPresets, setSelectedPresets] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const askConfirm = (message, onYes) => setConfirmDialog({
    message,
    onYes
  });
  const [leftoverSplits, setLeftoverSplits] = useState({});
  const [msSplits, setMsSplits] = useState({});
  const [reportQuarter, setReportQuarter] = useState(Math.floor(new Date().getMonth() / 3) + 1);
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  useEffect(() => {
    if (!sbClient) {
      setAuthLoading(false);
      return;
    }
    let cancelled = false;
    sbClient.auth.getSession().then(({
      data,
      error
    }) => {
      if (cancelled) return;
      if (error) setAuthError(error.message);
      setAuthUser(data && data.session ? data.session.user : null);
      setAuthLoading(false);
    });
    const {
      data: listener
    } = sbClient.auth.onAuthStateChange((event, session) => {
      setAuthUser(session ? session.user : null);
    });
    return () => {
      cancelled = true;
      listener && listener.subscription && listener.subscription.unsubscribe();
    };
  }, []);
  const signInWithGoogle = () => {
    if (!sbClient) {
      setAuthError('Supabase not loaded');
      return;
    }
    setAuthError('');
    sbClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname
      }
    }).then(({
      error
    }) => {
      if (error) setAuthError(error.message);
    });
  };
  const signOutUser = () => {
    if (!sbClient) return;
    sbClient.auth.signOut();
  };
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [authInfo, setAuthInfo] = useState('');
  const signInWithEmail = () => {
    if (!sbClient) {
      setAuthError('Supabase not loaded');
      return;
    }
    if (!authEmail || !authPassword) {
      setAuthError('Enter your email and password.');
      return;
    }
    setAuthError('');
    setAuthInfo('');
    setAuthBusy(true);
    sbClient.auth.signInWithPassword({
      email: authEmail,
      password: authPassword
    }).then(({
      error
    }) => {
      setAuthBusy(false);
      if (error) setAuthError(error.message);
    });
  };
  const signUpWithEmail = () => {
    if (!sbClient) {
      setAuthError('Supabase not loaded');
      return;
    }
    if (!authEmail || !authPassword) {
      setAuthError('Enter an email and password.');
      return;
    }
    if (authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }
    setAuthError('');
    setAuthInfo('');
    setAuthBusy(true);
    sbClient.auth.signUp({
      email: authEmail,
      password: authPassword,
      options: {
        emailRedirectTo: window.location.origin + window.location.pathname
      }
    }).then(({
      data,
      error
    }) => {
      setAuthBusy(false);
      if (error) {
        setAuthError(error.message);
        return;
      }
      if (data && data.session) {
        // email confirmations disabled on this project -> signed in immediately
        return;
      }
      setAuthInfo('Check your email to confirm your account, then log in.');
      setAuthMode('login');
    });
  };
  const lineCanvasRef = useRef(null);
  const shortcutFocusDone = useRef(false);
  useEffect(() => {
    if (shortcutFocusDone.current) return;
    if (!state || state.tab !== 'gastos') return;
    if (typeof window === 'undefined' || !window.location.search.includes('action=logExpense')) return;
    shortcutFocusDone.current = true;
    setTimeout(() => {
      const input = document.querySelector('input[placeholder="Amount spent"]');
      if (input) input.focus();
    }, 350);
  }, [state && state.tab]);
  const monthStripRef = useRef(null);
  useEffect(() => {
    if (!monthStripRef.current) return;
    const cur = monthStripRef.current.querySelector('[data-current="true"]');
    if (cur && typeof cur.scrollIntoView === 'function') cur.scrollIntoView({
      inline: 'start',
      block: 'nearest'
    });else monthStripRef.current.scrollLeft = monthStripRef.current.scrollWidth;
  }, [state && state.selectedGoalId, state && state.tab]);
  const notifiedLeftoverRef = useRef(null);
  useEffect(() => {
    if (!state || !state.pendingLeftover || !state.notificationsEnabled) return;
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    const key = state.pendingLeftover.label + ':' + state.pendingLeftover.amount;
    if (notifiedLeftoverRef.current === key) return;
    notifiedLeftoverRef.current = key;
    const title = state.language === 'es' ? 'Resumen de ' + state.pendingLeftover.label : state.pendingLeftover.label + ' summary';
    const body = state.language === 'es' ? 'Te sobraron ' + fmt(state.pendingLeftover.amount) + '. Toca para asignarlo.' : 'You had ' + fmt(state.pendingLeftover.amount) + ' left over. Tap to assign it.';
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification(title, {
            body: body,
            tag: 'pf-month-summary',
            data: {
              url: './?action=monthSummary'
            }
          });
        }).catch(() => {});
      } else {
        new Notification(title, {
          body: body
        });
      }
    } catch (e) {}
  }, [state && state.pendingLeftover && state.pendingLeftover.label + state.pendingLeftover.amount, state && state.notificationsEnabled]);
  const donutCanvasRef = useRef(null);
  const cardPressRef = useRef({
    id: null,
    fired: false
  });
  // Long-press (hold) a card to delete it. Returns pointer handlers; pair with
  // cardTapGuard so the normal tap (open detail) is skipped after a long-press.
  const cardPressProps = onLong => ({
    onPointerDown: () => {
      cardPressRef.current.fired = false;
      clearTimeout(cardPressRef.current.id);
      cardPressRef.current.id = setTimeout(() => {
        cardPressRef.current.fired = true;
        onLong();
      }, 550);
    },
    onPointerUp: () => clearTimeout(cardPressRef.current.id),
    onPointerCancel: () => clearTimeout(cardPressRef.current.id),
    onPointerLeave: () => clearTimeout(cardPressRef.current.id)
  });
  const cardTapGuard = onTap => () => {
    if (cardPressRef.current.fired) {
      cardPressRef.current.fired = false;
      return;
    }
    onTap();
  };
  // In-card delete confirmation (an overlay inside the card, not a modal).
  const deleteOverlay = onDelete => /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      e.stopPropagation();
      setDeleteConfirm(null);
    },
    style: css('position:absolute;inset:0;background:rgba(255,255,255,0.97);border-radius:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:12px;z-index:3;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12.5px;font-weight:700;color:#1d1d1f;text-align:center;')
  }, state.language === 'es' ? '¿Eliminar?' : 'Delete?'), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;')
  }, /*#__PURE__*/React.createElement("div", {
    role: "button",
    onClick: e => {
      e.stopPropagation();
      setDeleteConfirm(null);
    },
    style: css('background:#f5f5f7;color:#1d1d1f;border-radius:9px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;')
  }, state.language === 'es' ? 'Cancelar' : 'Cancel'), /*#__PURE__*/React.createElement("div", {
    role: "button",
    onClick: e => {
      e.stopPropagation();
      onDelete();
      setDeleteConfirm(null);
    },
    style: css('background:#ff3b30;color:#fff;border-radius:9px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;')
  }, state.language === 'es' ? 'Eliminar' : 'Delete')));
  const deleteGoalNow = id => patch(st => {
    const goals = st.goals.filter(g => g.id !== id);
    return {
      goals,
      selectedGoalId: st.selectedGoalId === id ? goals[0] ? goals[0].id : null : st.selectedGoalId
    };
  });
  const deleteInvestmentNow = id => patch(st => ({
    investments: st.investments.filter(i => i.id !== id)
  }));
  const saveTimer = useRef(null);
  const budgetRowRefs = useRef({});
  const dragInfo = useRef({
    startY: 0,
    timer: null
  });
  const [dragIndex, setDragIndex] = useState(null);
  const startBudgetRowPress = (i, clientY) => {
    dragInfo.current.startY = clientY;
    dragInfo.current.timer = setTimeout(() => setDragIndex(i), 420);
  };
  const moveBudgetRowPress = clientY => {
    if (dragInfo.current.timer && Math.abs(clientY - dragInfo.current.startY) > 8) {
      clearTimeout(dragInfo.current.timer);
      dragInfo.current.timer = null;
    }
    if (dragIndex === null) return;
    const entries = Object.entries(budgetRowRefs.current);
    for (const [idxStr, el] of entries) {
      if (!el) continue;
      const idx = parseInt(idxStr, 10);
      if (idx === dragIndex) continue;
      const rect = el.getBoundingClientRect();
      if (clientY >= rect.top && clientY <= rect.bottom) {
        reorderExpenseRow(dragIndex, idx);
        setDragIndex(idx);
        break;
      }
    }
  };
  const endBudgetRowPress = () => {
    if (dragInfo.current.timer) {
      clearTimeout(dragInfo.current.timer);
      dragInfo.current.timer = null;
    }
    setDragIndex(null);
  };
  const hasLoaded = useRef(false);
  const [localLoaded, setLocalLoaded] = useState(false);
  const localUpdatedAtRef = useRef(0);
  const importInputRef = useRef(null);
  const [importMessage, setImportMessage] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('idle');

  /* load persisted data once */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await storageAdapter.get(STORAGE_KEY);
        if (cancelled) return;
        if (res && res.value) {
          const loaded = JSON.parse(res.value);
          if (loaded.quarterlyCategories && loaded.quarterlyCategories.length) {
            loaded.expenseCategories = (loaded.expenseCategories || []).concat(loaded.quarterlyCategories.map(c => ({
              name: c.name,
              amount: Math.round((c.amount || 0) / 3)
            })));
          }
          delete loaded.quarterlyCategories;
          if (loaded.investments && loaded.investments.length) {
            loaded.investments = loaded.investments.map(inv => {
              if (inv.currentValue === undefined && inv.returnPct !== undefined) {
                const {
                  returnPct,
                  ...rest
                } = inv;
                return {
                  ...rest,
                  currentValue: Math.round((inv.amount || 0) * (1 + (returnPct || 0) / 100))
                };
              }
              return inv;
            });
          }
          if (loaded.hasSeenWelcome === undefined) loaded.hasSeenWelcome = true;
          if (loaded.goals && loaded.goals.length) {
            const nowFallback = new Date();
            loaded.goals = loaded.goals.map(g => {
              let g2 = g;
              if (!g2.skippedMonths) g2 = {
                ...g2,
                skippedMonths: []
              };
              if (typeof g2.createdMonth === 'number' && typeof g2.createdYear === 'number') return g2;
              let earliest = null;
              (g2.savingsLog || []).forEach(entry => {
                const p = parseMonthYearLabel(entry.label);
                if (p && !isNaN(p.year) && !isNaN(p.month)) {
                  if (!earliest || p.year < earliest.year || p.year === earliest.year && p.month < earliest.month) earliest = p;
                }
              });
              return {
                ...g2,
                createdMonth: earliest ? earliest.month : nowFallback.getMonth(),
                createdYear: earliest ? earliest.year : nowFallback.getFullYear()
              };
            });
          }
          if (loaded.expenseCategories && loaded.expenseCategories.length) {
            loaded.expenseCategories = loaded.expenseCategories.map((c, i) => c.color ? c : {
              ...c,
              color: PALETTE[i % PALETTE.length]
            });
          }
          const todayNow = new Date();
          const curMonth = todayNow.getMonth(),
            curYear = todayNow.getFullYear();
          const hasRecorded = typeof loaded.lastProcessedMonth === 'number' && typeof loaded.lastProcessedYear === 'number';
          const recordedIsOld = hasRecorded && (loaded.lastProcessedMonth !== curMonth || loaded.lastProcessedYear !== curYear);
          if (recordedIsOld || !hasRecorded) {
            // If we've never tracked this before (upgrading from an older version), compare against
            // last calendar month so the very first leftover prompt still shows up right away.
            let prevMonth = hasRecorded ? loaded.lastProcessedMonth : curMonth - 1;
            let prevYear = hasRecorded ? loaded.lastProcessedYear : curYear;
            if (prevMonth < 0) {
              prevMonth = 11;
              prevYear -= 1;
            }
            const cats = loaded.expenseCategories || [];
            const budgetForPrevMonth = cats.reduce((a, c) => a + (c.amount || 0), 0) + (loaded.nonRecurringBudget || 0);
            const spentPrevMonth = (loaded.expenseLog || []).filter(e => {
              const d = new Date(entryDateStr(e) + 'T00:00:00');
              return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
            }).reduce((a, e) => a + e.amount, 0);
            const leftover = Math.round(budgetForPrevMonth - spentPrevMonth);
            loaded.pendingLeftover = leftover > 0 ? {
              amount: leftover,
              label: MONTH_NAMES[prevMonth] + ' ' + prevYear
            } : null;
            loaded.spendingBoost = 0;
            loaded.lastProcessedMonth = curMonth;
            loaded.lastProcessedYear = curYear;
          }
          const merged = Object.assign(defaultState(), loaded);
          const qs = typeof window !== 'undefined' && window.location ? window.location.search : '';
          if (qs.includes('action=logExpense')) {
            merged.tab = 'gastos';
          } else if (qs.includes('action=monthSummary')) {
            merged.tab = 'monthSummary';
          } else {
            merged.tab = 'inicio';
          }
          localUpdatedAtRef.current = loaded._updatedAt || 0;
          setState(merged);
        } else {
          const fresh = defaultState();
          const qs = typeof window !== 'undefined' && window.location ? window.location.search : '';
          if (qs.includes('action=logExpense')) {
            fresh.tab = 'gastos';
          } else if (qs.includes('action=monthSummary')) {
            fresh.tab = 'monthSummary';
          }
          setState(fresh);
        }
      } catch (e) {
        if (!cancelled) setState(defaultState());
      } finally {
        if (!cancelled) {
          hasLoaded.current = true;
          setLocalLoaded(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* persist (debounced) — local always; cloud push too, but ONLY after the initial
     pull for this sign-in has finished, so we never push stale/empty data over a
     real backup (this ordering is what caused the earlier data-loss bug). */
  const syncGuard = useRef({
    pulled: false,
    pulling: false
  });
  useEffect(() => {
    if (!state || !localLoaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      // Never persist or timestamp a blank/not-set-up state. On a new device you
      // are not logged in yet, so without this the empty default would stamp a
      // fresh "now" and make your real cloud backup look older (and get clobbered
      // + leave you stuck on the welcome screen).
      if (isBlankState(state)) return;
      // If signed in, don't save anything (local or cloud) until the cloud
      // backup has finished downloading.
      if (sbClient && authUser && !syncGuard.current.pulled) return;
      const toSave = buildPersistPayload(state);
      localUpdatedAtRef.current = toSave._updatedAt;
      storageAdapter.set(STORAGE_KEY, JSON.stringify(toSave)).catch(() => setStorageWarning('Could not save. Your changes might not persist.'));
      if (sbClient && authUser && syncGuard.current.pulled && !syncGuard.current.pulling) {
        setCloudSyncStatus('syncing');
        sbClient.from('user_state').upsert({
          user_id: authUser.id,
          data: toSave,
          updated_at: new Date().toISOString()
        }).then(({
          error
        }) => {
          if (error) {
            setCloudSyncError(error.message);
            setCloudSyncStatus('error');
          } else {
            setCloudSyncError('');
            setCloudSyncStatus('synced');
            setCloudBackupInfo({
              updatedAt: new Date().toISOString()
            });
          }
        });
      }
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [state, authUser, localLoaded]);

  /* on sign-in: pull the account's backup down automatically and instantly —
     but ONLY if the cloud copy is actually newer than what's already on this
     device. Otherwise a slow/incomplete previous push could clobber a fresh
     local edit the moment you reopen the app. */
  const [cloudSyncError, setCloudSyncError] = useState('');
  const [cloudSyncStatus, setCloudSyncStatus] = useState('idle'); // idle | syncing | synced | error
  const [cloudBackupInfo, setCloudBackupInfo] = useState(null); // {updatedAt} | 'none' | null
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' && window.innerWidth >= 880);
  const [bypassAuthGate, setBypassAuthGate] = useState(false);
  const [showLoginFromWelcome, setShowLoginFromWelcome] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setIsDesktop(window.innerWidth >= 880);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  useEffect(() => {
    if (!sbClient || !authUser || !localLoaded) return;
    syncGuard.current = {
      pulled: false,
      pulling: true
    };
    setCloudSyncStatus('syncing');
    setCloudSyncError('');
    sbClient.from('user_state').select('data, updated_at').eq('user_id', authUser.id).maybeSingle().then(({
      data,
      error
    }) => {
      if (error) {
        setCloudSyncError(error.message);
        setCloudSyncStatus('error');
        syncGuard.current = {
          pulled: true,
          pulling: false
        };
        return;
      }
      if (data && data.data && Object.keys(data.data).length > 0) {
        const cloudUpdatedAtMs = data.data._updatedAt || new Date(data.updated_at).getTime();
        if (cloudUpdatedAtMs > localUpdatedAtRef.current) {
          setState(Object.assign(defaultState(), data.data, {
            hasSeenWelcome: true,
            tab: typeof window !== 'undefined' && window.location && window.location.search.includes('action=logExpense') ? 'gastos' : 'inicio'
          }));
          localUpdatedAtRef.current = cloudUpdatedAtMs;
        }
        setCloudBackupInfo({
          updatedAt: data.updated_at
        });
        setCloudSyncStatus('synced');
      } else {
        setCloudBackupInfo('none');
        setCloudSyncStatus('idle');
      }
      syncGuard.current = {
        pulled: true,
        pulling: false
      };
    });
  }, [authUser, localLoaded]);
  const patch = fn => setState(s => ({
    ...s,
    ...(typeof fn === 'function' ? fn(s) : fn)
  }));

  /* ---- handlers ---- */
  const setTab = name => patch({
    tab: name
  });
  const onIncome = e => patch({
    income: parseFloat(e.target.value) || 0
  });
  const setPayFrequency = freq => patch({
    payFrequency: freq
  });
  const finishEditingIncome = () => {
    setEditingIncome(false);
  };
  const removeIncomeHistoryEntry = id => patch(s => ({
    incomeHistory: (s.incomeHistory || []).filter(e => e.id !== id)
  }));
  const addManualPaycheck = (dateStr, amount) => {
    if (!dateStr || !amount) return;
    patch(s => ({
      paycheckLog: (s.paycheckLog || []).concat([{
        id: Date.now(),
        date: dateStr,
        amount
      }]).sort((a, b) => a.date.localeCompare(b.date)).slice(-104)
    }));
  };
  const removePaycheckEntry = id => patch(s => ({
    paycheckLog: (s.paycheckLog || []).filter(p => p.id !== id)
  }));
  const onNextPaydayDate = e => patch({
    nextPaydayDate: e.target.value
  });
  // Log a deposit. isPaycheck=true means it's a regular paycheck: on biweekly plans
  // it also advances the next payday. A different-amount deposit (a gift, side money,
  // a bonus) is recorded the same way but never touches the payday schedule.
  const logDeposit = (amount, isPaycheck) => {
    patch(s => {
      const amt = amount != null ? amount : (s.income || 0);
      const entry = {
        id: Date.now(),
        date: todayStr,
        amount: amt,
        kind: isPaycheck ? 'paycheck' : 'other'
      };
      const out = {
        paycheckLog: (s.paycheckLog || []).concat([entry]).slice(-52)
      };
      if (isPaycheck && s.payFrequency === 'biweekly') {
        const anchor = s.nextPaydayDate ? new Date(s.nextPaydayDate + 'T00:00:00') : new Date();
        const advanced = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() + 14);
        let next = advanced;
        const today = new Date();
        while (next.getTime() < new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) {
          next = new Date(next.getFullYear(), next.getMonth(), next.getDate() + 14);
        }
        out.nextPaydayDate = toDateStr(next.getFullYear(), next.getMonth(), next.getDate());
      }
      return out;
    });
  };
  const applyLeftoverAllocation = (spendingAmt, goalAmts, invAmts) => {
    patch(s => {
      const label = (s.pendingLeftover && s.pendingLeftover.label ? s.pendingLeftover.label : 'Last month') + ' leftover';
      const goals = s.goals.map(g => {
        const amt = (goalAmts && goalAmts[g.id]) || 0;
        if (amt <= 0) return g;
        return {
          ...g,
          current: (g.current || 0) + amt,
          savingsLog: [{
            id: Date.now() + Math.random(),
            label,
            amount: amt
          }].concat(g.savingsLog || []).slice(0, 12)
        };
      });
      const investments = s.investments.map(i => {
        const amt = (invAmts && invAmts[i.id]) || 0;
        if (amt <= 0) return i;
        return {
          ...i,
          amount: (i.amount || 0) + amt,
          currentValue: (i.currentValue || 0) + amt,
          lastUpdated: todayStr,
          log: [{
            id: Date.now() + Math.random(),
            amount: amt,
            date: todayStr
          }].concat(i.log || []).slice(0, 24)
        };
      });
      return {
        goals,
        investments,
        spendingBoost: (s.spendingBoost || 0) + (spendingAmt || 0),
        pendingLeftover: null
      };
    });
  };
  const setNotificationsEnabled = on => {
    // Reflect the user's intent immediately so the toggle always responds.
    // Whether a notification actually fires is still gated on real permission at fire time.
    patch({
      notificationsEnabled: !!on
    });
    if (on && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      try {
        const r = Notification.requestPermission();
        if (r && typeof r.then === 'function') r.then(() => setState(s => Object.assign({}, s))).catch(() => {});
      } catch (e) {}
    }
  };
  const dismissLeftover = () => {
    patch(s => {
      if (!s.pendingLeftover) return {
        pendingLeftover: null
      };
      // Recompute live from that month's actual expenses (edits after month rollover).
      const p = parseMonthYearLabel(s.pendingLeftover.label);
      const spent = s.expenseLog.filter(e => {
        const d = new Date(entryDateStr(e) + 'T00:00:00');
        return d.getFullYear() === p.year && d.getMonth() === p.month;
      }).reduce((a, e) => a + e.amount, 0);
      const budget = sum(s.expenseCategories) + (s.nonRecurringBudget || 0);
      const amount = Math.max(Math.round(budget - spent), 0);
      if (amount <= 0) return {
        pendingLeftover: null
      };
      const label = s.pendingLeftover.label + ' leftover';
      const active = g => !(g.target > 0 && goalCurrentTotal(g, s.investments) >= g.target);
      const manualPercentTotal = s.goals.filter(g => g.mode === 'manual' && active(g)).reduce((a, g) => a + (g.percent || 0), 0);
      const autoCount = Math.max(s.goals.filter(g => g.mode !== 'manual' && active(g)).length, 1);
      const autoPercentEach = Math.max(100 - manualPercentTotal, 0) / autoCount;
      const goals = s.goals.map(g => {
        const percent = !active(g) ? 0 : g.mode === 'manual' ? g.percent || 0 : autoPercentEach;
        const share = Math.round(amount * (percent / 100));
        if (share <= 0) return g;
        return {
          ...g,
          current: (g.current || 0) + share,
          savingsLog: [{
            id: Date.now() + Math.random(),
            label,
            amount: share
          }].concat(g.savingsLog || []).slice(0, 12)
        };
      });
      return {
        goals,
        pendingLeftover: null
      };
    });
  };
  const onNonRecurringBudget = e => patch({
    nonRecurringBudget: parseFloat(e.target.value) || 0
  });
  const addExpenseRow = () => patch(s => ({
    expenseCategories: s.expenseCategories.concat([{
      name: 'New expense',
      amount: 0,
      fixed: false,
      color: PALETTE[s.expenseCategories.length % PALETTE.length]
    }])
  }));
  const removeExpenseRow = i => {
    askConfirm("Delete this budget category? This won't remove past logged expenses.", () => patch(s => ({
      expenseCategories: s.expenseCategories.filter((_, idx) => idx !== i)
    })));
  };
  const reorderExpenseRow = (from, to) => {
    if (from === to) return;
    patch(s => {
      const arr = s.expenseCategories.slice();
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return {
        expenseCategories: arr
      };
    });
  };
  const toggleExpenseFixed = i => patch(s => {
    const rows = s.expenseCategories.slice();
    rows[i] = {
      ...rows[i],
      fixed: !rows[i].fixed
    };
    return {
      expenseCategories: rows
    };
  });
  const updateExpenseRow = (i, field, val) => patch(s => {
    const rows = s.expenseCategories.slice();
    rows[i] = {
      ...rows[i],
      [field]: field === 'amount' ? parseFloat(val) || 0 : val
    };
    return {
      expenseCategories: rows
    };
  });
  const fillRecurringAmount = (categoryName, s) => {
    const cat = s.expenseCategories.find(c => c.name === categoryName);
    if (cat && cat.fixed) setLogAmount(String(cat.amount));else setLogAmount('');
  };
  const addLogEntry = () => {
    const amt = parseFloat(logAmount) || 0;
    if (amt <= 0) return;
    const recurring = logType === 'recurring';
    const d = new Date((selectedDate || todayStr) + 'T00:00:00');
    patch(s => {
      const recurringCats = s.expenseCategories.map(c => c.name);
      const name = recurring ? logCategory || recurringCats[0] || 'Expense' : logName.trim() || 'Expense';
      return {
        expenseLog: s.expenseLog.concat([{
          id: Date.now(),
          date: selectedDate || todayStr,
          year: d.getFullYear(),
          month: d.getMonth(),
          day: d.getDate(),
          amount: amt,
          name,
          recurring
        }])
      };
    });
    setLogAmount('');
    setLogName('');
  };
  // Quick-add from Home: always logs to today, regardless of the calendar's selected day.
  const addLogEntryToday = () => {
    const amt = parseFloat(logAmount) || 0;
    if (amt <= 0) return;
    const recurring = logType === 'recurring';
    const d = new Date(todayStr + 'T00:00:00');
    patch(s => {
      const recurringCats = s.expenseCategories.map(c => c.name);
      const name = recurring ? logCategory || recurringCats[0] || 'Expense' : logName.trim() || 'Expense';
      return {
        expenseLog: s.expenseLog.concat([{
          id: Date.now(),
          date: todayStr,
          year: d.getFullYear(),
          month: d.getMonth(),
          day: d.getDate(),
          amount: amt,
          name,
          recurring
        }])
      };
    });
    setLogAmount('');
    setLogName('');
  };
  const removeLogEntry = id => patch(s => ({
    expenseLog: s.expenseLog.filter(e => e.id !== id)
  }));
  const removePlannedExpense = id => patch(s => ({
    plannedExpenses: s.plannedExpenses.filter(p => p.id !== id)
  }));
  const markPlannedAsSpent = id => {
    patch(s => {
      const p = s.plannedExpenses.find(x => x.id === id);
      if (!p) return {};
      const d = new Date(p.date + 'T00:00:00');
      return {
        plannedExpenses: s.plannedExpenses.filter(x => x.id !== id),
        expenseLog: s.expenseLog.concat([{
          id: Date.now(),
          date: p.date,
          year: d.getFullYear(),
          month: d.getMonth(),
          day: d.getDate(),
          amount: p.amount,
          name: p.name,
          recurring: false
        }])
      };
    });
  };
  const selectGoal = id => patch({
    selectedGoalId: id
  });
  const addGoal = () => {
    patch(s => {
      if (s.goals.length >= 6) return {};
      const id = Date.now();
      const now = new Date();
      const newGoal = {
        id,
        name: 'New goal',
        icon: 'star',
        color: PALETTE[s.goals.length % PALETTE.length],
        target: 1000,
        current: 0,
        mode: 'auto',
        percent: 0,
        customDate: '',
        horizon: null,
        reminderOn: false,
        reminderDay: 1,
        savingsLog: [],
        skippedMonths: [],
        createdMonth: now.getMonth(),
        createdYear: now.getFullYear()
      };
      return {
        goals: s.goals.concat([newGoal]),
        selectedGoalId: id
      };
    });
  };
  const addEmergencyFundGoal = (months, apy) => {
    patch(s => {
      if (s.goals.length >= 6) return {};
      const id = Date.now();
      const now = new Date();
      const monthlyExpense = ctx.totalExpenses > 0 ? ctx.totalExpenses : monthlyIncomeOf(s) * 0.6;
      const newGoal = {
        id,
        name: s.language === 'es' ? 'Fondo de emergencia' : 'Emergency Fund',
        icon: 'shield',
        color: '#0071e3',
        target: Math.round(monthlyExpense * months),
        current: 0,
        mode: 'auto',
        percent: 0,
        customDate: '',
        horizon: 'short',
        reminderOn: false,
        reminderDay: 1,
        savingsLog: [],
        skippedMonths: [],
        apy: apy != null && apy > 0 ? apy : null,
        createdMonth: now.getMonth(),
        createdYear: now.getFullYear()
      };
      return {
        goals: s.goals.concat([newGoal]),
        selectedGoalId: id
      };
    });
  };
  const createRetirementGoal = investmentId => {
    if (state.goals.length >= 6) return;
    patch(s => {
      if (s.goals.length >= 6) return {};
      const id = Date.now();
      const now = new Date();
      const monthlyExp = sum(s.expenseCategories) + (s.nonRecurringBudget || 0) || monthlyIncomeOf(s) * 0.6;
      // 25× rule (a.k.a. 4% rule): target ≈ 25 years of annual spending.
      const target = Math.max(Math.round(monthlyExp * 12 * 25), 0);
      const inv = s.investments.find(i => i.id === investmentId);
      const newGoal = {
        id,
        name: s.language === 'es' ? 'Retiro' : 'Retirement',
        icon: 'star',
        color: PALETTE[s.goals.length % PALETTE.length],
        target,
        current: 0,
        mode: 'auto',
        percent: 0,
        customDate: '',
        horizon: 'long',
        isRetirementGoal: true,
        reminderOn: false,
        reminderDay: 1,
        savingsLog: [],
        skippedMonths: [],
        createdMonth: now.getMonth(),
        createdYear: now.getFullYear()
      };
      const investments = s.investments.map(i => i.id === investmentId ? {
        ...i,
        goalId: id,
        syncWithGoal: true
      } : i);
      return {
        goals: s.goals.concat([newGoal]),
        investments,
        selectedGoalId: id
      };
    });
    setShowGoalDetail(true);
    setTab('metas');
  };
  const removeGoal = id => {
    askConfirm(state.language === 'es' ? '¿Eliminar esta meta? Se perderá su progreso e historial.' : 'Delete this goal? Its saved progress and history will be lost.', () => patch(s => {
      const goals = s.goals.filter(g => g.id !== id);
      return {
        goals,
        selectedGoalId: s.selectedGoalId === id ? goals[0] ? goals[0].id : null : s.selectedGoalId
      };
    }));
  };
  const updateGoal = (id, field, val) => patch(s => ({
    goals: s.goals.map(g => g.id === id ? {
      ...g,
      [field]: val
    } : g)
  }));
  const setGoalColor = (id, hex) => updateGoal(id, 'color', hex);
  const setGoalIcon = (id, key) => updateGoal(id, 'icon', key);
  const toggleGoalMode = id => patch(s => ({
    goals: s.goals.map(g => g.id === id ? {
      ...g,
      mode: g.mode === 'manual' ? 'auto' : 'manual'
    } : g)
  }));
  const toggleReminder = id => patch(s => ({
    goals: s.goals.map(g => g.id === id ? {
      ...g,
      reminderOn: !g.reminderOn
    } : g)
  }));
  const toggleSkipMonth = (id, year, month) => patch(s => ({
    goals: s.goals.map(g => {
      if (g.id !== id) return g;
      const list = g.skippedMonths || [];
      const exists = list.some(sm => sm.year === year && sm.month === month);
      return {
        ...g,
        skippedMonths: exists ? list.filter(sm => !(sm.year === year && sm.month === month)) : list.concat([{
          year,
          month
        }])
      };
    })
  }));
  const registerDeposit = id => {
    const amt = parseFloat(depositAmount) || 0;
    if (amt <= 0) return;
    const label = MONTH_NAMES[new Date().getMonth()] + ' ' + new Date().getFullYear();
    patch(s => ({
      goals: s.goals.map(g => g.id === id ? {
        ...g,
        current: (g.current || 0) + amt,
        savingsLog: [{
          id: Date.now(),
          label,
          amount: amt
        }].concat(g.savingsLog || []).slice(0, 60)
      } : g)
    }));
    setDepositAmount('');
  };
  const removeSavingsLogEntry = (goalId, entryId) => patch(s => ({
    goals: s.goals.map(g => {
      if (g.id !== goalId) return g;
      const entry = (g.savingsLog || []).find(e => e.id === entryId);
      if (!entry) return g;
      return {
        ...g,
        current: Math.max((g.current || 0) - entry.amount, 0),
        savingsLog: g.savingsLog.filter(e => e.id !== entryId)
      };
    })
  }));
  const updateSavingsLogEntryAmount = (goalId, entryId, newAmount) => patch(s => ({
    goals: s.goals.map(g => {
      if (g.id !== goalId) return g;
      const entry = (g.savingsLog || []).find(e => e.id === entryId);
      if (!entry) return g;
      const delta = newAmount - entry.amount;
      return {
        ...g,
        current: Math.max((g.current || 0) + delta, 0),
        savingsLog: g.savingsLog.map(e => e.id === entryId ? {
          ...e,
          amount: newAmount
        } : e)
      };
    })
  }));
  const addBackdatedSavingsEntry = (goalId, label, amount) => {
    if (!label || !amount) return;
    patch(s => ({
      goals: s.goals.map(g => g.id === goalId ? {
        ...g,
        current: (g.current || 0) + amount,
        savingsLog: [{
          id: Date.now(),
          label,
          amount
        }].concat(g.savingsLog || []).slice(0, 60)
      } : g)
    }));
  };
  const addHustle = () => patch(s => ({
    hustles: s.hustles.concat([{
      id: Date.now(),
      name: 'New extra income',
      amount: 0,
      streak: 0,
      lastMonth: '',
      goalId: null
    }])
  }));
  const removeHustle = id => {
    askConfirm('Delete this side hustle? Its streak history will be lost.', () => patch(s => ({
      hustles: s.hustles.filter(h => h.id !== id)
    })));
  };
  const updateHustle = (id, field, val) => patch(s => ({
    hustles: s.hustles.map(h => h.id === id ? {
      ...h,
      [field]: field === 'amount' ? parseFloat(val) || 0 : val
    } : h)
  }));
  const setHustleGoal = (id, goalId) => patch(s => ({
    hustles: s.hustles.map(h => h.id === id ? {
      ...h,
      goalId: goalId || null
    } : h)
  }));
  const checkInHustle = id => {
    const key = currentMonthKey();
    patch(s => {
      const h = s.hustles.find(x => x.id === id);
      if (!h || h.lastMonth === key) return {};
      const hustles = s.hustles.map(x => x.id === id ? {
        ...x,
        streak: (x.streak || 0) + 1,
        lastMonth: key
      } : x);
      let goals = s.goals;
      if (h.goalId && h.amount > 0) {
        const label = MONTH_NAMES[new Date().getMonth()] + ' ' + new Date().getFullYear() + ' — ' + h.name;
        goals = s.goals.map(g => g.id === h.goalId ? {
          ...g,
          current: (g.current || 0) + h.amount,
          savingsLog: [{
            id: Date.now() + Math.random(),
            label,
            amount: h.amount
          }].concat(g.savingsLog || []).slice(0, 12)
        } : g);
      }
      return {
        hustles,
        goals
      };
    });
  };
  const addInvestment = (name, isRetirement) => {
    const id = Date.now();
    patch(s => ({
      investments: s.investments.concat([{
        id,
        name: name || 'New investment',
        fund: '',
        amount: 0,
        currentValue: 0,
        isRetirement: typeof isRetirement === 'boolean' ? isRetirement : null,
        mode: 'off',
        percent: 0,
        goalId: null,
        syncWithGoal: false,
        assetType: null,
        log: [],
        lastUpdated: todayStr
      }]),
      selectedInvestmentId: id
    }));
    return id;
  };
  const addPortfolioFund = (name, isRetirement) => addInvestment(name, isRetirement);
  const selectInvestment = id => patch({
    selectedInvestmentId: id
  });
  const removeInvestment = id => {
    askConfirm(state.language === 'es' ? '¿Eliminar este fondo de tu portafolio? Se perderá su historial de aportes.' : "Delete this fund from your portfolio? Its contribution history will be lost.", () => {
      patch(st => ({
        investments: st.investments.filter(i => i.id !== id)
      }));
      setShowInvestDetail(false);
    });
  };
  const updateInvestment = (id, field, val) => patch(s => ({
    investments: s.investments.map(i => i.id === id ? {
      ...i,
      [field]: field === 'amount' || field === 'currentValue' ? parseFloat(val) || 0 : field === 'percent' ? Math.max(0, Math.min(100, parseFloat(val) || 0)) : val,
      ...(field === 'currentValue' ? {
        lastUpdated: todayStr
      } : {})
    } : i)
  }));
  const cycleInvestmentMode = id => patch(s => ({
    investments: s.investments.map(i => i.id === id ? {
      ...i,
      mode: i.mode === 'off' || !i.mode ? 'auto' : i.mode === 'auto' ? 'manual' : 'off'
    } : i)
  }));
  const setInvestmentGoalLink = (id, goalId) => patch(s => ({
    investments: s.investments.map(i => i.id === id ? {
      ...i,
      goalId: goalId || null,
      syncWithGoal: goalId ? i.syncWithGoal : false
    } : i)
  }));
  const toggleInvestmentSync = id => patch(s => ({
    investments: s.investments.map(i => i.id === id ? {
      ...i,
      syncWithGoal: !i.syncWithGoal
    } : i)
  }));
  const setInvestmentRetirement = (id, isRetirement) => patch(s => ({
    investments: s.investments.map(i => i.id === id ? {
      ...i,
      isRetirement
    } : i)
  }));
  const logInvestmentContribution = (id, amount) => patch(s => ({
    investments: s.investments.map(i => {
      if (i.id !== id || !(amount > 0)) return i;
      return {
        ...i,
        amount: (i.amount || 0) + amount,
        currentValue: (i.currentValue || 0) + amount,
        lastUpdated: todayStr,
        log: [{
          id: Date.now() + Math.random(),
          amount,
          date: todayStr
        }].concat(i.log || []).slice(0, 24)
      };
    })
  }));
  const editInvestmentContribution = (fundId, entryId, newAmount) => patch(s => ({
    investments: s.investments.map(i => {
      if (i.id !== fundId) return i;
      const entry = (i.log || []).find(e => e.id === entryId);
      if (!entry) return i;
      const delta = (parseFloat(newAmount) || 0) - entry.amount;
      return {
        ...i,
        amount: Math.max(0, (i.amount || 0) + delta),
        currentValue: Math.max(0, (i.currentValue || 0) + delta),
        log: i.log.map(e => e.id === entryId ? {
          ...e,
          amount: parseFloat(newAmount) || 0
        } : e)
      };
    })
  }));
  const removeInvestmentContribution = (fundId, entryId) => patch(s => ({
    investments: s.investments.map(i => {
      if (i.id !== fundId) return i;
      const entry = (i.log || []).find(e => e.id === entryId);
      if (!entry) return i;
      return {
        ...i,
        amount: Math.max(0, (i.amount || 0) - entry.amount),
        currentValue: Math.max(0, (i.currentValue || 0) - entry.amount),
        log: i.log.filter(e => e.id !== entryId)
      };
    })
  }));
  const markInvestmentUpdated = id => patch(s => ({
    investments: s.investments.map(i => i.id === id ? {
      ...i,
      lastUpdated: todayStr
    } : i)
  }));
  const dismissWelcome = () => patch({
    hasSeenWelcome: true
  });
  const dismissTabIntro = key => patch(s => ({
    seenTabIntro: {
      ...s.seenTabIntro,
      [key]: true
    }
  }));
  const dismissTip = id => patch(s => ({
    dismissedTips: Object.assign({}, s.dismissedTips, {
      [id]: true
    })
  }));
  const setLanguage = lang => patch({
    language: lang
  });
  const setIncomeProfile = profile => patch({
    incomeProfile: profile,
    payFrequency: profile === 'allowance' ? 'monthly' : state && state.payFrequency || 'monthly'
  });
  const setStudentAge = age => patch({
    studentAge: age
  });
  const setInvestsWithParents = v => patch({
    investsWithParents: v
  });
  const setEmploymentType = t => patch({
    employmentType: t
  });
  const setHasFixedContracts = v => patch({
    hasFixedContracts: v
  });
  const togglePreset = name => setSelectedPresets(prev => prev.includes(name) ? prev.filter(x => x !== name) : prev.concat([name]));
  const applyBudgetPresets = () => {
    patch(s => {
      const newRows = selectedPresets.map((name, i) => ({
        name,
        amount: 0,
        fixed: true,
        color: PALETTE[(s.expenseCategories.length + i) % PALETTE.length]
      }));
      return {
        expenseCategories: s.expenseCategories.concat(newRows),
        skippedBudgetSetup: true
      };
    });
    setSelectedPresets([]);
  };
  const skipBudgetSetup = () => patch({
    skippedBudgetSetup: true
  });
  const resetApp = () => {
    askConfirm('Reset the app? This deletes everything — goals, expenses, investments, all of it. This cannot be undone.', () => {
      storageAdapter.set(STORAGE_KEY, JSON.stringify(buildPersistPayload(defaultState()))).catch(() => {});
      setState(defaultState());
    });
  };
  const sendFeedback = () => {
    if (!feedbackText.trim()) return;
    setFeedbackStatus('sending');
    fetch('https://formspree.io/f/xrpzbeyd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: feedbackText,
        app: 'Financial Planner'
      })
    }).then(res => {
      if (res.ok) {
        setFeedbackStatus('sent');
        setFeedbackText('');
      } else {
        setFeedbackStatus('error');
      }
    }).catch(() => setFeedbackStatus('error'));
  };
  const exportData = () => {
    const payload = buildPersistPayload(s);
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial-planner-backup-' + todayStr + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  const triggerImport = () => {
    if (importInputRef.current) importInputRef.current.click();
  };
  const handleImportFile = e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        setState(Object.assign(defaultState(), parsed));
        setImportMessage('Data imported successfully.');
      } catch (err) {
        setImportMessage('Could not read that file — make sure it\'s a backup exported from this app.');
      }
      setTimeout(() => setImportMessage(''), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };
  const downloadReport = scope => {
    const months = scope === 'quarter' ? [(reportQuarter - 1) * 3, (reportQuarter - 1) * 3 + 1, (reportQuarter - 1) * 3 + 2] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const monthCount = months.length;
    const periodLabel = scope === 'quarter' ? 'Q' + reportQuarter + ' ' + reportYear : 'Year ' + reportYear;
    const ctxNow = computeCtx(s);
    const periodExpenseEntries = s.expenseLog.filter(e => e.year === reportYear && months.includes(e.month));
    const actualRecurring = periodExpenseEntries.filter(e => e.recurring).reduce((a, e) => a + e.amount, 0);
    const actualNonRecurring = periodExpenseEntries.filter(e => !e.recurring).reduce((a, e) => a + e.amount, 0);
    const actualTotal = actualRecurring + actualNonRecurring;
    const plannedTotal = ctxNow.totalExpenses * monthCount;
    const periodIncome = ctxNow.monthlyIncome * monthCount;
    const categoryRows = s.expenseCategories.map(c => {
      const actual = periodExpenseEntries.filter(e => e.recurring && e.name === c.name).reduce((a, e) => a + e.amount, 0);
      const planned = c.amount * monthCount;
      return {
        name: c.name,
        actual,
        planned
      };
    });
    const goalRows = s.goals.map(g => {
      const deposits = (g.savingsLog || []).filter(entry => {
        const p = parseMonthYearLabel(entry.label);
        return p.year === reportYear && months.includes(p.month);
      }).reduce((a, entry) => a + entry.amount, 0);
      const gcur = goalCurrentTotal(g, s.investments);
      const pct = g.target > 0 ? Math.min(100, gcur / g.target * 100) : 0;
      return {
        name: g.name,
        deposits,
        current: gcur,
        target: g.target,
        pct
      };
    });
    const hustleMonthlyTotal = sum(s.hustles);
    const esc = str => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const rowsHtml = rows => rows.map(r => '<tr><td>' + esc(r.name) + '</td><td style="text-align:right">' + fmt(r.actual) + '</td><td style="text-align:right;color:#86868b">' + fmt(r.planned) + '</td></tr>').join('');
    const goalsHtml = goalRows.map(r => '<tr><td>' + esc(r.name) + '</td><td style="text-align:right">' + fmt(r.deposits) + '</td><td style="text-align:right">' + fmt(r.current) + ' / ' + fmt(r.target) + '</td><td style="text-align:right">' + r.pct.toFixed(0) + '%</td></tr>').join('');
    const investHtml = s.investments.map(inv => {
      const gain = (inv.currentValue || 0) - (inv.amount || 0);
      const gainPct = inv.amount > 0 ? gain / inv.amount * 100 : 0;
      const gainStr = (gain >= 0 ? '+' : '−') + fmt(Math.abs(gain)) + ' (' + (gain >= 0 ? '+' : '−') + Math.abs(gainPct).toFixed(1) + '%)';
      return '<tr><td>' + esc(inv.name) + '</td><td style="text-align:right">' + fmt(inv.amount) + '</td><td style="text-align:right">' + fmt(inv.currentValue || 0) + '</td><td style="text-align:right">' + esc(gainStr) + '</td><td style="text-align:right;color:#86868b">' + esc(inv.lastUpdated || '—') + '</td></tr>';
    }).join('');
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Financial Report — ' + esc(periodLabel) + '</title>' + '<style>' + 'body{font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;color:#1d1d1f;max-width:680px;margin:40px auto;padding:0 20px;}' + 'h1{font-size:24px;margin-bottom:2px;} .sub{color:#86868b;font-size:13px;margin-bottom:28px;}' + 'h2{font-size:15px;margin-top:32px;margin-bottom:10px;border-bottom:1px solid #e5e5ea;padding-bottom:6px;}' + 'table{width:100%;border-collapse:collapse;font-size:13px;} td,th{padding:7px 4px;border-bottom:1px solid #f0f0f2;text-align:left;}' + '.stats{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:8px;} .stat{background:#f5f5f7;border-radius:12px;padding:14px 16px;flex:1;min-width:140px;}' + '.stat .l{font-size:11px;color:#86868b;text-transform:uppercase;letter-spacing:0.03em;} .stat .v{font-size:20px;font-weight:700;margin-top:4px;}' + '.note{font-size:11.5px;color:#86868b;margin-top:28px;line-height:1.5;}' + '</style></head><body>' + '<h1>Financial Report</h1><div class="sub">' + esc(periodLabel) + ' · generated ' + esc(todayStr) + '</div>' + '<div class="stats">' + '<div class="stat"><div class="l">Income</div><div class="v">' + fmt(periodIncome) + '</div></div>' + '<div class="stat"><div class="l">Spent</div><div class="v">' + fmt(actualTotal) + '</div></div>' + '<div class="stat"><div class="l">Budget</div><div class="v">' + fmt(plannedTotal) + '</div></div>' + '</div>' + '<h2>Expenses by category</h2><table><tr><th>Category</th><th style="text-align:right">Actual</th><th style="text-align:right">Budget</th></tr>' + rowsHtml(categoryRows) + '<tr><td><b>Non-recurring</b></td><td style="text-align:right"><b>' + fmt(actualNonRecurring) + '</b></td><td></td></tr></table>' + '<h2>Goals</h2><table><tr><th>Goal</th><th style="text-align:right">Deposited this period</th><th style="text-align:right">Saved / Target</th><th style="text-align:right">Progress</th></tr>' + goalsHtml + '</table>' + (s.investments.length ? '<h2>Investments (snapshot)</h2><table><tr><th>Investment</th><th style="text-align:right">Invested</th><th style="text-align:right">Current value</th><th style="text-align:right">Gain</th><th style="text-align:right">Last updated</th></tr>' + investHtml + '</table>' : '') + '<h2>Side hustles</h2><div style="font-size:13px;">Current combined monthly extra income: <b>' + fmt(hustleMonthlyTotal) + '</b>/mo (snapshot as of report date, not a historical total for this period).</div>' + '<div class="note">Income and budget figures reflect your current settings applied across this period — they are not a historical record of what your income or budget actually was in past months. Expense log entries and goal deposits are the actual dated records you logged.</div>' + '</body></html>';
    const blob = new Blob([html], {
      type: 'text/html'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Financial-Report-' + periodLabel.replace(/\s+/g, '-') + '.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  const calPrevMonth = () => patch(s => {
    const m = s.logMonth - 1,
      wrap = m < 0;
    return {
      logMonth: wrap ? 11 : m,
      logYear: wrap ? s.logYear - 1 : s.logYear
    };
  });
  const calNextMonth = () => patch(s => {
    const m = s.logMonth + 1,
      wrap = m > 11;
    return {
      logMonth: wrap ? 0 : m,
      logYear: wrap ? s.logYear + 1 : s.logYear
    };
  });

  /* ---- chart drawing ---- */
  const drawCharts = (s, ctx) => {
    const canvas = lineCanvasRef.current;
    const dcanvas = donutCanvasRef.current;
    const {
      boostedAvailable,
      baseAvailable,
      autoPercentEach,
      assignedByGoal,
      totalExpenses,
      generalHustleTotal
    } = ctx;
    if (canvas) {
      const goal = s.goals.find(g => g.id === s.selectedGoalId);
      const c2 = canvas.getContext('2d');
      const W = canvas.width,
        H = canvas.height;
      c2.clearRect(0, 0, W, H);
      if (goal) {
        const percent = goal.mode === 'manual' ? goal.percent || 0 : autoPercentEach;
        const monthlyBoosted = boostedAvailable * (percent / 100) + (assignedByGoal[goal.id] || 0);
        const monthlyBase = baseAvailable * (percent / 100);
        const remaining = Math.max(goal.target - goal.current, 0);
        const monthsToGoal = monthlyBoosted > 0 ? Math.ceil(remaining / monthlyBoosted) : Infinity;
        const N = 12;
        const dataBoost = [],
          dataBase = [];
        for (let i = 0; i <= N; i++) {
          dataBoost.push(Math.min(goal.current + monthlyBoosted * i, goal.target * 1.05));
          dataBase.push(Math.min(goal.current + Math.max(monthlyBase, 0) * i, goal.target * 1.05));
        }
        const padL = 54,
          padR = 12,
          padT = 14,
          padB = 18;
        const plotW = W - padL - padR,
          plotH = H - padT - padB;
        const maxY = Math.max(goal.target * 1.08, ...dataBoost, ...dataBase, 1);
        const xAt = i => padL + plotW * (N === 0 ? 0 : i / N);
        const yAt = v => padT + plotH - plotH * (v / maxY);
        c2.strokeStyle = '#f0f0f2';
        c2.fillStyle = '#86868b';
        c2.font = '11px -apple-system, sans-serif';
        c2.textAlign = 'right';
        for (let st = 0; st <= 4; st++) {
          const v = maxY * st / 4,
            y = yAt(v);
          c2.beginPath();
          c2.moveTo(padL, y);
          c2.lineTo(W - padR, y);
          c2.stroke();
          c2.fillText(fmt(v), padL - 8, y + 4);
        }
        c2.strokeStyle = '#c7c7cc';
        c2.setLineDash([4, 4]);
        c2.lineWidth = 1.5;
        const gy = yAt(goal.target);
        c2.beginPath();
        c2.moveTo(padL, gy);
        c2.lineTo(W - padR, gy);
        c2.stroke();
        c2.setLineDash([]);
        // fill under the boosted (with extras) curve first, so it sits behind both lines
        c2.beginPath();
        c2.moveTo(xAt(0), yAt(dataBoost[0]));
        dataBoost.forEach((v, i) => c2.lineTo(xAt(i), yAt(v)));
        c2.lineTo(xAt(dataBoost.length - 1), yAt(0));
        c2.lineTo(xAt(0), yAt(0));
        c2.closePath();
        c2.fillStyle = goal.color + '20';
        c2.fill();
        // salary-only line, drawn on top of the fill so it stays visible
        c2.beginPath();
        c2.moveTo(xAt(0), yAt(dataBase[0]));
        dataBase.forEach((v, i) => c2.lineTo(xAt(i), yAt(v)));
        c2.strokeStyle = '#8e8e93';
        c2.setLineDash([4, 3]);
        c2.lineWidth = 2.25;
        c2.stroke();
        c2.setLineDash([]);
        // boosted (with extras) line on top of everything
        c2.beginPath();
        c2.moveTo(xAt(0), yAt(dataBoost[0]));
        dataBoost.forEach((v, i) => c2.lineTo(xAt(i), yAt(v)));
        c2.strokeStyle = goal.color;
        c2.lineWidth = 2.5;
        c2.stroke();
      }
    }
    let donutCats = [];
    if (dcanvas) {
      const dctx = dcanvas.getContext('2d');
      const DW = dcanvas.width,
        DH = dcanvas.height;
      dctx.clearRect(0, 0, DW, DH);
      const cats = [];
      if (totalExpenses > 0) cats.push({
        label: 'Gastos',
        value: totalExpenses,
        color: '#c7c7cc'
      });
      s.goals.forEach(g => {
        const percent = g.mode === 'manual' ? g.percent || 0 : autoPercentEach;
        const m = boostedAvailable * (percent / 100) + (assignedByGoal[g.id] || 0);
        if (m > 0) cats.push({
          label: g.name,
          value: m,
          color: g.color
        });
      });
      const allocated = cats.slice(totalExpenses > 0 ? 1 : 0).reduce((a, c) => a + c.value, 0);
      const leftover = Math.max(ctx.monthlyIncome + generalHustleTotal - totalExpenses - allocated, 0);
      if (leftover > 1) cats.push({
        label: 'Sin asignar',
        value: leftover,
        color: '#f0f0f2'
      });
      const total = cats.reduce((a, c) => a + c.value, 0) || 1;
      const cx = DW / 2,
        cy = DH / 2,
        rOuter = Math.min(DW, DH) / 2 - 4,
        rInner = rOuter * 0.6;
      let start = -Math.PI / 2;
      cats.forEach(c => {
        const angle = c.value / total * Math.PI * 2;
        dctx.beginPath();
        dctx.moveTo(cx, cy);
        dctx.arc(cx, cy, rOuter, start, start + angle);
        dctx.closePath();
        dctx.fillStyle = c.color;
        dctx.fill();
        start += angle;
      });
      dctx.beginPath();
      dctx.arc(cx, cy, rInner, 0, Math.PI * 2);
      dctx.fillStyle = '#fff';
      dctx.fill();
      donutCats = cats;
    }
    return donutCats;
  };
  const [donutLegend, setDonutLegend] = useState([]);
  useEffect(() => {
    if (!state) return;
    const ctx = computeCtx(state);
    const cats = drawCharts(state, ctx);
    setDonutLegend((cats || []).map(c => ({
      label: c.label + ' — ' + fmt(c.value),
      color: c.color
    })));
    // eslint-disable-next-line
  }, [state]);
  useEffect(() => {
    if (!state) return;
    const hidden = state.incomeProfile === 'allowance' && state.studentAge && state.studentAge < 18 && state.investsWithParents === false;
    if (hidden && state.tab === 'invest') {
      setState(s2 => ({
        ...s2,
        tab: 'inicio'
      }));
    }
    // eslint-disable-next-line
  }, [state && state.tab, state && state.incomeProfile, state && state.studentAge, state && state.investsWithParents]);
  if (!state) {
    return /*#__PURE__*/React.createElement("div", {
      style: css('min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f5f7;color:#86868b;font-family:-apple-system,BlinkMacSystemFont,Inter,system-ui,sans-serif;font-size:14px;')
    }, "Loading…");
  }
  const s = state;
  const t = key => STRINGS[s.language] && STRINGS[s.language][key] || STRINGS.en[key] || key;
  if (sbClient && (s.hasSeenWelcome || showLoginFromWelcome) && !authUser && !authLoading && !bypassAuthGate) {
    const isSignup = authMode === 'signup';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: '100vh',
        background: '#f5f5f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Display",Inter,system-ui,sans-serif'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: 20,
        padding: '28px 24px',
        maxWidth: 360,
        width: '100%',
        boxShadow: '0 30px 70px rgba(0,0,0,0.2)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 26,
        fontWeight: 800,
        marginBottom: 6,
        color: '#1d1d1f',
        letterSpacing: '-0.02em'
      }
    }, isSignup ? s.language === 'es' ? 'Crear cuenta' : 'Sign up' : s.language === 'es' ? 'Iniciar sesión' : 'Log in'), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: '#6e6e73',
        marginBottom: 22
      }
    }, isSignup ? s.language === 'es' ? 'Crea una cuenta para guardar tus metas.' : 'Create an account to save your goals.' : s.language === 'es' ? 'Inicia sesión para ver tu información.' : 'Log in to see your information.'), /*#__PURE__*/React.createElement("input", {
      type: "email",
      placeholder: s.language === 'es' ? 'Correo' : 'Email',
      value: authEmail,
      onChange: e => setAuthEmail(e.target.value),
      autoCapitalize: "off",
      autoCorrect: "off",
      style: {
        width: '100%',
        padding: '13px 14px',
        border: '1px solid #e5e5ea',
        borderRadius: 12,
        fontSize: 14,
        background: '#fbfbfd',
        marginBottom: 10,
        boxSizing: 'border-box'
      }
    }), /*#__PURE__*/React.createElement("input", {
      type: "password",
      placeholder: s.language === 'es' ? 'Contraseña' : 'Password',
      value: authPassword,
      onChange: e => setAuthPassword(e.target.value),
      onKeyDown: e => {
        if (e.key === 'Enter') isSignup ? signUpWithEmail() : signInWithEmail();
      },
      style: {
        width: '100%',
        padding: '13px 14px',
        border: '1px solid #e5e5ea',
        borderRadius: 12,
        fontSize: 14,
        background: '#fbfbfd',
        marginBottom: 16,
        boxSizing: 'border-box'
      }
    }), /*#__PURE__*/React.createElement("button", {
      disabled: authBusy,
      onClick: isSignup ? signUpWithEmail : signInWithEmail,
      style: {
        width: '100%',
        background: authBusy ? '#a1c9f4' : '#0071e3',
        color: '#fff',
        border: 'none',
        padding: 13,
        borderRadius: 12,
        fontSize: 14.5,
        fontWeight: 700,
        cursor: 'pointer',
        marginBottom: 16
      }
    }, authBusy ? '…' : isSignup ? s.language === 'es' ? 'Crear cuenta' : 'Sign up' : s.language === 'es' ? 'Iniciar sesión' : 'Log in'), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 1,
        background: '#e5e5ea'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: '#86868b'
      }
    }, s.language === 'es' ? 'O' : 'Or'), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 1,
        background: '#e5e5ea'
      }
    })), /*#__PURE__*/React.createElement("button", {
      onClick: signInWithGoogle,
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        background: '#fff',
        color: '#1d1d1f',
        border: '1px solid #e5e5ea',
        padding: 12,
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "18",
      height: "18"
    }, /*#__PURE__*/React.createElement("path", {
      fill: "#4285F4",
      d: "M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46c-.28 1.5-1.13 2.78-2.4 3.63v3.02h3.88c2.27-2.09 3.56-5.17 3.56-8.84z"
    }), /*#__PURE__*/React.createElement("path", {
      fill: "#34A853",
      d: "M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.12A12 12 0 0 0 12 24z"
    }), /*#__PURE__*/React.createElement("path", {
      fill: "#FBBC05",
      d: "M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.61H1.27a12 12 0 0 0 0 10.78l4-3.12z"
    }), /*#__PURE__*/React.createElement("path", {
      fill: "#EA4335",
      d: "M12 4.77c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.61l4 3.12C6.22 6.88 8.87 4.77 12 4.77z"
    })), s.language === 'es' ? 'Iniciar sesión con Google' : 'Sign in with Google'), authError && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: '#ff3b30',
        marginBottom: 12,
        lineHeight: 1.4
      }
    }, "⚠ ", authError), authInfo && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: '#0071e3',
        marginBottom: 12,
        lineHeight: 1.4
      }
    }, authInfo), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setAuthMode(isSignup ? 'login' : 'signup');
        setAuthError('');
        setAuthInfo('');
      },
      style: {
        display: 'block',
        width: '100%',
        textAlign: 'center',
        background: 'none',
        border: 'none',
        color: '#1d1d1f',
        fontSize: 13,
        cursor: 'pointer',
        marginBottom: 14
      }
    }, isSignup ? s.language === 'es' ? 'Ya tengo cuenta. Iniciar sesión' : 'Already have an account? Log in' : s.language === 'es' ? 'No tengo cuenta. Crear una' : "I don't have an account. Create one"), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setBypassAuthGate(true);
        setShowLoginFromWelcome(false);
      },
      style: {
        display: 'block',
        width: '100%',
        textAlign: 'center',
        background: 'none',
        border: 'none',
        color: '#86868b',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer'
      }
    }, s.language === 'es' ? 'Continuar sin cuenta' : 'Continue without an account')));
  }
  const hideInvestTab = s.incomeProfile === 'allowance' && s.studentAge && s.studentAge < 18 && s.investsWithParents === false;
  const ctx = computeCtx(s);
  const goalCur = g => goalCurrentTotal(g, s.investments);
  // The month-end leftover is recomputed live from that month's actual expenses,
  // so editing past-month expenses updates the "Leftover from …" card and the summary.
  const pendingLeftoverLive = (() => {
    if (!s.pendingLeftover) return 0;
    const p = parseMonthYearLabel(s.pendingLeftover.label);
    if (p.month == null || isNaN(p.year)) return Math.max(Math.round(s.pendingLeftover.amount || 0), 0);
    const spent = s.expenseLog.filter(e => {
      const d = new Date(entryDateStr(e) + 'T00:00:00');
      return d.getFullYear() === p.year && d.getMonth() === p.month;
    }).reduce((a, e) => a + e.amount, 0);
    const budget = sum(s.expenseCategories) + (s.nonRecurringBudget || 0);
    return Math.max(Math.round(budget - spent), 0);
  })();
  function buildGoalView(goal, isDetail) {
    // Progress = own logged savings + contributions in linked funds (principal, no gains).
    const cur = goalCurrentTotal(goal, s.investments);
    // A fully-funded goal no longer receives a share of monthly savings.
    const goalDone = goal.target > 0 && cur >= goal.target;
    const percent = goalDone ? 0 : goal.mode === 'manual' ? goal.percent || 0 : ctx.autoPercentEach;
    const monthlyBoosted = goalDone ? 0 : ctx.boostedAvailable * (percent / 100) + (ctx.assignedByGoal[goal.id] || 0);
    const remaining = Math.max(goal.target - cur, 0);
    const monthsToGoal = monthlyBoosted > 0 ? Math.ceil(remaining / monthlyBoosted) : Infinity;
    const estDate = isFinite(monthsToGoal) ? addMonths(ctx.today, monthsToGoal) : null;
    const estDateLabel = estDate ? MONTH_NAMES[estDate.getMonth()] + ' ' + estDate.getFullYear() : 'No savings assigned';
    const progressPct = goal.target > 0 ? Math.min(100, cur / goal.target * 100) : 0;
    const isCompleted = goal.target > 0 && cur >= goal.target;
    const view = {
      goal,
      current: cur,
      percent,
      monthlyBoosted,
      progressPct,
      monthsToGoal,
      isCompleted,
      progressLabel: isCompleted ? t('completed') : progressPct.toFixed(0) + '%',
      progressWidth: progressPct.toFixed(1) + '%',
      monthlyLabel: fmt(monthlyBoosted),
      percentLabel: Math.round(percent) + '%',
      estDateLabel,
      monthsLabel: isFinite(monthsToGoal) ? monthsToGoal + (monthsToGoal === 1 ? ' month' : ' months') : 'no timeline'
    };
    if (!isDetail) return view;
    let customMsg = '',
      customMsgColor = '#34c759',
      requiredMonthly = 0,
      paceGapPct = 0;
    if (goal.customDate) {
      const cd = new Date(goal.customDate + 'T00:00:00');
      const monthsUntil = monthsBetween(ctx.today, cd);
      requiredMonthly = remaining / monthsUntil;
      const delta = requiredMonthly - monthlyBoosted;
      paceGapPct = requiredMonthly > 0 ? Math.min(100, monthlyBoosted / requiredMonthly * 100) : 100;
      if (delta > 1) {
        customMsg = 'You need ' + fmt(delta) + ' more per month to reach it by ' + MONTH_NAMES[cd.getMonth()] + ' ' + cd.getFullYear() + '.';
        customMsgColor = '#ff9500';
      } else {
        customMsg = "You're on track — at this pace you'll get there before that date.";
        customMsgColor = '#34c759';
      }
    }
    view.customMsg = customMsg;
    view.customMsgColor = customMsgColor;
    view.requiredMonthly = requiredMonthly;
    view.paceGapPct = paceGapPct;
    return view;
  }
  function buildInvestView(inv) {
    const linkedGoal = inv.goalId ? s.goals.find(g => g.id === inv.goalId) : null;
    const synced = !!(inv.goalId && inv.syncWithGoal && linkedGoal);
    let mode, percent, monthly;
    if (synced) {
      // Vehicle for its goal: shows the goal's own share (the money flowing in),
      // but it is not a separate claimant in the split.
      const gv = buildGoalView(linkedGoal, false);
      mode = linkedGoal.mode === 'manual' ? 'manual' : 'auto';
      percent = gv.percent;
      monthly = gv.monthlyBoosted;
    } else {
      mode = ctx.effInvMode(inv);
      percent = mode === 'manual' ? ctx.effInvPercent(inv) || 0 : mode === 'auto' ? ctx.autoPercentEach : 0;
      monthly = mode === 'off' ? 0 : ctx.boostedAvailable * (percent / 100);
    }
    const assetType = guessAssetType(inv);
    const assetGuessed = !inv.assetType && !!assetType;
    return {
      mode,
      percent,
      monthly,
      linkedGoal,
      assetType,
      assetGuessed,
      synced,
      percentLabel: Math.round(percent) + '%',
      monthlyLabel: fmt(monthly)
    };
  }
  const monthlyTotal = ctx.totalExpenses,
    hustleTotal = ctx.hustleTotal;
  const totalCurrent = s.goals.reduce((a, g) => a + goalCur(g), 0);
  const totalTarget = s.goals.reduce((a, g) => a + (g.target || 0), 0);
  const overallPct = totalTarget > 0 ? Math.min(100, totalCurrent / totalTarget * 100) : 0;
  const globalHustleMessage = hustleTotal <= 0 ? 'Add an extra income below to see how many months you can save on your goals.' : 'Your side hustles add up to ' + fmt(hustleTotal) + '/mo extra — assign them to a specific goal or leave them general to split automatically.';
  const overAllocatedWarning = ctx.manualPercentTotal > 100 ? 'Your manual percentages add up to (' + ctx.manualPercentTotal.toFixed(0) + '%), which is over 100%.' : '';
  const sgSource = s.goals.find(g => g.id === s.selectedGoalId);
  const sg = sgSource ? buildGoalView(sgSource, true) : null;
  const pctColor = pct => pct >= 100 ? '#ff3b30' : '#0071e3';
  const pctGradient = pct => pct >= 100 ? 'linear-gradient(90deg,#ff3b30,#ff9500)' : 'linear-gradient(90deg,#0071e3,#5ac8fa)';
  const periodEntries = s.expenseLog.filter(e => e.year === s.logYear && e.month === s.logMonth);
  const resumenActualRecurringNum = periodEntries.filter(e => e.recurring).reduce((a, e) => a + e.amount, 0);
  const resumenActualNonRecurringNum = periodEntries.filter(e => !e.recurring).reduce((a, e) => a + e.amount, 0);
  const resumenActualTotalNum = resumenActualRecurringNum + resumenActualNonRecurringNum;
  const resumenPlannedTotalNum = monthlyTotal;
  const resumenTotalPct = resumenPlannedTotalNum > 0 ? resumenActualTotalNum / resumenPlannedTotalNum * 100 : 0;
  const categoryResumenRows = s.expenseCategories.map((c, i) => {
    const actual = periodEntries.filter(e => e.recurring && e.name === c.name).reduce((a, e) => a + e.amount, 0);
    const pct = c.amount > 0 ? actual / c.amount * 100 : 0;
    const paid = actual > 0 && actual >= c.amount;
    const catColor = c.color || PALETTE[i % PALETTE.length];
    return {
      name: c.name,
      fixed: !!c.fixed,
      paid,
      catColor,
      planned_fmt: fmt(c.amount),
      actual_fmt: fmt(actual),
      color: pctColor(pct),
      grad: pctGradient(pct),
      width: Math.min(pct, 100).toFixed(1) + '%'
    };
  });
  const fixedResumenRows = categoryResumenRows.filter(r => r.fixed);
  const variableResumenRows = categoryResumenRows.filter(r => !r.fixed);
  const calendarWeeks = buildCalendarWeeks(s.logYear, s.logMonth);
  const categoryColorByName = {};
  s.expenseCategories.forEach((c, i) => {
    categoryColorByName[c.name] = c.color || PALETTE[i % PALETTE.length];
  });
  const actualByDate = {},
    plannedByDate = {},
    colorsByDate = {};
  s.expenseLog.forEach(e => {
    const ds = entryDateStr(e);
    actualByDate[ds] = (actualByDate[ds] || 0) + e.amount;
    const c = e.recurring ? categoryColorByName[e.name] || NONRECURRING_COLOR : NONRECURRING_COLOR;
    if (!colorsByDate[ds]) colorsByDate[ds] = [];
    if (!colorsByDate[ds].includes(c)) colorsByDate[ds].push(c);
  });
  s.plannedExpenses.forEach(p => {
    plannedByDate[p.date] = (plannedByDate[p.date] || 0) + p.amount;
  });
  const selectedDayActualEntries = s.expenseLog.filter(e => entryDateStr(e) === selectedDate);
  const selectedDayPlannedEntries = s.plannedExpenses.filter(p => p.date === selectedDate);
  const now = new Date();
  const nowMonthPrefix = now.getFullYear() + '-' + pad2(now.getMonth() + 1);
  const homeMonthEntries = s.expenseLog.filter(e => entryDateStr(e).slice(0, 7) === nowMonthPrefix);
  const homeSpentTotal = homeMonthEntries.reduce((a, e) => a + e.amount, 0);
  const homeSpentPct = ctx.totalExpenses > 0 ? homeSpentTotal / ctx.totalExpenses * 100 : 0;
  const nextPayday = s.payFrequency === 'biweekly' ? nextPaydayFrom(s.nextPaydayDate, ctx.today) : null;
  const daysUntilPayday = nextPayday ? Math.round((nextPayday.getTime() - new Date(ctx.today.getFullYear(), ctx.today.getMonth(), ctx.today.getDate()).getTime()) / 86400000) : null;
  const nextPaydayLabel = nextPayday ? MONTH_NAMES[nextPayday.getMonth()] + ' ' + nextPayday.getDate() + ', ' + nextPayday.getFullYear() : '';
  const homeSpentColor = pctColor(homeSpentPct);
  const homeLeftToSpend = ctx.totalExpenses - homeSpentTotal;
  let homeSpendHeadline;
  if (ctx.totalExpenses <= 0) {
    homeSpendHeadline = 'Set your expense budget to track your spending.';
  } else if (homeSpentPct > 100) {
    homeSpendHeadline = "You're over your budget this month.";
  } else if (homeSpentPct >= 80) {
    homeSpendHeadline = "Careful — you're close to your budget.";
  } else {
    homeSpendHeadline = "You're on track this month.";
  }
  const investmentTotal = sum(s.investments);
  const investmentValueTotal = s.investments.reduce((a, i) => a + (i.currentValue || 0), 0);
  const investmentViews = s.investments.map(inv => {
    const lastUpdatedDate = new Date((inv.lastUpdated || todayStr) + 'T00:00:00');
    const monthsSince = (ctx.today.getFullYear() - lastUpdatedDate.getFullYear()) * 12 + (ctx.today.getMonth() - lastUpdatedDate.getMonth());
    const isStale = monthsSince >= 6;
    const gainAmount = (inv.currentValue || 0) - (inv.amount || 0);
    const gainPct = inv.amount > 0 ? gainAmount / inv.amount * 100 : 0;
    const dateLabel = MONTH_NAMES[lastUpdatedDate.getMonth()] + ' ' + lastUpdatedDate.getDate() + ', ' + lastUpdatedDate.getFullYear();
    const agoLabel = monthsSince <= 0 ? (s.language === 'es' ? 'Actualizado hoy' : 'Updated today') : monthsSince === 1 ? (s.language === 'es' ? 'Actualizado hace 1 mes' : 'Updated 1 month ago') : (s.language === 'es' ? 'Actualizado hace ' + monthsSince + ' meses' : 'Updated ' + monthsSince + ' months ago');
    return {
      ...inv,
      monthsSince,
      isStale,
      gainAmount,
      gainPct,
      dateLabel,
      agoLabel
    };
  });
  const investAssignedTotal = s.goals.reduce((a, g) => a + buildGoalView(g, false).monthlyBoosted, 0);
  // Synced funds are excluded: their money is already counted in investAssignedTotal
  // via their linked goal (the fund is the goal's vehicle, not a separate claimant).
  const investParticipatingTotal = s.investments.reduce((a, i) => a + (buildInvestView(i).synced ? 0 : buildInvestView(i).monthly), 0);
  const investLeftover = Math.max(ctx.boostedAvailable - investAssignedTotal - investParticipatingTotal, 0);
  const emergencyGoal = s.goals.find(g => g.name === 'Emergency Fund' || g.name === 'Fondo de emergencia');
  const es = s.language === 'es';
  function openGoal(id) {
    selectGoal(id);
    setShowGoalDetail(true);
    setTab('metas');
  }
  function openInvestment(id) {
    selectInvestment(id);
    setShowInvestDetail(true);
    setTab('invest');
  }
  // Rules engine: reads the current state and returns a prioritized list of
  // plain-language suggestions (general financial rules of thumb, not advice).
  function buildCoachTips() {
    const tips = [];
    const participatingInvs = s.investments.filter(i => buildInvestView(i).mode !== 'off');
    const equityInvs = s.investments.filter(i => guessAssetType(i) === 'equity');
    const efFunded = emergencyGoal && emergencyGoal.current >= emergencyGoal.target && emergencyGoal.target > 0;
    // 1. Safety net first
    if (!emergencyGoal) {
      tips.push({
        id: 'ef-missing',
        title: es ? 'Empieza por tu red de seguridad' : 'Start with a safety net',
        body: es ? 'Antes de invertir, lo común es tener 3–6 meses de gastos guardados para imprevistos.' : 'Before investing, it’s common to keep 3–6 months of expenses saved for surprises.',
        actionLabel: es ? 'Crear fondo' : 'Create fund',
        action: () => {
          setTab('metas');
          setShowEmergencyFundPicker(true);
        }
      });
    } else if (!efFunded && equityInvs.some(i => buildInvestView(i).mode !== 'off')) {
      tips.push({
        id: 'ef-underfunded',
        title: es ? 'Termina tu red de seguridad' : 'Finish your safety net',
        body: es ? 'Tu fondo de emergencia aún no está completo. Suele recomendarse llenarlo antes de arriesgar más en acciones.' : 'Your emergency fund isn’t full yet. It’s usually wise to finish it before putting more into stocks.',
        actionLabel: es ? 'Ver fondo' : 'View fund',
        action: () => openGoal(emergencyGoal.id)
      });
    }
    // 2. Over-allocated (config error)
    if (ctx.manualPercentTotal > 100) {
      tips.push({
        id: 'over-allocated',
        title: es ? 'Tus % pasan de 100' : 'Your % add up past 100',
        body: (es ? 'Los porcentajes manuales suman ' : 'Your manual percentages add up to ') + ctx.manualPercentTotal.toFixed(0) + (es ? '%. Bájalos para que quepan en tu ingreso.' : '%. Lower them so they fit your income.'),
        actionLabel: es ? 'Ir a metas' : 'Go to goals',
        action: () => setTab('metas')
      });
    }
    // 2b. Roth IRA / retirement account with no retirement goal yet
    var retireGoal = s.goals.find(function (g) {
      return g.isRetirementGoal;
    });
    var retireInv = s.investments.find(function (i) {
      return i.isRetirement === true && !i.goalId;
    });
    if (retireInv && !retireGoal && s.goals.length < 6) {
      tips.push({
        id: 'retire-goal',
        title: t('tipRetireTitle'),
        body: t('tipRetireBody'),
        actionLabel: t('retireCreate'),
        action: () => createRetirementGoal(retireInv.id)
      });
    }
    // 3. Horizon / risk mismatch
    var mismatch = s.investments.find(function (i) {
      if (guessAssetType(i) !== 'equity' || !i.goalId) return false;
      var g = s.goals.find(function (x) {
        return x.id === i.goalId;
      });
      if (!g) return false;
      var hz = goalHorizonClass(g, ctx.today);
      return hz === 'short' || hz === 'medium';
    });
    if (mismatch) {
      var mg = s.goals.find(function (x) {
        return x.id === mismatch.goalId;
      });
      tips.push({
        id: 'mismatch-' + mismatch.id,
        title: es ? 'Acciones para una meta cercana' : 'Stocks for a near-term goal',
        body: (es ? '“' + mismatch.name + '” financia “' + mg.name + '”, que es de plazo corto/medio. El dinero que necesitarás pronto suele ir en algo más estable.' : '“' + mismatch.name + '” funds “' + mg.name + '”, a short/medium-term goal. Money you’ll need soon usually goes somewhere steadier.'),
        actionLabel: es ? 'Revisar fondo' : 'Review fund',
        action: () => openInvestment(mismatch.id)
      });
    }
    // 4. Goal with no timeframe
    var noHorizon = s.goals.find(function (g) {
      return !g.customDate && !g.horizon;
    });
    if (noHorizon) {
      tips.push({
        id: 'no-horizon-' + noHorizon.id,
        title: es ? 'Ponle un plazo a tu meta' : 'Give your goal a timeframe',
        body: (es ? 'Define cuándo quieres lograr “' + noHorizon.name + '” para poder sugerirte dónde guardarlo.' : 'Set when you want to reach “' + noHorizon.name + '” so we can suggest where to keep it.'),
        actionLabel: es ? 'Definir' : 'Set it',
        action: () => openGoal(noHorizon.id)
      });
    }
    // 5. Long-term goal not being invested
    var longUninvested = s.goals.find(function (g) {
      if (goalHorizonClass(g, ctx.today) !== 'long') return false;
      return !s.investments.some(function (i) {
        return i.goalId === g.id;
      });
    });
    if (longUninvested && s.investments.length > 0) {
      tips.push({
        id: 'long-uninvested-' + longUninvested.id,
        title: es ? 'Dinero a largo plazo puede crecer más' : 'Long-term money can grow more',
        body: (es ? '“' + longUninvested.name + '” es a largo plazo. A ese plazo, el dinero suele crecer más invertido. Vincula un fondo.' : '“' + longUninvested.name + '” is long term. Over that horizon money usually grows more invested. Link a fund to it.'),
        actionLabel: es ? 'Ver portafolio' : 'Open portfolio',
        action: () => setTab('invest')
      });
    }
    // 6. Investment with no goal (retirement accounts are self-evidently for retirement)
    var unlinked = s.investments.find(function (i) {
      return !i.goalId && !i.isRetirement;
    });
    if (unlinked) {
      tips.push({
        id: 'unlinked-' + unlinked.id,
        title: es ? '¿Para qué es este fondo?' : 'What is this fund for?',
        body: (es ? 'Vincula “' + unlinked.name + '” a una meta para verlo todo junto y recibir mejores sugerencias.' : 'Link “' + unlinked.name + '” to a goal to see it all together and get better tips.'),
        actionLabel: es ? 'Vincular' : 'Link it',
        action: () => openInvestment(unlinked.id)
      });
    }
    // 7. Unassigned monthly money
    var assignedGoals = s.goals.reduce(function (a, g) {
      return a + buildGoalView(g, false).monthlyBoosted;
    }, 0);
    var assignedInvs = s.investments.reduce(function (a, i) {
      var iv = buildInvestView(i);
      return a + (iv.synced ? 0 : iv.monthly);
    }, 0);
    var unassigned = ctx.boostedAvailable - assignedGoals - assignedInvs;
    if (unassigned > 20 && (s.goals.length > 0 || s.investments.length > 0)) {
      tips.push({
        id: 'unassigned',
        title: es ? 'Dinero sin asignar' : 'Unassigned money',
        body: (es ? 'Te quedan ' + fmt(unassigned) + '/mes sin asignar a ninguna meta o fondo. Súbele el % a algo para ponerlo a trabajar.' : fmt(unassigned) + '/mo isn’t assigned to any goal or fund. Raise a share to put it to work.'),
        actionLabel: es ? 'Ir a metas' : 'Go to goals',
        action: () => setTab('metas')
      });
    }
    const dt = s.dismissedTips || {};
    return tips.filter(function (tp) {
      return !dt[tp.id];
    });
  }
  const coachTips = buildCoachTips();
  const selectedInvestment = investmentViews.find(i => i.id === s.selectedInvestmentId) || null;
  const selInvView = selectedInvestment ? buildInvestView(selectedInvestment) : null;
  const investSuggest = selInvView && selInvView.mode !== 'off' ? Math.round(selInvView.monthly) : Math.round(investLeftover);
  const buildInvestTabContent = () => {
    const totalGain = investmentValueTotal - investmentTotal;
    const totalGainPct = investmentTotal > 0 ? totalGain / investmentTotal * 100 : 0;
    const chevron = /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: 15,
      height: 15,
      fill: "none",
      stroke: "#c7c7cc",
      strokeWidth: 2.6,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: {
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9 6l6 6-6 6"
    }));
    const cardStyle = 'position:relative;display:flex;flex-direction:column;justify-content:space-between;width:100%;min-width:0;text-align:left;background:#fff;border:none;border-radius:18px;padding:15px 16px;cursor:pointer;min-height:138px;box-shadow:0 1px 2px rgba(0,0,0,0.05),0 8px 20px rgba(0,0,0,0.04);';
    const efInPortfolio = emergencyGoal && emergencyGoal.apy != null;
    const efMonthlyInterest = efInPortfolio ? (emergencyGoal.current || 0) * (emergencyGoal.apy / 100) / 12 : 0;
    return React.createElement(React.Fragment, null, showInvestDetail ? /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowInvestDetail(false),
      style: css('display:flex;align-items:center;gap:6px;background:none;border:none;color:#1d1d1f;font-size:22px;font-weight:700;letter-spacing:-0.01em;cursor:pointer;padding:0;margin-bottom:16px;')
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: 22,
      height: 22,
      fill: "none",
      stroke: "#1d1d1f",
      strokeWidth: 2.4,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: {
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M15 18l-6-6 6-6"
    })), t('investments')) : /*#__PURE__*/React.createElement("div", {
      style: css('font-size:22px;font-weight:700;letter-spacing:-0.01em;margin-bottom:16px;')
    }, t('investments'), /*#__PURE__*/React.createElement(InfoTip, {
      text: "Track what's growing your money outside your goals. Update the current value every so often — 6 months is a good rhythm."
    })), !showInvestDetail && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: css('background:linear-gradient(135deg,#0071e3,#5ac8fa);border-radius:22px;padding:22px;color:#fff;margin-bottom:18px;box-shadow:0 16px 40px rgba(0,113,227,0.25);')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;align-items:center;gap:14px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('flex:1;min-width:0;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;opacity:0.85;')
    }, s.language === 'es' ? 'Valor total' : 'Total value'), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:34px;font-weight:800;letter-spacing:-0.02em;margin:6px 0 8px;font-variant-numeric:tabular-nums;')
    }, fmt(investmentValueTotal)), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;align-items:center;gap:8px;flex-wrap:wrap;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,0.2);border-radius:999px;padding:4px 10px;font-size:12.5px;font-weight:700;')
    }, totalGain >= 0 ? '▲' : '▼', ' ', fmt(Math.abs(totalGain)), ' (', Math.abs(totalGainPct).toFixed(1), '%)'))), s.investments.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: css('flex:none;width:44%;min-width:0;')
    }, /*#__PURE__*/React.createElement(MultiSparkline, {
      series: investmentViews.map(inv => buildInvestmentSparkline(inv, ctx.today).actual),
      color: "#ffffff",
      height: 72
    })))), s.investments.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff;border-radius:18px;padding:18px;margin-bottom:16px;box-shadow:0 1px 2px rgba(0,0,0,0.05),0 8px 20px rgba(0,0,0,0.04);')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:15px;font-weight:700;color:#1d1d1f;margin-bottom:4px;')
    }, s.language === 'es' ? 'Arma tu portafolio' : 'Build your portfolio'), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12.5px;color:#86868b;line-height:1.4;margin-bottom:14px;')
    }, s.language === 'es' ? 'Un punto de partida simple y muy usado: una mezcla de acciones locales, acciones internacionales y bonos. Elige una categoría para empezar.' : 'A simple, widely-used starting point: a mix of home-market stocks, international stocks, and bonds. Pick a category to start.'), /*#__PURE__*/React.createElement("div", {
      style: css('display:grid;grid-template-columns:repeat(3,1fr);gap:8px;')
    }, [{
      key: 'us',
      label: s.language === 'es' ? 'Acciones EE.UU.' : 'US Stocks'
    }, {
      key: 'intl',
      label: s.language === 'es' ? 'Acciones intl.' : 'Intl. Stocks'
    }, {
      key: 'bonds',
      label: s.language === 'es' ? 'Bonos' : 'Bonds'
    }].map(cat => /*#__PURE__*/React.createElement("button", {
      key: cat.key,
      onClick: () => {
        setNewFundName(cat.label);
        setNewFundRetirement(null);
        setShowAddFundModal(true);
      },
      style: css('background:#eef6ff;border:none;border-radius:12px;padding:12px 6px;font-size:11.5px;font-weight:700;color:#0071e3;cursor:pointer;text-align:center;line-height:1.3;')
    }, cat.label)))), /*#__PURE__*/React.createElement("div", {
      style: css('display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:16px;')
    }, efInPortfolio && /*#__PURE__*/React.createElement("button", {
      key: "ef-mirror",
      onClick: () => {
        setEfApyEdit(String(emergencyGoal.apy));
        setShowEfApyModal(true);
      },
      style: css(cardStyle)
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;align-items:center;gap:8px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 26,
        height: 26,
        borderRadius: 8,
        background: emergencyGoal.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(GoalIconGlyph, {
      icon: emergencyGoal.icon,
      size: 15
    })), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:13px;font-weight:700;color:#1d1d1f;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;')
    }, emergencyGoal.name), chevron), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:22px;font-weight:800;color:#1d1d1f;letter-spacing:-0.01em;font-variant-numeric:tabular-nums;')
    }, fmt(emergencyGoal.current)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: '#0071e3',
        marginTop: 3
      }
    }, emergencyGoal.apy.toFixed(2).replace(/\.?0+$/, ''), s.language === 'es' ? '% anual' : '% APY'), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11px;color:#34c759;font-weight:700;margin-top:2px;')
    }, '+', fmt(efMonthlyInterest), s.language === 'es' ? '/mes en interés' : '/mo interest'))), investmentViews.map(inv => /*#__PURE__*/React.createElement("button", Object.assign({
      key: inv.id,
      ref: pfRevealRef,
      className: 'pf-reveal',
      onClick: cardTapGuard(() => {
        selectInvestment(inv.id);
        setShowInvestDetail(true);
      }),
      style: css(cardStyle)
    }, cardPressProps(() => setDeleteConfirm({
      type: 'fund',
      id: inv.id
    }))), deleteConfirm && deleteConfirm.type === 'fund' && deleteConfirm.id === inv.id && deleteOverlay(() => deleteInvestmentNow(inv.id)), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;align-items:center;gap:8px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:13px;font-weight:700;color:#1d1d1f;line-height:1.25;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;')
    }, inv.name), chevron), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:22px;font-weight:800;color:#1d1d1f;letter-spacing:-0.01em;font-variant-numeric:tabular-nums;')
    }, fmt(inv.currentValue)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: inv.gainAmount >= 0 ? '#34c759' : '#ff3b30',
        marginTop: 3
      }
    }, inv.gainAmount >= 0 ? '+' : '−', fmt(Math.abs(inv.gainAmount)), " (", Math.abs(inv.gainPct).toFixed(1), "%)"), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11px;color:#86868b;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;')
    }, inv.isRetirement ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#0071e3',
        fontWeight: 700
      }
    }, s.language === 'es' ? 'Roth IRA' : 'Roth IRA') : null, inv.isRetirement ? ' · ' : '', inv.agoLabel)))), /*#__PURE__*/React.createElement("button", {
      key: "add-fund",
      onClick: () => {
        setNewFundName('');
        setNewFundRetirement(null);
        setShowAddFundModal(true);
      },
      style: css('display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:transparent;border:2px dashed #d2d2d7;border-radius:18px;padding:14px;cursor:pointer;min-height:138px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 34,
        height: 34,
        borderRadius: '50%',
        background: '#eef6ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        color: '#0071e3',
        fontWeight: 400,
        lineHeight: 1
      }
    }, "+"), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:12.5px;font-weight:700;color:#0071e3;')
    }, s.language === 'es' ? 'Agregar fondo' : 'Add fund'))), !s.seenTabIntro.invest && /*#__PURE__*/React.createElement("div", {
      className: "tip-banner",
      style: css('display:flex;align-items:center;gap:12px;background:#fff;border-radius:16px;padding:16px 18px;margin-top:16px;margin-bottom:16px;box-shadow:0 8px 24px rgba(0,0,0,0.10);')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('flex:1;font-size:13px;color:#6e6e73;font-weight:400;line-height:1.3;')
    }, t('tabIntroInvest')), /*#__PURE__*/React.createElement("button", {
      onClick: () => dismissTabIntro('invest'),
      style: css('flex:none;background:#fff;color:#0071e3;border:1.5px solid #d2d2d7;padding:8px 15px;border-radius:9px;font-size:12.5px;font-weight:700;cursor:pointer;')
    }, t('gotIt')))), showInvestDetail && selectedInvestment && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: css('position:relative;overflow:hidden;background:linear-gradient(135deg,#0071e3,#5ac8fa);border-radius:22px;padding:22px;color:#fff;margin-bottom:14px;box-shadow:0 16px 40px rgba(0,113,227,0.22);')
    }, selectedInvestment.log && selectedInvestment.log.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: css('position:absolute;right:0;bottom:0;width:66%;opacity:0.28;pointer-events:none;')
    }, /*#__PURE__*/React.createElement(GoalSparkline, {
      actual: buildInvestmentSparkline(selectedInvestment, ctx.today).actual,
      color: "#ffffff",
      height: 88,
      showDot: false
    })), /*#__PURE__*/React.createElement("div", {
      style: css('position:relative;z-index:1;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:14px;')
    }, editingInvestmentName ? /*#__PURE__*/React.createElement("input", {
      type: "text",
      autoFocus: true,
      value: selectedInvestment.name,
      onChange: e => updateInvestment(selectedInvestment.id, 'name', e.target.value),
      onBlur: () => setEditingInvestmentName(false),
      onKeyDown: e => {
        if (e.key === 'Enter') setEditingInvestmentName(false);
      },
      style: css('flex:1;min-width:0;font-size:18px;font-weight:800;color:#1d1d1f;border:none;border-radius:9px;padding:7px 10px;background:#fff;')
    }) : /*#__PURE__*/React.createElement("div", {
      onClick: () => setEditingInvestmentName(true),
      style: css('font-size:19px;font-weight:800;color:#fff;cursor:pointer;flex:1;min-width:0;letter-spacing:-0.01em;')
    }, selectedInvestment.name), selectedInvestment.isRetirement != null && /*#__PURE__*/React.createElement("button", {
      onClick: () => setEditingRetirement(true),
      "aria-label": s.language === 'es' ? 'Cambiar tipo de cuenta' : 'Change account type',
      style: css('flex:none;background:rgba(255,255,255,0.2);color:#fff;border:none;font-size:10.5px;font-weight:700;padding:5px 10px;border-radius:999px;white-space:nowrap;cursor:pointer;')
    }, (selectedInvestment.isRetirement ? 'Roth IRA' : (s.language === 'es' ? 'Gravable' : 'Taxable')) + ' ✎')), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;opacity:0.85;')
    }, s.language === 'es' ? 'Valor actual' : 'Current value'), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:34px;font-weight:800;letter-spacing:-0.02em;margin:4px 0 8px;font-variant-numeric:tabular-nums;')
    }, fmt(selectedInvestment.currentValue)), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;align-items:center;gap:8px;flex-wrap:wrap;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,0.2);border-radius:999px;padding:4px 10px;font-size:12.5px;font-weight:700;')
    }, selectedInvestment.gainAmount >= 0 ? '▲' : '▼', ' ', fmt(Math.abs(selectedInvestment.gainAmount)), ' (', Math.abs(selectedInvestment.gainPct).toFixed(1), '%)')))), (selectedInvestment.isRetirement == null || editingRetirement) && /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff;border-radius:18px;padding:16px 18px;margin-bottom:14px;box-shadow:0 1px 2px rgba(0,0,0,0.05),0 8px 20px rgba(0,0,0,0.04);')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:13.5px;font-weight:700;color:#1d1d1f;margin-bottom:10px;')
    }, s.language === 'es' ? '¿Es una cuenta de retiro (Roth IRA)?' : 'Is this a retirement account (Roth IRA)?'), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setInvestmentRetirement(selectedInvestment.id, true);
        setEditingRetirement(false);
      },
      style: css('flex:1;background:' + (selectedInvestment.isRetirement === true ? '#0071e3' : '#f5f5f7') + ';color:' + (selectedInvestment.isRetirement === true ? '#fff' : '#1d1d1f') + ';border:none;border-radius:10px;padding:10px;font-size:13px;font-weight:700;cursor:pointer;')
    }, s.language === 'es' ? 'Sí' : 'Yes'), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setInvestmentRetirement(selectedInvestment.id, false);
        setEditingRetirement(false);
      },
      style: css('flex:1;background:' + (selectedInvestment.isRetirement === false ? '#0071e3' : '#f5f5f7') + ';color:' + (selectedInvestment.isRetirement === false ? '#fff' : '#1d1d1f') + ';border:none;border-radius:10px;padding:10px;font-size:13px;font-weight:700;cursor:pointer;')
    }, s.language === 'es' ? 'No' : 'No'))), (function () {
      var iv = buildInvestView(selectedInvestment);
      var per = s.language === 'es' ? '/mes' : '/mo';
      var modeLabel = iv.mode === 'off' ? t('investShareOff') : iv.mode === 'manual' ? 'Manual' : 'Auto';
      var hzClass = iv.linkedGoal ? goalHorizonClass(iv.linkedGoal, ctx.today) : null;
      var showEquityWarn = iv.assetType === 'equity' && (hzClass === 'short' || hzClass === 'medium');
      return /*#__PURE__*/React.createElement("div", {
        style: css('background:#fff;border-radius:18px;padding:16px 18px;margin-bottom:14px;box-shadow:0 1px 2px rgba(0,0,0,0.05),0 8px 20px rgba(0,0,0,0.04);')
      }, /*#__PURE__*/React.createElement("div", {
        style: css('font-size:12.5px;color:#1d1d1f;font-weight:700;margin-bottom:2px;')
      }, t('assetTypeLabel')), /*#__PURE__*/React.createElement("div", {
        style: css('font-size:11px;color:#86868b;margin-bottom:10px;line-height:1.35;')
      }, t('assetTypeHint')), /*#__PURE__*/React.createElement("div", {
        style: css('display:flex;flex-direction:column;gap:6px;margin-bottom:16px;')
      }, [['equity', 'assetEquity', 'assetEquityDesc'], ['bonds', 'assetBonds', 'assetBondsDesc'], ['other', 'assetOther', 'assetOtherDesc'], [null, 'assetUnsure', 'assetUnsureDesc']].map(function (o) {
        var val = o[0];
        var sel = (selectedInvestment.assetType || null) === val;
        return /*#__PURE__*/React.createElement("button", {
          key: o[1],
          onClick: function () {
            updateInvestment(selectedInvestment.id, 'assetType', val);
          },
          style: {
            display: 'block',
            width: '100%',
            textAlign: 'left',
            border: sel ? '1.5px solid #0071e3' : '1px solid #e5e5ea',
            background: sel ? '#eef6ff' : '#fff',
            borderRadius: 11,
            padding: '9px 12px',
            cursor: 'pointer'
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: css('font-size:13px;font-weight:600;color:#1d1d1f;')
        }, t(o[1])), /*#__PURE__*/React.createElement("span", {
          style: css('font-size:11.5px;color:#86868b;')
        }, "  ·  " + t(o[2])));
      })), /*#__PURE__*/React.createElement("div", {
        style: css('font-size:11.5px;color:#86868b;font-weight:600;margin-bottom:8px;')
      }, t('linkToGoal')), /*#__PURE__*/React.createElement("select", {
        value: selectedInvestment.goalId || '',
        onChange: function (e) {
          var v = e.target.value;
          setInvestmentGoalLink(selectedInvestment.id, v ? isNaN(+v) ? v : +v : null);
        },
        style: css('width:100%;padding:10px 12px;border:1px solid #e5e5ea;border-radius:11px;font-size:13.5px;background:#fbfbfd;margin-bottom:10px;')
      }, /*#__PURE__*/React.createElement("option", {
        value: ''
      }, t('notLinked')), s.goals.map(function (g) {
        return /*#__PURE__*/React.createElement("option", {
          key: g.id,
          value: g.id
        }, g.name);
      })), iv.linkedGoal && /*#__PURE__*/React.createElement("label", {
        style: css('display:flex;align-items:center;gap:8px;font-size:12.5px;color:#1d1d1f;margin-bottom:16px;cursor:pointer;')
      }, /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        checked: !!selectedInvestment.syncWithGoal,
        onChange: function () {
          toggleInvestmentSync(selectedInvestment.id);
        }
      }), t('matchGoalPct')), /*#__PURE__*/React.createElement("div", {
        style: css('display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;padding-top:14px;border-top:1px solid #f5f5f7;')
      }, /*#__PURE__*/React.createElement("label", {
        style: css('font-size:11.5px;color:#86868b;font-weight:600;')
      }, t('investShareTitle')), /*#__PURE__*/React.createElement("button", {
        onClick: function () {
          if (!iv.synced) cycleInvestmentMode(selectedInvestment.id);
        },
        style: css('background:' + (iv.synced ? '#f0f0f2' : '#f5f5f7') + ';border:none;padding:4px 9px;border-radius:8px;font-size:10.5px;font-weight:600;color:' + (iv.synced ? '#86868b' : '#1d1d1f') + ';cursor:' + (iv.synced ? 'default' : 'pointer') + ';')
      }, iv.synced ? modeLabel + ' · ' + (s.language === 'es' ? 'sig. meta' : 'follows goal') : modeLabel)), iv.mode === 'off' ? /*#__PURE__*/React.createElement("div", {
        style: css('font-size:11.5px;color:#86868b;line-height:1.35;')
      }, t('investShareHint')) : iv.mode === 'manual' && !iv.synced ? /*#__PURE__*/React.createElement("div", {
        style: css('display:flex;align-items:baseline;gap:5px;font-size:15px;color:#1d1d1f;font-weight:700;')
      }, /*#__PURE__*/React.createElement("input", {
        type: "number", inputMode: "decimal",
        min: "0",
        max: "100",
        value: selectedInvestment.percent || '',
        onChange: function (e) {
          updateInvestment(selectedInvestment.id, 'percent', e.target.value);
        },
        style: css('width:42px;padding:2px 3px;border:none;border-bottom:1.5px solid #0071e3;font-size:15px;font-weight:700;color:#1d1d1f;background:transparent;text-align:center;')
      }), /*#__PURE__*/React.createElement("span", {
        style: css('font-size:13px;color:#86868b;font-weight:600;')
      }, "% → " + iv.monthlyLabel + per)) : /*#__PURE__*/React.createElement("div", {
        style: css('font-size:15px;font-weight:700;color:#1d1d1f;')
      }, iv.percentLabel, /*#__PURE__*/React.createElement("span", {
        style: css('font-size:13px;color:#86868b;font-weight:600;')
      }, " → " + iv.monthlyLabel + per)), showEquityWarn && /*#__PURE__*/React.createElement("div", {
        style: css('margin-top:12px;padding:10px 12px;background:#fff8ef;border-radius:10px;font-size:11.5px;color:#8a6d3b;line-height:1.4;')
      }, hzClass === 'short' ? t('guideEquityShort') : t('guideEquityMedium')));
    })(), /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff;border-radius:18px;padding:16px 18px;margin-bottom:14px;box-shadow:0 1px 2px rgba(0,0,0,0.05),0 8px 20px rgba(0,0,0,0.04);')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:15px;font-weight:700;color:#1d1d1f;margin-bottom:4px;')
    }, s.language === 'es' ? 'Registrar aporte' : 'Log a contribution'), investSuggest > 0 && /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12px;color:#86868b;margin-bottom:12px;line-height:1.4;')
    }, selInvView && selInvView.mode !== 'off' ? s.language === 'es' ? 'Tu plan sugiere ' + fmt(investSuggest) + '/mes para este fondo.' : 'Your plan suggests ' + fmt(investSuggest) + '/mo for this fund.' : s.language === 'es' ? 'Te quedan ' + fmt(investSuggest) + '/mes después de metas y gastos.' : fmt(investSuggest) + '/mo left over after goals and expenses.'), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: css('position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:16px;color:#86868b;pointer-events:none;')
    }, "$"), /*#__PURE__*/React.createElement("input", {
      type: "number", inputMode: "decimal",
      placeholder: investSuggest > 0 ? String(investSuggest) : '0',
      value: investLogAmount,
      onChange: e => setInvestLogAmount(e.target.value),
      style: css('width:100%;padding:13px 12px 13px 28px;border:1px solid #d2d2d7;border-radius:12px;font-size:16px;font-weight:700;background:#fbfbfd;')
    })), investSuggest > 1 && /*#__PURE__*/React.createElement("button", {
      onClick: () => setInvestLogAmount(String(investSuggest)),
      style: css('background:#eef6ff;border:none;border-radius:9px;padding:8px 12px;font-size:12px;font-weight:700;color:#0071e3;cursor:pointer;margin-bottom:10px;')
    }, (s.language === 'es' ? 'Usar sugerido: ' : 'Use suggested: ') + fmt(investSuggest)), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        const amt = parseFloat(investLogAmount) || 0;
        if (amt > 0) {
          logInvestmentContribution(selectedInvestment.id, amt);
          setInvestLogAmount('');
        }
      },
      style: css('width:100%;background:#0071e3;color:#fff;border:none;padding:13px;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;')
    }, t('log'))), selectedInvestment.log && selectedInvestment.log.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff;border-radius:18px;padding:16px 18px;margin-bottom:14px;box-shadow:0 1px 2px rgba(0,0,0,0.05),0 8px 20px rgba(0,0,0,0.04);')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:15px;font-weight:700;color:#1d1d1f;margin-bottom:8px;')
    }, s.language === 'es' ? 'Aportes registrados' : 'Logged contributions'), selectedInvestment.log.map((entry, idx) => {
      const ed = new Date(entry.date + 'T00:00:00');
      const dateLabel = MONTH_NAMES[ed.getMonth()] + ' ' + ed.getDate() + ', ' + ed.getFullYear();
      return /*#__PURE__*/React.createElement("div", {
        key: entry.id,
        style: css('display:flex;align-items:center;gap:8px;padding:10px 0;' + (idx > 0 ? 'border-top:1px solid #f0f0f2;' : ''))
      }, /*#__PURE__*/React.createElement("span", {
        style: css('flex:1;min-width:0;font-size:12.5px;color:#86868b;')
      }, dateLabel), editingLogId === entry.id ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative',
          width: 100
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: css('position:absolute;left:8px;top:50%;transform:translateY(-50%);font-size:13px;color:#86868b;pointer-events:none;')
      }, "$"), /*#__PURE__*/React.createElement("input", {
        type: "number", inputMode: "decimal",
        autoFocus: true,
        value: editingLogAmount,
        onChange: e => setEditingLogAmount(e.target.value),
        style: css('width:100%;padding:7px 6px 7px 18px;border:1px solid #d2d2d7;border-radius:8px;font-size:13.5px;font-weight:700;background:#fbfbfd;')
      })), /*#__PURE__*/React.createElement("button", {
        onClick: () => {
          editInvestmentContribution(selectedInvestment.id, entry.id, editingLogAmount);
          setEditingLogId(null);
        },
        style: css('flex:none;background:#0071e3;color:#fff;border:none;border-radius:8px;padding:7px 11px;font-size:12.5px;font-weight:700;cursor:pointer;')
      }, t('save')), /*#__PURE__*/React.createElement("button", {
        onClick: () => setEditingLogId(null),
        style: css('flex:none;background:#f5f5f7;color:#86868b;border:none;border-radius:8px;width:30px;height:30px;font-size:16px;cursor:pointer;')
      }, "×")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        style: css('font-size:14px;font-weight:700;color:#1d1d1f;font-variant-numeric:tabular-nums;')
      }, "+", fmt(entry.amount)), /*#__PURE__*/React.createElement("button", {
        onClick: () => {
          setEditingLogId(entry.id);
          setEditingLogAmount(String(entry.amount));
        },
        "aria-label": s.language === 'es' ? 'Editar' : 'Edit',
        style: css('flex:none;background:#f5f5f7;border:none;border-radius:8px;width:30px;height:30px;cursor:pointer;display:flex;align-items:center;justify-content:center;')
      }, /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 24 24",
        width: 14,
        height: 14,
        fill: "none",
        stroke: "#0071e3",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M12 20h9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"
      }))), /*#__PURE__*/React.createElement("button", {
        onClick: () => removeInvestmentContribution(selectedInvestment.id, entry.id),
        "aria-label": s.language === 'es' ? 'Eliminar' : 'Delete',
        style: css('flex:none;background:#fff2ef;color:#ff3b30;border:none;border-radius:8px;width:30px;height:30px;font-size:16px;cursor:pointer;')
      }, "×")));
    })), /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff;border-radius:18px;padding:16px 18px;margin-bottom:14px;box-shadow:0 1px 2px rgba(0,0,0,0.05),0 8px 20px rgba(0,0,0,0.04);')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:15px;font-weight:700;color:#1d1d1f;margin-bottom:4px;')
    }, s.language === 'es' ? 'Actualizar valor actual' : 'Update current value'), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12px;color:#86868b;margin-bottom:12px;line-height:1.4;')
    }, s.language === 'es' ? 'Ajústalo al valor real de la cuenta con intereses.' : 'Set it to the real account value, interest included.'), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "number", inputMode: "decimal",
      placeholder: String(selectedInvestment.currentValue || 0),
      value: investValueEdit,
      onChange: e => setInvestValueEdit(e.target.value),
      style: css('flex:1;min-width:0;padding:11px 12px;border:1px solid #d2d2d7;border-radius:11px;font-size:14.5px;background:#fbfbfd;')
    }), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (investValueEdit !== '') {
          updateInvestment(selectedInvestment.id, 'currentValue', investValueEdit);
          setInvestValueEdit('');
        }
      },
      style: css('flex:none;background:#f5f5f7;color:#1d1d1f;border:none;border-radius:11px;padding:11px 18px;font-size:13.5px;font-weight:700;cursor:pointer;')
    }, t('save'))), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11px;color:#86868b;margin-top:8px;')
    }, selectedInvestment.agoLabel)), /*#__PURE__*/React.createElement("button", {
      onClick: () => removeInvestment(selectedInvestment.id),
      style: css('display:block;margin:4px auto 8px;background:none;border:none;color:#ff3b30;font-size:13px;font-weight:700;cursor:pointer;padding:8px 16px;')
    }, s.language === 'es' ? 'Eliminar fondo' : 'Delete fund')), showAddFundModal && /*#__PURE__*/React.createElement("div", {
      onClick: () => setShowAddFundModal(false),
      className: "pf-overlay-in",
      style: css('position:fixed;inset:0;z-index:120;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;padding:24px;')
    }, /*#__PURE__*/React.createElement("div", {
      onClick: e => e.stopPropagation(),
      className: "pf-modal-in",
      style: css('background:#fff;border-radius:20px;padding:22px;max-width:340px;width:100%;box-shadow:0 30px 70px rgba(0,0,0,0.25);')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:16px;font-weight:700;color:#1d1d1f;margin-bottom:14px;')
    }, s.language === 'es' ? 'Agregar fondo' : 'Add fund'), /*#__PURE__*/React.createElement("input", {
      type: "text",
      autoFocus: true,
      placeholder: s.language === 'es' ? 'Nombre — ej. VTI, S&P 500…' : 'Name — e.g. VTI, S&P 500…',
      value: newFundName,
      onChange: e => setNewFundName(e.target.value),
      style: css('width:100%;padding:12px;border:1px solid #d2d2d7;border-radius:12px;font-size:15px;background:#fbfbfd;margin-bottom:14px;')
    }), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12.5px;font-weight:600;color:#1d1d1f;margin-bottom:8px;')
    }, s.language === 'es' ? '¿Es una cuenta de retiro (Roth IRA)?' : 'Is this a retirement account (Roth IRA)?'), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setNewFundRetirement(true),
      style: css('flex:1;border-radius:10px;padding:10px;font-size:13px;font-weight:700;cursor:pointer;border:' + (newFundRetirement === true ? '2px solid #0071e3' : '1px solid #d2d2d7') + ';background:' + (newFundRetirement === true ? '#eef6ff' : '#fff') + ';color:#1d1d1f;')
    }, s.language === 'es' ? 'Sí' : 'Yes'), /*#__PURE__*/React.createElement("button", {
      onClick: () => setNewFundRetirement(false),
      style: css('flex:1;border-radius:10px;padding:10px;font-size:13px;font-weight:700;cursor:pointer;border:' + (newFundRetirement === false ? '2px solid #0071e3' : '1px solid #d2d2d7') + ';background:' + (newFundRetirement === false ? '#eef6ff' : '#fff') + ';color:#1d1d1f;')
    }, s.language === 'es' ? 'No' : 'No')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowAddFundModal(false),
      style: css('flex:1;background:#f5f5f7;color:#1d1d1f;border:none;border-radius:12px;padding:12px;font-size:14px;font-weight:600;cursor:pointer;')
    }, s.language === 'es' ? 'Cancelar' : 'Cancel'), /*#__PURE__*/React.createElement("button", {
      disabled: !newFundName.trim() || newFundRetirement === null,
      onClick: () => {
        addInvestment(newFundName.trim(), newFundRetirement);
        setShowAddFundModal(false);
        setShowInvestDetail(true);
        dismissTabIntro('invest');
      },
      style: css('flex:1;background:' + (!newFundName.trim() || newFundRetirement === null ? '#c7c7cc' : '#0071e3') + ';color:#fff;border:none;border-radius:12px;padding:12px;font-size:14px;font-weight:600;cursor:' + (!newFundName.trim() || newFundRetirement === null ? 'default' : 'pointer') + ';')
    }, s.language === 'es' ? 'Agregar' : 'Add')))), showEfApyModal && emergencyGoal && /*#__PURE__*/React.createElement("div", {
      onClick: () => setShowEfApyModal(false),
      className: "pf-overlay-in",
      style: css('position:fixed;inset:0;z-index:120;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;padding:24px;')
    }, /*#__PURE__*/React.createElement("div", {
      onClick: e => e.stopPropagation(),
      className: "pf-modal-in",
      style: css('background:#fff;border-radius:20px;padding:22px;max-width:340px;width:100%;box-shadow:0 30px 70px rgba(0,0,0,0.25);')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;align-items:center;gap:10px;margin-bottom:6px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 30,
        height: 30,
        borderRadius: 9,
        background: emergencyGoal.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(GoalIconGlyph, {
      icon: emergencyGoal.icon,
      size: 16
    })), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:16px;font-weight:700;color:#1d1d1f;')
    }, s.language === 'es' ? 'Tasa de interés' : 'Interest rate')), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12.5px;color:#86868b;margin-bottom:14px;line-height:1.4;')
    }, s.language === 'es' ? 'La tasa anual (APY) que te da tu banco por ' + emergencyGoal.name + '.' : 'The annual rate (APY) your bank pays on ' + emergencyGoal.name + '.'), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "number", inputMode: "decimal",
      autoFocus: true,
      placeholder: "4.5",
      value: efApyEdit,
      onChange: e => setEfApyEdit(e.target.value),
      style: css('width:100%;padding:13px 30px 13px 14px;border:1px solid #d2d2d7;border-radius:12px;font-size:18px;font-weight:700;background:#fbfbfd;')
    }), /*#__PURE__*/React.createElement("span", {
      style: css('position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:16px;color:#86868b;font-weight:600;pointer-events:none;')
    }, "%")), /*#__PURE__*/React.createElement("div", {
      style: css('background:#f0fbf3;border-radius:12px;padding:12px 14px;margin-bottom:16px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11px;color:#86868b;font-weight:600;margin-bottom:2px;')
    }, s.language === 'es' ? 'Interés estimado sobre ' + fmt(emergencyGoal.current) : 'Estimated interest on ' + fmt(emergencyGoal.current)), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:15px;font-weight:800;color:#34c759;')
    }, '+', fmt((emergencyGoal.current || 0) * (parseFloat(efApyEdit) || 0) / 1200), s.language === 'es' ? '/mes' : '/mo', '  ·  +', fmt((emergencyGoal.current || 0) * (parseFloat(efApyEdit) || 0) / 100), s.language === 'es' ? '/año' : '/yr')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowEfApyModal(false),
      style: css('flex:1;background:#f5f5f7;color:#1d1d1f;border:none;border-radius:12px;padding:12px;font-size:14px;font-weight:600;cursor:pointer;')
    }, s.language === 'es' ? 'Cancelar' : 'Cancel'), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        const v = parseFloat(efApyEdit);
        updateGoal(emergencyGoal.id, 'apy', v > 0 ? v : null);
        setShowEfApyModal(false);
      },
      style: css('flex:1;background:#0071e3;color:#fff;border:none;border-radius:12px;padding:12px;font-size:14px;font-weight:600;cursor:pointer;')
    }, t('save'))), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setShowEfApyModal(false);
        setTab('metas');
        selectGoal(emergencyGoal.id);
        setShowGoalDetail(true);
      },
      style: css('display:block;width:100%;text-align:center;background:none;border:none;color:#0071e3;font-size:13px;font-weight:700;cursor:pointer;padding:4px;')
    }, s.language === 'es' ? 'Ver en Metas →' : 'View in Goals →'))));
  };
  const recurringCategoryOptions = s.expenseCategories.map(c => c.name);
  const effectiveLogCategory = logCategory || recurringCategoryOptions[0] || '';
  const currentKey = currentMonthKey();
  const goalOptionsFull = s.goals.map(g => ({
    id: g.id,
    name: g.name
  }));

  /* ================= RENDER ================= */
  // Tapping a bottom-nav / sidebar item always lands on that section's root:
  // close any open detail or sub-view so you go "back to the start" of it.
  const goToTabRoot = name => {
    setShowGoalDetail(false);
    setShowInvestDetail(false);
    setAllocatingLeftover(false);
    setEditingRetirement(false);
    setSettingsView('menu');
    setTab(name);
  };
  const TabButton = ({
    name,
    label,
    icon
  }) => {
    const active = s.tab === name;
    const color = active ? '#0071e3' : '#86868b';
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => goToTabRoot(name),
      style: css('flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;gap:3px;padding:4px 2px 6px;cursor:pointer;color:' + color + ';')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('display:flex;align-items:center;justify-content:center;width:44px;height:26px;border-radius:13px;background:' + (active ? 'rgba(0,113,227,0.12)' : 'transparent') + ';transition:background 0.18s ease;')
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "21",
      height: "21",
      fill: "none",
      stroke: color,
      strokeWidth: active ? "2.3" : "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, icon(color))), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:10px;font-weight:' + (active ? '700' : '600') + ';')
    }, label));
  };
  const SidebarButton = ({
    name,
    label,
    icon
  }) => {
    const active = s.tab === name;
    const color = active ? '#0071e3' : '#6e6e73';
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => goToTabRoot(name),
      style: {
        width: '100%',
        background: active ? '#eef6ff' : 'none',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        borderRadius: 10,
        cursor: 'pointer',
        color,
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "19",
      height: "19",
      fill: "none",
      stroke: color,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: {
        flex: 'none'
      }
    }, icon(color)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: active ? 700 : 600
      }
    }, label));
  };
  if (locked && lockCfg && lockCfg.pinHash) {
    return /*#__PURE__*/React.createElement(LockScreen, {
      lang: s.language,
      config: lockCfg,
      onUnlock: function () {
        try { sessionStorage.setItem('pf_unlocked', '1'); } catch (e) {}
        setLocked(false);
      },
      onSignOut: function () {
        try { sessionStorage.removeItem('pf_unlocked'); } catch (e) {}
        signOutUser();
      }
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    style: css('min-height:100vh;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display",Inter,system-ui,sans-serif;color:#1d1d1f;overflow-x:hidden;')
  }, showPaycheckModal && (function () {
    var es = s.language === 'es';
    var closeIt = function () { setShowPaycheckModal(false); };
    var isPay = depositType === 'paycheck';
    var pickPaycheck = function () { setDepositType('paycheck'); setPaycheckAmount(String(s.income || '')); };
    var pickOther = function () { setDepositType('other'); setPaycheckAmount(''); };
    var submit = function () { var a = parseFloat(paycheckAmount) || 0; if (a > 0) { logDeposit(a, isPay); closeIt(); } };
    var chip = function (active, label, sub, onClick) {
      return /*#__PURE__*/React.createElement('button', {
        onClick: onClick,
        style: {
          flex: 1, textAlign: 'left', cursor: 'pointer',
          background: active ? '#eef6ff' : '#f5f5f7',
          border: active ? '2px solid #0071e3' : '2px solid transparent',
          borderRadius: 13, padding: '12px 13px'
        }
      }, /*#__PURE__*/React.createElement('div', {
        style: { fontSize: 14, fontWeight: 700, color: active ? '#0071e3' : '#1d1d1f' }
      }, label), /*#__PURE__*/React.createElement('div', {
        style: css('font-size:11px;color:#86868b;margin-top:2px;')
      }, sub));
    };
    return /*#__PURE__*/React.createElement('div', {
      onClick: closeIt,
      className: 'pf-overlay-in',
      style: Object.assign(css('position:fixed;top:0;left:0;right:0;z-index:120;background:rgba(0,0,0,0.45);display:flex;align-items:flex-end;justify-content:center;padding:0;'), { bottom: keyboardInset, transition: 'bottom 0.18s ease-out' })
    }, /*#__PURE__*/React.createElement('div', {
      onClick: function (e) { e.stopPropagation(); },
      className: 'pf-modal-in',
      style: css('background:#fff;border-radius:22px 22px 0 0;padding:22px 20px calc(24px + env(safe-area-inset-bottom));width:100%;max-width:480px;box-sizing:border-box;box-shadow:0 -10px 40px rgba(0,0,0,0.18);')
    }, /*#__PURE__*/React.createElement('div', {
      style: css('font-size:18px;font-weight:800;letter-spacing:-0.01em;margin-bottom:4px;')
    }, es ? 'Registrar depósito' : 'Log deposit'), /*#__PURE__*/React.createElement('div', {
      style: css('font-size:12.5px;color:#86868b;margin-bottom:14px;')
    }, es ? '¿Qué recibiste hoy?' : 'What did you receive today?'), /*#__PURE__*/React.createElement('div', {
      style: { display: 'flex', gap: 8, marginBottom: 14 }
    }, chip(isPay, es ? 'Mi pago' : 'My paycheck', es ? 'Monto fijo' : 'Fixed amount', pickPaycheck), chip(!isPay, es ? 'Otro monto' : 'Other amount', es ? 'Regalo, extra…' : 'Gift, extra…', pickOther)), /*#__PURE__*/React.createElement('div', {
      style: { position: 'relative', marginBottom: 16 }
    }, /*#__PURE__*/React.createElement('span', {
      style: css('position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:19px;color:#86868b;pointer-events:none;')
    }, '$'), /*#__PURE__*/React.createElement('input', {
      type: 'number', inputMode: 'decimal', autoFocus: true, placeholder: '0',
      value: paycheckAmount,
      onChange: function (e) { setPaycheckAmount(e.target.value); },
      onKeyDown: function (e) { if (e.key === 'Enter') submit(); },
      style: css('width:100%;padding:14px 14px 14px 30px;border:1px solid #d2d2d7;border-radius:13px;font-size:20px;font-weight:700;background:#fbfbfd;box-sizing:border-box;')
    })), /*#__PURE__*/React.createElement('div', {
      style: { display: 'flex', gap: 10 }
    }, /*#__PURE__*/React.createElement('button', {
      onClick: closeIt,
      style: css('flex:1;background:#f5f5f7;color:#1d1d1f;border:none;border-radius:13px;padding:14px;font-size:15px;font-weight:600;cursor:pointer;')
    }, es ? 'Cancelar' : 'Cancel'), /*#__PURE__*/React.createElement('button', {
      onClick: submit,
      style: css('flex:2;background:#0071e3;color:#fff;border:none;border-radius:13px;padding:14px;font-size:15px;font-weight:700;cursor:pointer;')
    }, es ? 'Registrar' : 'Log it')), /*#__PURE__*/React.createElement('button', {
      onClick: function () { closeIt(); setTab('incomeHistory'); },
      style: css('display:block;width:100%;text-align:center;background:none;border:none;color:#0071e3;font-size:13.5px;font-weight:700;cursor:pointer;margin-top:14px;padding:6px;')
    }, es ? 'Ver historial de depósitos' : 'View deposit history')));
  })(), showExpenseModal && (function () {
    var es = s.language === 'es';
    var closeIt = function () { setShowExpenseModal(false); };
    return /*#__PURE__*/React.createElement('div', {
      onClick: closeIt,
      className: 'pf-overlay-in',
      style: Object.assign(css('position:fixed;top:0;left:0;right:0;z-index:120;background:rgba(0,0,0,0.45);display:flex;align-items:flex-end;justify-content:center;padding:0;'), { bottom: keyboardInset, transition: 'bottom 0.18s ease-out' })
    }, /*#__PURE__*/React.createElement('div', {
      onClick: function (e) { e.stopPropagation(); },
      className: 'pf-modal-in',
      style: css('background:#fff;border-radius:22px 22px 0 0;padding:22px 20px calc(24px + env(safe-area-inset-bottom));width:100%;max-width:480px;box-sizing:border-box;box-shadow:0 -10px 40px rgba(0,0,0,0.18);')
    }, /*#__PURE__*/React.createElement('div', {
      style: css('display:flex;align-items:baseline;justify-content:space-between;margin-bottom:16px;')
    }, /*#__PURE__*/React.createElement('div', {
      style: css('font-size:18px;font-weight:800;letter-spacing:-0.01em;')
    }, es ? 'Registrar gasto' : 'Log expense'), /*#__PURE__*/React.createElement('div', {
      style: css('font-size:12px;color:#86868b;font-weight:600;')
    }, es ? 'Hoy' : 'Today')), /*#__PURE__*/React.createElement('div', {
      style: css('display:flex;gap:8px;margin-bottom:10px;')
    }, /*#__PURE__*/React.createElement('button', {
      onClick: function () { setLogType('recurring'); fillRecurringAmount(logCategory || (s.expenseCategories[0] && s.expenseCategories[0].name) || '', s); },
      style: { flex: 1, background: logType === 'recurring' ? '#0071e3' : '#f5f5f7', color: logType === 'recurring' ? '#fff' : '#1d1d1f', border: 'none', padding: 11, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }
    }, es ? 'Recurrente' : 'Recurring'), /*#__PURE__*/React.createElement('button', {
      onClick: function () { setLogType('nonrecurring'); },
      style: { flex: 1, background: logType !== 'recurring' ? '#0071e3' : '#f5f5f7', color: logType !== 'recurring' ? '#fff' : '#1d1d1f', border: 'none', padding: 11, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }
    }, es ? 'No recurrente' : 'Non-recurring')), logType === 'recurring' ? /*#__PURE__*/React.createElement('select', {
      value: effectiveLogCategory,
      onChange: function (e) { setLogCategory(e.target.value); fillRecurringAmount(e.target.value, s); },
      style: css('width:100%;padding:11px 12px;border:1px solid #e5e5ea;border-radius:11px;font-size:13.5px;background:#fbfbfd;margin-bottom:10px;box-sizing:border-box;')
    }, recurringCategoryOptions.map(function (n, i) { return /*#__PURE__*/React.createElement('option', { key: i, value: n }, n); })) : /*#__PURE__*/React.createElement('input', {
      type: 'text',
      placeholder: es ? 'Nombre del gasto (ej. reparación, regalo)' : 'Expense name (e.g. repair, gift)',
      value: logName,
      onChange: function (e) { setLogName(e.target.value); },
      style: css('width:100%;padding:11px 12px;border:1px solid #e5e5ea;border-radius:11px;font-size:13.5px;background:#fbfbfd;margin-bottom:10px;box-sizing:border-box;')
    }), /*#__PURE__*/React.createElement('div', {
      style: { position: 'relative', marginBottom: 16 }
    }, /*#__PURE__*/React.createElement('span', {
      style: css('position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:17px;color:#86868b;pointer-events:none;')
    }, '$'), /*#__PURE__*/React.createElement('input', {
      type: 'number', inputMode: 'decimal', autoFocus: true,
      placeholder: es ? 'Monto gastado' : 'Amount spent',
      value: logAmount,
      onChange: function (e) { setLogAmount(e.target.value); },
      onKeyDown: function (e) { if (e.key === 'Enter') { addLogEntryToday(); closeIt(); } },
      style: css('width:100%;padding:14px 14px 14px 30px;border:1px solid #d2d2d7;border-radius:13px;font-size:18px;font-weight:700;background:#fbfbfd;box-sizing:border-box;')
    })), /*#__PURE__*/React.createElement('div', {
      style: { display: 'flex', gap: 10 }
    }, /*#__PURE__*/React.createElement('button', {
      onClick: closeIt,
      style: css('flex:1;background:#f5f5f7;color:#1d1d1f;border:none;border-radius:13px;padding:14px;font-size:15px;font-weight:600;cursor:pointer;')
    }, es ? 'Cancelar' : 'Cancel'), /*#__PURE__*/React.createElement('button', {
      onClick: function () { addLogEntryToday(); closeIt(); },
      style: css('flex:2;background:#0071e3;color:#fff;border:none;border-radius:13px;padding:14px;font-size:15px;font-weight:700;cursor:pointer;')
    }, es ? 'Registrar' : 'Log it'))));
  })(), confirmDialog && /*#__PURE__*/React.createElement("div", {
    className: "pf-overlay-in",
    style: css('position:fixed;inset:0;z-index:110;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;padding:24px;')
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-modal-in",
    style: css('background:#fff;border-radius:18px;padding:22px;max-width:340px;width:100%;box-shadow:0 30px 70px rgba(0,0,0,0.25);')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:14.5px;color:#1d1d1f;line-height:1.5;margin-bottom:20px;')
  }, confirmDialog.message), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setConfirmDialog(null),
    style: css('flex:1;background:#f5f5f7;color:#1d1d1f;border:none;padding:11px;border-radius:10px;font-size:13.5px;font-weight:600;cursor:pointer;')
  }, s.language === 'es' ? 'Cancelar' : 'Cancel'), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const fn = confirmDialog.onYes;
      setConfirmDialog(null);
      fn();
    },
    style: css('flex:1;background:#ff3b30;color:#fff;border:none;padding:11px;border-radius:10px;font-size:13.5px;font-weight:600;cursor:pointer;')
  }, s.language === 'es' ? 'Sí, continuar' : 'Yes, continue')))), quickAddGoalId && (function () { var qa = s.goals.find(function (g) { return g.id === quickAddGoalId; }); if (!qa) return null; var qaMonthly = buildGoalView(qa, false).monthlyBoosted; return React.createElement('div', { onClick: function () { setQuickAddGoalId(null); }, className: 'pf-overlay-in', style: css('position:fixed;inset:0;z-index:120;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;padding:24px;') }, React.createElement('div', { onClick: function (e) { e.stopPropagation(); }, className: 'pf-modal-in', style: css('background:#fff;border-radius:20px;padding:22px;max-width:340px;width:100%;box-shadow:0 30px 70px rgba(0,0,0,0.25);') }, React.createElement('div', { style: css('display:flex;align-items:center;gap:12px;margin-bottom:16px;') }, React.createElement('div', { style: { width: 40, height: 40, borderRadius: 11, background: qa.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' } }, React.createElement(GoalIconGlyph, { icon: qa.icon, size: 20 })), React.createElement('div', null, React.createElement('div', { style: css('font-size:16px;font-weight:700;') }, s.language === 'es' ? 'Agregar ahorro' : 'Add savings'), React.createElement('div', { style: css('font-size:12.5px;color:#86868b;') }, qa.name))), React.createElement('div', { style: { position: 'relative', marginBottom: 12 } }, React.createElement('span', { style: css('position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:17px;color:#86868b;pointer-events:none;') }, '$'), React.createElement('input', { type: 'number', inputMode: 'decimal', autoFocus: true, placeholder: '0', value: depositAmount, onChange: function (e) { setDepositAmount(e.target.value); }, onKeyDown: function (e) { if (e.key === 'Enter') { registerDeposit(quickAddGoalId); setQuickAddGoalId(null); } }, style: css('width:100%;padding:13px 12px 13px 26px;border:1px solid #d2d2d7;border-radius:12px;font-size:18px;font-weight:700;background:#fbfbfd;') })), qaMonthly > 0 && React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 16 } }, React.createElement('button', { onClick: function () { setDepositAmount(String(Math.round(qaMonthly))); }, style: css('flex:1;background:#f5f5f7;border:none;border-radius:10px;padding:9px;font-size:12.5px;font-weight:600;color:#1d1d1f;cursor:pointer;') }, (s.language === 'es' ? 'Este mes: ' : 'This month: ') + fmt(qaMonthly)), React.createElement('button', { onClick: function () { setDepositAmount(String(Math.round(qaMonthly / 2))); }, style: css('flex:none;background:#f5f5f7;border:none;border-radius:10px;padding:9px 12px;font-size:12.5px;font-weight:600;color:#1d1d1f;cursor:pointer;') }, s.language === 'es' ? 'Mitad' : 'Half')), React.createElement('div', { style: { display: 'flex', gap: 10 } }, React.createElement('button', { onClick: function () { setQuickAddGoalId(null); setDepositAmount(''); }, style: css('flex:1;background:#f5f5f7;color:#1d1d1f;border:none;border-radius:12px;padding:12px;font-size:14px;font-weight:600;cursor:pointer;') }, s.language === 'es' ? 'Cancelar' : 'Cancel'), React.createElement('button', { onClick: function () { registerDeposit(quickAddGoalId); setQuickAddGoalId(null); }, style: css('flex:1;background:#0071e3;color:#fff;border:none;border-radius:12px;padding:12px;font-size:14px;font-weight:600;cursor:pointer;') }, s.language === 'es' ? 'Agregar' : 'Add')))); })(), !s.hasSeenWelcome && React.createElement('div', { style: css('position:fixed;inset:0;z-index:100;background:#fff;display:flex;flex-direction:column;overflow-y:auto;padding:calc(env(safe-area-inset-top) + 20px) 24px calc(env(safe-area-inset-bottom) + 28px);') }, React.createElement('div', { style: css('width:100%;max-width:420px;margin:0 auto;flex:1;display:flex;flex-direction:column;') }, React.createElement('div', { style: css('display:flex;justify-content:flex-end;margin-bottom:2px;') }, React.createElement('button', { onClick: function(){ setLanguage(s.language==='es'?'en':'es'); }, style: css('background:none;border:none;color:#86868b;font-size:12.5px;font-weight:700;cursor:pointer;padding:4px;') }, s.language==='es'?'EN':'ES')), (welcomeStep < 3) && React.createElement('div', { style: css('margin-bottom:8px;') }, React.createElement('div', { style: css('text-align:center;font-size:12px;color:#86868b;font-weight:600;margin-bottom:8px;') }, welcomeStep===0 ? (s.language==='es'?'Paso 1':'Step 1') : welcomeStep===1 ? (s.language==='es'?'Paso 2 de 3':'Step 2 of 3') : (s.language==='es'?'Paso 3 de 3':'Step 3 of 3')), React.createElement('div', { style: css('display:flex;gap:8px;') }, [0,1,2].map(function(idx){ return React.createElement('div', { key: idx, style: { flex:1, height:4, borderRadius:2, background: idx<=welcomeStep ? '#1d1d1f' : '#e5e5ea' } }); }))), welcomeStep===0 ? React.createElement(React.Fragment, null, React.createElement('div', { style: { height:'7vh' } }), React.createElement('div', { style: css('font-size:30px;font-weight:800;letter-spacing:-0.02em;color:#111;margin-bottom:26px;') }, s.language==='es'?'Empecemos':"Let's get started"), React.createElement('div', { style: css('font-size:14px;color:#1d1d1f;font-weight:500;margin-bottom:14px;') }, t('profileQTitle')), ['allowance','salary','freelance'].map(function(pp){ return React.createElement('button', { key:pp, onClick: function(){ setIncomeProfile(pp); }, style: { display:'block', width:'100%', textAlign:'left', padding:'14px 16px', borderRadius:12, border: s.incomeProfile===pp ? '2px solid #2f6bff' : '1px solid #d2d2d7', background: s.incomeProfile===pp ? '#eef4ff' : '#fff', fontSize:14, fontWeight:500, color:'#1d1d1f', cursor:'pointer', marginBottom:10 } }, pp==='allowance'?t('profileAllowance'):pp==='salary'?t('profileSalary'):t('profileFreelance')); }), (function(next){ return React.createElement('button', { onClick: function(){ setWelcomeStep(next); }, style: css('width:100%;padding:14px;background:#2f6bff;color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;margin-top:6px;') }, t('continueLabel')); })(1), sbClient && React.createElement('button', { onClick: function(){ setShowLoginFromWelcome(true); }, style: css('display:block;width:100%;text-align:center;background:none;border:none;color:#6e6e73;font-size:14px;font-weight:600;cursor:pointer;margin-top:16px;padding:0;') }, s.language==='es'?'¿Ya tienes cuenta?':'Already have an account?') ) : welcomeStep===1 ? React.createElement(React.Fragment, null, React.createElement('div', { style: { height:'7vh' } }), React.createElement('div', { style: css('font-size:30px;font-weight:800;letter-spacing:-0.02em;color:#111;margin-bottom:26px;') }, s.language==='es'?'Empecemos':"Let's get started"), React.createElement('div', { style: css('font-size:14px;color:#1d1d1f;font-weight:500;margin-bottom:14px;') }, t('howOldQ')), React.createElement('input', { type:'number', inputMode:'numeric', autoFocus:true, placeholder: t('yourAge'), value: s.studentAge || '', onChange: function(e){ setStudentAge(parseInt(e.target.value,10)||null); }, style: css('width:100%;padding:14px 16px;border:1px solid #d2d2d7;border-radius:12px;font-size:15px;background:#fff;margin-bottom:16px;') }), (function(next){ return React.createElement('button', { onClick: function(){ setWelcomeStep(next); }, style: css('width:100%;padding:14px;background:#2f6bff;color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;margin-top:6px;') }, t('continueLabel')); })(2), sbClient && React.createElement('button', { onClick: function(){ setShowLoginFromWelcome(true); }, style: css('display:block;width:100%;text-align:center;background:none;border:none;color:#6e6e73;font-size:14px;font-weight:600;cursor:pointer;margin-top:16px;padding:0;') }, s.language==='es'?'¿Ya tienes cuenta?':'Already have an account?') ) : welcomeStep===2 ? React.createElement(React.Fragment, null, React.createElement('div', { style: { height:'7vh' } }), React.createElement('div', { style: css('font-size:30px;font-weight:800;letter-spacing:-0.02em;color:#111;margin-bottom:26px;') }, s.language==='es'?'Empecemos':"Let's get started"), React.createElement('div', { style: css('font-size:14px;color:#1d1d1f;font-weight:500;margin-bottom:14px;') }, s.language==='es'?'¿Inviertes?':'Do you invest?'), [ { k:true, label: s.language==='es'?'Sí, mis padres y yo invertimos juntos':'Yes, my parents and I invest together' }, { k:'own', label: s.language==='es'?'Sí, tengo mi propia cuenta':'Yes, I have my own account' }, { k:false, label: t('investNo') } ].map(function(opt,ix){ return React.createElement('button', { key:ix, onClick: function(){ setInvestsWithParents(opt.k); }, style: { display:'block', width:'100%', textAlign:'left', padding:'14px 16px', borderRadius:12, border: s.investsWithParents===opt.k ? '2px solid #2f6bff' : '1px solid #d2d2d7', background: s.investsWithParents===opt.k ? '#eef4ff' : '#fff', fontSize:14, fontWeight:500, color:'#1d1d1f', cursor:'pointer', marginBottom:10 } }, opt.label); }), (function(next){ return React.createElement('button', { onClick: function(){ setWelcomeStep(next); }, style: css('width:100%;padding:14px;background:#2f6bff;color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;margin-top:6px;') }, t('continueLabel')); })(3), sbClient && React.createElement('button', { onClick: function(){ setShowLoginFromWelcome(true); }, style: css('display:block;width:100%;text-align:center;background:none;border:none;color:#6e6e73;font-size:14px;font-weight:600;cursor:pointer;margin-top:16px;padding:0;') }, s.language==='es'?'¿Ya tienes cuenta?':'Already have an account?') ) : React.createElement(React.Fragment, null, React.createElement('div', { style: { height:'8vh' } }), React.createElement('div', { style: css('font-size:30px;font-weight:800;letter-spacing:-0.02em;color:#111;line-height:1.15;margin-bottom:26px;') }, s.language==='es'?'¡Últimos pasos! Es hora de configurar tu cuenta':"Last steps! It's time to set up your account"), [ { tt: s.language==='es'?'Ingreso':'Income', dd: s.language==='es'?'Dinos cuánto y cada cuánto te pagan.':'Tell us how much and how often you get paid.', tb:'inicio' }, { tt: s.language==='es'?'Plan de gastos':'Expenses Budget Plan', dd: s.language==='es'?'Define tu plan de gasto del mes.':'Set your spending plan for the month.', tb:'budgetPlan' }, { tt: s.language==='es'?'Metas':'Goals', dd: s.language==='es'?'Agrega metas que quieras lograr.':'Add goals you want to achieve.', tb:'metas' } ].map(function(card,ci){ return React.createElement('button', { key:ci, onClick: function(){ dismissWelcome(); setTab(card.tb); }, style: css('display:block;width:100%;text-align:left;background:#fff;border:1px solid #e5e5ea;border-radius:14px;padding:16px;margin-bottom:12px;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,0.05);') }, React.createElement('div', { style: css('font-size:15px;font-weight:700;color:#1d1d1f;margin-bottom:3px;') }, card.tt), React.createElement('div', { style: css('font-size:12.5px;color:#86868b;') }, card.dd)); }), React.createElement('button', { onClick: function(){ dismissWelcome(); }, style: css('display:block;width:100%;text-align:center;background:none;border:none;color:#2f6bff;font-size:14px;font-weight:700;cursor:pointer;margin-top:8px;padding:0;') }, s.language==='es'?'Hacerlo después':'Do it later') ))), /*#__PURE__*/React.createElement("div", {
    style: css('padding-bottom:' + (isDesktop ? '20' : '96') + 'px;display:flex;')
  }, isDesktop && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      width: 220,
      minHeight: '100vh',
      padding: 'calc(20px + env(safe-area-inset-top)) 10px 20px 16px',
      borderRight: '1px solid rgba(0,0,0,0.06)',
      position: 'sticky',
      top: 0,
      alignSelf: 'flex-start',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:16px;font-weight:800;letter-spacing:-0.01em;color:#1d1d1f;padding:6px 14px 20px;')
  }, s.language === 'es' ? 'Mis Metas' : 'My Goals'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement(SidebarButton, {
    name: "inicio",
    label: t('tabHome'),
    icon: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 11.5L12 4l9 7.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5.5 10v9a1 1 0 0 0 1 1h4v-6h3v6h4a1 1 0 0 0 1-1v-9"
    }))
  }), /*#__PURE__*/React.createElement(SidebarButton, {
    name: "metas",
    label: t('tabGoals'),
    icon: color => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "4.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "0.6",
      fill: color
    }))
  }), /*#__PURE__*/React.createElement(SidebarButton, {
    name: "gastos",
    label: t('tabExpenses'),
    icon: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "6",
      width: "18",
      height: "13",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 10h18"
    }))
  }), /*#__PURE__*/React.createElement(SidebarButton, {
    name: "extra",
    label: t('tabExtra'),
    icon: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 17l6-6 4 4 8-8"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M15 7h6v6"
    }))
  }), !hideInvestTab && /*#__PURE__*/React.createElement(SidebarButton, {
    name: "invest",
    label: t('tabInvest'),
    icon: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 3v18h18"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7 15l4-5 3 3 5-7"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(0,0,0,0.06)',
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement(SidebarButton, {
    name: "settings",
    label: t('settings'),
    icon: color => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, storageWarning && /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff2ef;color:#ff3b30;font-size:12.5px;padding:8px 20px;')
  }, storageWarning), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: '0 auto',
      padding: isDesktop ? '20px 24px 0' : 'calc(20px + env(safe-area-inset-top)) 20px 0'
    }
  }, s.tab === 'inicio' && /*#__PURE__*/React.createElement(React.Fragment, null, !isDesktop && /*#__PURE__*/React.createElement("div", {
    style: css('position:fixed;top:0;left:0;right:0;bottom:0;z-index:0;background:linear-gradient(180deg,' + (homeSpentPct >= 100 ? '#ff3b30,#ff9500' : '#0071e3,#5ac8fa') + ');')
  }), /*#__PURE__*/React.createElement("div", {
    ref: homeHeroRef,
    style: css('position:relative;color:#fff;' + (isDesktop ? 'background:linear-gradient(135deg,' + (homeSpentPct >= 100 ? '#ff3b30,#ff9500' : '#0071e3,#5ac8fa') + ');border-radius:20px;padding:20px;margin-bottom:16px;box-shadow:0 14px 34px rgba(0,113,227,0.22);' : 'position:fixed;top:0;left:0;right:0;z-index:1;padding:calc(env(safe-area-inset-top) + 58px) 20px 48px;'))
  }, !isDesktop && /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('settings'),
    "aria-label": "Settings",
    style: css('position:absolute;top:calc(env(safe-area-inset-top) + 14px);right:16px;background:rgba(255,255,255,0.2);border:none;width:34px;height:34px;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2;')
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "#fff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", { cx: "12", cy: "12", r: "3" }), /*#__PURE__*/React.createElement("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" }))), /*#__PURE__*/React.createElement("div", {
    style: css('background:rgba(255,255,255,0.14);border-radius:20px;padding:18px 18px 20px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12px;font-weight:600;opacity:0.85;text-transform:uppercase;letter-spacing:0.03em;')
  }, t('spentSoFar')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      fontWeight: 800,
      letterSpacing: '-0.02em',
      marginTop: 4
    }
  }, fmt(homeSpentTotal)), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:center;gap:10px;margin-top:14px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('flex:1;height:8px;background:rgba(255,255,255,0.3);border-radius:4px;overflow:hidden;')
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: Math.min(homeSpentPct, 100).toFixed(1) + '%',
      height: '100%',
      background: '#fff',
      borderRadius: 4
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      flex: 'none'
    }
  }, Math.round(Math.min(homeSpentPct, 999)), "%")), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11.5px;opacity:0.85;margin-top:6px;')
  }, "of ", fmt(ctx.totalExpenses), " budget"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      marginTop: 12
    }
  }, homeSpendHeadline)), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;margin-top:16px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => { setDepositType('paycheck'); setPaycheckAmount(String(s.income || '')); setShowPaycheckModal(true); },
    style: css('flex:1;display:flex;align-items:center;justify-content:center;gap:7px;background:rgba(255,255,255,0.2);color:#fff;border:none;border-radius:13px;padding:15px 12px;font-size:13.5px;font-weight:700;cursor:pointer;')
  }, /*#__PURE__*/React.createElement("svg", { viewBox: "0 0 84 73", width: 16, height: 14, fill: "none", stroke: "#fff", strokeLinecap: "round", strokeLinejoin: "round" }, /*#__PURE__*/React.createElement("path", { strokeWidth: 6, d: "M57 54.864h24V14.11L67 3H3v51.864h27" }), /*#__PURE__*/React.createElement("path", { strokeWidth: 6, d: "M67 3v16h14M18 39h42M33.5 25H60" }), /*#__PURE__*/React.createElement("path", { strokeWidth: 3, d: "M22.5 31.318V19.046M18 27.909C18 30.636 20.7 32 22.5 32s4.5-1.364 4.5-4.09c0-2.728-2.7-3.41-4.5-3.41s-4.5-.682-4.5-3.41c0-2.726 2.7-4.09 4.5-4.09s4.5 1.364 4.5 4.09" }), /*#__PURE__*/React.createElement("path", { strokeWidth: 4, d: "M44 49v22m9-9-9 9-9-9" })), s.language === 'es' ? 'Registrar depósito' : 'Log deposit'), /*#__PURE__*/React.createElement("button", {
    onClick: () => { setLogType('recurring'); fillRecurringAmount(logCategory || (s.expenseCategories[0] && s.expenseCategories[0].name) || '', s); setShowExpenseModal(true); },
    style: css('flex:1;display:flex;align-items:center;justify-content:center;gap:7px;background:rgba(255,255,255,0.2);color:#fff;border:none;border-radius:13px;padding:15px 12px;font-size:13.5px;font-weight:700;cursor:pointer;')
  }, /*#__PURE__*/React.createElement("svg", { viewBox: "0 0 91 73", width: 17, height: 14, fill: "none", stroke: "#fff", strokeLinecap: "round", strokeLinejoin: "round" }, /*#__PURE__*/React.createElement("path", { strokeWidth: 6, d: "M63.651 22h18.151C85.225 22 88 24.786 88 28.222v35.556C88 67.214 85.225 70 81.802 70H9.198C5.775 70 3 67.214 3 63.778V28.222C3 24.786 5.775 22 9.198 22h18.151M14 33h7.111m49.778 0h7.11M14 59h7.112m49.778 0H78" }), /*#__PURE__*/React.createElement("path", { strokeWidth: 4, d: "M45.5 60C53.508 60 60 53.732 60 46s-6.492-14-14.5-14S31 38.268 31 46s6.492 14 14.5 14" }), /*#__PURE__*/React.createElement("path", { strokeWidth: 3, d: "M45.5 38.889V53.11M50 42.444C50 39.778 48.2 38 45.5 38S41 39.778 41 42.444 42.8 46 45.5 46s4.5.889 4.5 3.556S48.2 54 45.5 54 41 52.222 41 49.556" }), /*#__PURE__*/React.createElement("path", { strokeWidth: 4, d: "M45 24V2m-9 9 9-9 9 9" })), s.language === 'es' ? 'Registrar gasto' : 'Log expense'))), /*#__PURE__*/React.createElement("div", {
    ref: pfRevealRef,
    className: 'pf-reveal',
    style: isDesktop ? css('background:#fff;margin:-26px -20px 0 -20px;padding:28px 20px calc(env(safe-area-inset-bottom) + 90px);border-radius:28px 28px 0 0;position:relative;z-index:1;min-height:74vh;') : {
      background: '#fff',
      marginTop: Math.max(homeHeroH - 26, 0),
      marginLeft: -20,
      marginRight: -20,
      marginBottom: -96,
      padding: '28px 20px calc(env(safe-area-inset-bottom) + 96px)',
      borderRadius: '28px 28px 0 0',
      position: 'relative',
      zIndex: 1,
      minHeight: 'calc(100vh - ' + Math.max(homeHeroH - 26, 0) + 'px)'
    }
  }, !!s.pendingLeftover && pendingLeftoverLive > 0 && /*#__PURE__*/React.createElement("div", {
    style: css('background:linear-gradient(135deg,#0071e3,#34c759);border-radius:18px;padding:18px;color:#fff;margin-bottom:16px;box-shadow:0 12px 30px rgba(0,113,227,0.25);')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;font-weight:600;opacity:0.9;')
  }, (s.language === 'es' ? 'Sobrante de ' : 'Leftover from ') + s.pendingLeftover.label), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:28px;font-weight:800;margin:4px 0 8px;')
  }, fmt(pendingLeftoverLive)), !allocatingLeftover ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;opacity:0.95;margin-bottom:12px;')
  }, s.language === 'es' ? 'Te sobró esto — revísalo y asígnalo, o lo mandamos todo a ahorro por ti.' : "You had this left over — review and assign it, or we'll add it all to savings for you."), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setMsSplits({});
      setTab('monthSummary');
    },
    style: css('flex:1;background:#fff;color:#0071e3;border:none;padding:10px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;')
  }, s.language === 'es' ? 'Ver resumen' : 'Review it'), /*#__PURE__*/React.createElement("button", {
    onClick: dismissLeftover,
    style: css('background:rgba(255,255,255,0.2);color:#fff;border:none;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;')
  }, s.language === 'es' ? 'Solo ahorrarlo' : 'Just save it all'))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12px;opacity:0.9;margin-bottom:10px;')
  }, "Split it however you like — spending, one goal, or several."), /*#__PURE__*/React.createElement("div", {
    style: css('background:rgba(255,255,255,0.15);border-radius:12px;padding:10px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;')
  }, /*#__PURE__*/React.createElement("span", {
    style: css('font-size:13px;')
  }, "Add to spending"), /*#__PURE__*/React.createElement("input", {
    type: "number", inputMode: "decimal",
    placeholder: "0",
    value: leftoverSplits.spending || '',
    onChange: e => setLeftoverSplits(v => ({
      ...v,
      spending: e.target.value
    })),
    style: css('width:80px;padding:6px 8px;border:none;border-radius:8px;font-size:13px;text-align:right;')
  })), s.goals.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.id,
    style: css('background:rgba(255,255,255,0.15);border-radius:12px;padding:10px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;')
  }, /*#__PURE__*/React.createElement("span", {
    style: css('font-size:13px;')
  }, g.name), /*#__PURE__*/React.createElement("input", {
    type: "number", inputMode: "decimal",
    placeholder: "0",
    value: leftoverSplits[g.id] || '',
    onChange: e => setLeftoverSplits(v => ({
      ...v,
      [g.id]: e.target.value
    })),
    style: css('width:80px;padding:6px 8px;border:none;border-radius:8px;font-size:13px;text-align:right;')
  }))), (() => {
    const allocated = Object.values(leftoverSplits).reduce((a, v) => a + (parseFloat(v) || 0), 0);
    const remaining = s.pendingLeftover.amount - allocated;
    return /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12px;opacity:0.9;margin-bottom:10px;')
    }, fmt(Math.max(remaining, 0)), " left to assign", remaining < 0 ? " — that's more than you have" : '');
  })(), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const spendingAmt = parseFloat(leftoverSplits.spending) || 0;
      const goalAmts = {};
      s.goals.forEach(g => {
        goalAmts[g.id] = parseFloat(leftoverSplits[g.id]) || 0;
      });
      applyLeftoverAllocation(spendingAmt, goalAmts);
      setAllocatingLeftover(false);
      setLeftoverSplits({});
    },
    style: css('flex:1;background:#fff;color:#0071e3;border:none;padding:10px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;')
  }, "Confirm"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAllocatingLeftover(false),
    style: css('background:rgba(255,255,255,0.2);color:#fff;border:none;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;')
  }, "Cancel")))), /*#__PURE__*/React.createElement("div", {
    style: css('display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:22px;')
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => { setDepositType('paycheck'); setPaycheckAmount(String(s.income || '')); setShowPaycheckModal(true); },
    style: css('background:transparent;border-radius:14px;padding:14px 2px;cursor:pointer;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;justify-content:space-between;align-items:center;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10.5px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;')
  }, s.incomeProfile === 'allowance' ? t('allowanceLabel') : s.incomeProfile === 'freelance' ? t('fixedContractsLabel') : s.payFrequency === 'biweekly' ? t('incomePerPaycheck') : t('monthlyIncome')), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      setTab('incomeHistory');
    },
    style: css('background:none;border:none;color:#0071e3;font-size:10.5px;font-weight:700;cursor:pointer;padding:0;')
  }, s.language === 'es' ? 'Ver' : 'View')), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:17px;font-weight:700;color:#1d1d1f;margin-top:3px;')
  }, fmt(s.income))), /*#__PURE__*/React.createElement("div", {
    style: css('background:transparent;border-radius:14px;padding:14px 2px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10.5px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;')
  }, t('availableMonth'), /*#__PURE__*/React.createElement(InfoTip, {
    text: s.language === 'es' ? 'Tu ingreso menos tus gastos presupuestados de este mes.' : "Your income minus your budgeted expenses this month."
  })), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:17px;font-weight:700;color:#1d1d1f;margin-top:3px;')
  }, fmt(Math.max(ctx.boostedAvailable, 0)))), /*#__PURE__*/React.createElement("div", {
    style: css('background:transparent;border-radius:14px;padding:14px 2px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10.5px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;')
  }, t('totalSaved')), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:17px;font-weight:700;color:#1d1d1f;margin-top:3px;')
  }, fmt(totalCurrent)), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:9.5px;color:#86868b;margin-top:2px;')
  }, overallPct.toFixed(0), "% of goal")), /*#__PURE__*/React.createElement("div", {
    style: css('background:transparent;border-radius:14px;padding:14px 2px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10.5px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;')
  }, t('totalInvested')), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:17px;font-weight:700;color:#1d1d1f;margin-top:3px;')
  }, fmt(investmentTotal)), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:9.5px;color:#86868b;margin-top:2px;')
  }, s.investments.length, " ", s.investments.length === 1 ? 'investment' : 'investments'))), donutLegend.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border:1px solid #eef0f2;border-radius:16px;padding:16px;margin-bottom:22px;display:flex;align-items:center;gap:18px;flex-wrap:wrap;')
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: donutCanvasRef,
    width: "140",
    height: "140",
    style: css('flex:none;')
  }), /*#__PURE__*/React.createElement("div", {
    style: css('flex:1;min-width:160px;display:flex;flex-direction:column;gap:6px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:2px;')
  }, "How your income is split"), donutLegend.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: css('display:flex;align-items:center;gap:8px;font-size:12.5px;color:#1d1d1f;')
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 10,
      height: 10,
      borderRadius: 2,
      background: c.color,
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", null, c.label))))), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:10px;')
  }, "Your goals"), s.goals.map(g => {
    const v = buildGoalView(g, false);
    const goalMonthEntries = (g.savingsLog || []).filter(entry => {
      const p = parseMonthYearLabel(entry.label);
      return p.year === ctx.today.getFullYear() && p.month === ctx.today.getMonth();
    });
    const loggedThisMonth = goalMonthEntries.reduce((a, e) => a + e.amount, 0);
    const monthPct = v.monthlyBoosted > 0 ? Math.min(100, loggedThisMonth / v.monthlyBoosted * 100) : loggedThisMonth > 0 ? 100 : 0;
    const sharePct = v.percent;
    return /*#__PURE__*/React.createElement("div", {
      key: g.id,
      onClick: () => {
        selectGoal(g.id);
        setTab('metas');
      },
      style: css('background:#fff;border:1px solid #eef0f2;border-radius:18px;padding:18px 18px 16px;margin-bottom:12px;cursor:pointer;')
    }, /*#__PURE__*/React.createElement("div", { style: css('display:flex;align-items:center;gap:14px;') }, /*#__PURE__*/React.createElement("div", { style: css('flex:1;min-width:0;') }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;align-items:center;gap:12px;margin-bottom:12px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 44,
        height: 44,
        borderRadius: 12,
        background: g.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(GoalIconGlyph, {
      icon: g.icon,
      size: 22
    })), /*#__PURE__*/React.createElement("div", {
      style: css('flex:1;min-width:0;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:15.5px;font-weight:600;')
    }, g.name), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12.5px;color:#86868b;')
    }, fmt(goalCur(g)), " of ", fmt(g.target))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: v.isCompleted ? 13 : 19,
        fontWeight: 700,
        color: g.color,
        flex: 'none'
      }
    }, v.progressLabel)), /*#__PURE__*/React.createElement("div", {
      style: css('height:8px;border-radius:4px;background:#f0f0f2;overflow:hidden;')
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        borderRadius: 4,
        background: g.color,
        width: v.isCompleted ? '100%' : v.progressWidth
      }
    })), !v.isCompleted && /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;flex-wrap:wrap;justify-content:space-between;gap:6px;margin-top:10px;font-size:12px;color:#86868b;')
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", { style: { color: '#1d1d1f', fontWeight: 700 } }, sharePct.toFixed(0), "%"), s.language === 'es' ? ' de tu ahorro mensual' : ' of your monthly savings'), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", { style: { color: monthPct >= 100 ? g.color : '#1d1d1f', fontWeight: 700 } }, monthPct.toFixed(0), "%"), s.language === 'es' ? ' cumplido este mes' : ' met this month'))), !v.isCompleted && /*#__PURE__*/React.createElement("div", { style: css('flex:none;display:flex;flex-direction:column;align-items:center;gap:5px;') }, /*#__PURE__*/React.createElement("button", { onClick: function (e) { e.stopPropagation(); setDepositAmount(''); setQuickAddGoalId(g.id); }, style: css('width:52px;height:52px;border-radius:50%;background:#f5f5f7;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;') }, /*#__PURE__*/React.createElement("svg", { viewBox: "0 0 24 24", width: 24, height: 24, fill: "none", stroke: "#0071e3", strokeWidth: 2, strokeLinecap: "round" }, /*#__PURE__*/React.createElement("path", { d: "M12 5v14" }), /*#__PURE__*/React.createElement("path", { d: "M5 12h14" }))), /*#__PURE__*/React.createElement("div", { style: css('font-size:12px;font-weight:700;color:#0071e3;text-align:center;line-height:1.15;') }, s.language === 'es' ? 'Agregar ahorro' : 'Add savings'))));
  }))), s.tab === 'incomeHistory' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:center;gap:10px;margin-bottom:16px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('inicio'),
    style: css('background:#fff;border:none;width:34px;height:34px;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;')
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "18",
    height: "18",
    fill: "none",
    stroke: "#1d1d1f",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 18l-6-6 6-6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:22px;font-weight:700;letter-spacing:-0.01em;')
  }, s.language === 'es' ? 'Historial de depósitos' : 'Deposit history')), /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border-radius:16px;padding:16px;margin-bottom:16px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;justify-content:space-between;align-items:center;margin-bottom: ' + (editingIncome ? '8' : '2') + 'px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10.5px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;')
  }, s.language === 'es' ? 'Tu pago (fijo)' : 'Your pay (fixed)'), /*#__PURE__*/React.createElement("button", {
    onClick: () => editingIncome ? finishEditingIncome() : setEditingIncome(true),
    style: css('background:none;border:none;color:#0071e3;font-size:10.5px;font-weight:700;cursor:pointer;padding:0;')
  }, editingIncome ? t('done') : t('edit'))), editingIncome ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: css('position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:15px;color:#86868b;pointer-events:none;')
  }, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number", inputMode: "decimal",
    autoFocus: true,
    value: s.income || '',
    onChange: onIncome,
    style: css('width:100%;padding:9px 9px 9px 22px;border:1px solid #e5e5ea;border-radius:10px;font-size:15px;font-weight:700;background:#fbfbfd;')
  })), s.incomeProfile !== 'allowance' && /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPayFrequency('monthly'),
    style: {
      flex: 1,
      padding: 8,
      borderRadius: 9,
      border: s.payFrequency !== 'biweekly' ? '2px solid #0071e3' : '1px solid #e5e5ea',
      background: s.payFrequency !== 'biweekly' ? '#eef6ff' : '#fbfbfd',
      fontSize: 12,
      fontWeight: 600,
      color: '#1d1d1f',
      cursor: 'pointer'
    }
  }, t('monthlyLabel')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPayFrequency('biweekly'),
    style: {
      flex: 1,
      padding: 8,
      borderRadius: 9,
      border: s.payFrequency === 'biweekly' ? '2px solid #0071e3' : '1px solid #e5e5ea',
      background: s.payFrequency === 'biweekly' ? '#eef6ff' : '#fbfbfd',
      fontSize: 12,
      fontWeight: 600,
      color: '#1d1d1f',
      cursor: 'pointer'
    }
  }, t('biweeklyLabel'))), s.payFrequency === 'biweekly' && /*#__PURE__*/React.createElement("div", {
    style: css('margin-top:10px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;')
  }, /*#__PURE__*/React.createElement("label", {
    style: css('font-size:11px;color:#86868b;font-weight:600;')
  }, s.language === 'es' ? 'Fecha de un próximo pago' : 'A next payday date'), s.nextPaydayDate && /*#__PURE__*/React.createElement("button", {
    onClick: () => patch({
      nextPaydayDate: ''
    }),
    style: css('background:none;border:none;color:#ff3b30;font-size:11px;font-weight:600;cursor:pointer;padding:0;')
  }, s.language === 'es' ? 'Borrar' : 'Clear')), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: s.nextPaydayDate || '',
    onChange: onNextPaydayDate,
    style: css('width:100%;padding:8px;border:1px solid #e5e5ea;border-radius:9px;font-size:12.5px;background:#fbfbfd;')
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 140
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:20px;font-weight:700;color:#1d1d1f;')
  }, fmt(s.income)), s.incomeProfile !== 'allowance' && /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11px;color:#86868b;margin-top:1px;')
  }, s.payFrequency === 'biweekly' ? t('biweeklyLabel') : t('monthlyLabel')))), /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border-radius:16px;padding:16px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10.5px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:4px;')
  }, s.language === 'es' ? 'Depósitos recibidos' : 'Deposits received'), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11px;color:#86868b;margin-bottom:12px;line-height:1.4;')
  }, s.language === 'es' ? 'Cada depósito que has recibido, con su fecha.' : 'Every deposit you actually received, with its date.'), (() => {
    const sorted = (s.paycheckLog || []).slice().sort((a, b) => a.date.localeCompare(b.date));
    const recent = sorted.slice(-6);
    if (recent.length === 0) {
      return /*#__PURE__*/React.createElement("div", {
        style: css('font-size:12.5px;color:#86868b;margin-bottom:4px;')
      }, s.language === 'es' ? 'Todavía no has registrado ningún pago.' : "You haven't logged any paychecks yet.");
    }
    const maxAmt = Math.max(...recent.map(p => p.amount), 1);
    const barH = 100;
    return /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;align-items:flex-end;gap:10px;height:' + (barH + 26) + 'px;margin-bottom:6px;')
    }, recent.map((p, i) => {
      const h = Math.max(p.amount / maxAmt * barH, 4);
      const isLast = i === recent.length - 1;
      const d = new Date(p.date + 'T00:00:00');
      return /*#__PURE__*/React.createElement("div", {
        key: p.id,
        style: css('flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;min-width:0;')
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: '70%',
          maxWidth: 26,
          height: h,
          borderRadius: '5px 5px 0 0',
          background: isLast ? '#0071e3' : '#a8d8b0'
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: css('font-size:9px;color:#86868b;margin-top:5px;white-space:nowrap;')
      }, MONTH_NAMES[d.getMonth()], " ", d.getDate()));
    }));
  })(), (s.paycheckLog || []).slice().sort((a, b) => b.date.localeCompare(a.date)).map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: css('display:flex;justify-content:space-between;align-items:center;font-size:12.5px;color:#6e6e73;padding:8px 0;border-top:1px solid #f5f5f7;')
  }, /*#__PURE__*/React.createElement("span", null, p.date, p.kind === 'other' && /*#__PURE__*/React.createElement("span", {
    style: css('color:#0071e3;font-size:10.5px;font-weight:600;margin-left:6px;')
  }, s.language === 'es' ? 'otro' : 'other')), /*#__PURE__*/React.createElement("span", {
    style: css('display:flex;align-items:center;gap:8px;')
  }, fmt(p.amount), /*#__PURE__*/React.createElement("button", {
    onClick: () => removePaycheckEntry(p.id),
    style: css('background:none;border:none;color:#ff3b30;cursor:pointer;font-size:14px;')
  }, "×")))), showAddPaycheck ? /*#__PURE__*/React.createElement("div", {
    style: css('border-top:1px solid #f5f5f7;margin-top:10px;padding-top:12px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;margin-bottom:8px;')
  }, /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: newPaycheckDate,
    onChange: e => setNewPaycheckDate(e.target.value),
    style: css('flex:1;padding:8px;border:1px solid #e5e5ea;border-radius:9px;font-size:12.5px;background:#fbfbfd;')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 100
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: css('position:absolute;left:8px;top:50%;transform:translateY(-50%);font-size:13px;color:#86868b;pointer-events:none;')
  }, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number", inputMode: "decimal",
    placeholder: "0",
    value: newPaycheckAmount,
    onChange: e => setNewPaycheckAmount(e.target.value),
    style: css('width:100%;padding:8px 8px 8px 20px;border:1px solid #e5e5ea;border-radius:9px;font-size:12.5px;background:#fbfbfd;')
  }))), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      addManualPaycheck(newPaycheckDate, parseFloat(newPaycheckAmount) || 0);
      setNewPaycheckDate('');
      setNewPaycheckAmount('');
      setShowAddPaycheck(false);
    },
    style: css('flex:1;background:#0071e3;color:#fff;border:none;padding:9px;border-radius:9px;font-size:12.5px;font-weight:700;cursor:pointer;')
  }, s.language === 'es' ? 'Agregar' : 'Add'), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowAddPaycheck(false),
    style: css('flex:1;background:#f5f5f7;color:#1d1d1f;border:none;padding:9px;border-radius:9px;font-size:12.5px;font-weight:600;cursor:pointer;')
  }, s.language === 'es' ? 'Cancelar' : 'Cancel'))) : /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setNewPaycheckDate(todayStr);
      setNewPaycheckAmount(String(s.income || ''));
      setShowAddPaycheck(true);
    },
    style: css('width:100%;margin-top:10px;background:#f5f5f7;color:#0071e3;border:none;padding:9px;border-radius:9px;font-size:12.5px;font-weight:700;cursor:pointer;')
  }, "+ ", s.language === 'es' ? 'Registrar un depósito que ya recibiste' : 'Register a deposit you already received'))), s.tab === 'savingsLog' && sgSource && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:center;gap:10px;margin-bottom:16px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('metas'),
    style: css('background:#fff;border:none;width:34px;height:34px;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;')
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "18",
    height: "18",
    fill: "none",
    stroke: "#1d1d1f",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 18l-6-6 6-6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:22px;font-weight:700;letter-spacing:-0.01em;')
  }, t('savingsLogged'))), /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border-radius:16px;padding:16px;margin-bottom:16px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10.5px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:4px;')
  }, s.language === 'es' ? 'Total registrado' : 'Total logged'), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:22px;font-weight:800;color:#1d1d1f;')
  }, fmt((sgSource.savingsLog || []).reduce((a, e) => a + e.amount, 0))), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11.5px;color:#86868b;margin-top:2px;')
  }, (sgSource.savingsLog || []).length, " ", (sgSource.savingsLog || []).length === 1 ? s.language === 'es' ? 'mes' : 'month' : s.language === 'es' ? 'meses' : 'months')), /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border-radius:16px;padding:16px;')
  }, (sgSource.savingsLog || []).length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12.5px;color:#86868b;')
  }, s.language === 'es' ? 'Todavía no hay nada registrado.' : 'Nothing logged yet.') : sgSource.savingsLog.map(entry => /*#__PURE__*/React.createElement("div", {
    key: entry.id,
    style: css('display:flex;justify-content:space-between;align-items:center;font-size:13px;color:#1d1d1f;padding:10px 0;border-bottom:1px solid #f5f5f7;')
  }, /*#__PURE__*/React.createElement("span", null, entry.label), editingSavingsEntryId === entry.id ? /*#__PURE__*/React.createElement("span", {
    style: css('display:flex;align-items:center;gap:6px;')
  }, /*#__PURE__*/React.createElement("input", {
    type: "number", inputMode: "decimal",
    autoFocus: true,
    value: editingSavingsAmount,
    onChange: e => setEditingSavingsAmount(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        updateSavingsLogEntryAmount(sgSource.id, entry.id, parseFloat(editingSavingsAmount) || 0);
        setEditingSavingsEntryId(null);
      }
    },
    style: css('width:80px;padding:5px 7px;border:1px solid #0071e3;border-radius:8px;font-size:12.5px;background:#fbfbfd;')
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      updateSavingsLogEntryAmount(sgSource.id, entry.id, parseFloat(editingSavingsAmount) || 0);
      setEditingSavingsEntryId(null);
    },
    style: css('background:#0071e3;color:#fff;border:none;padding:5px 10px;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer;')
  }, s.language === 'es' ? 'Listo' : 'Done')) : /*#__PURE__*/React.createElement("span", {
    style: css('display:flex;align-items:center;gap:10px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setEditingSavingsEntryId(entry.id);
      setEditingSavingsAmount(String(entry.amount));
    },
    style: css('background:none;border:none;color:#0071e3;font-weight:700;font-size:13px;cursor:pointer;padding:0;')
  }, fmt(entry.amount)), /*#__PURE__*/React.createElement("button", {
    onClick: () => removeSavingsLogEntry(sgSource.id, entry.id),
    style: css('background:none;border:none;color:#ff3b30;cursor:pointer;font-size:15px;')
  }, "×")))), showAddSavingsEntry ? /*#__PURE__*/React.createElement("div", {
    style: css('border-top:1px solid #f5f5f7;margin-top:10px;padding-top:12px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;margin-bottom:8px;')
  }, /*#__PURE__*/React.createElement("select", {
    value: newSavingsMonth,
    onChange: e => setNewSavingsMonth(parseInt(e.target.value, 10)),
    style: css('flex:1;padding:9px;border:1px solid #e5e5ea;border-radius:9px;font-size:12.5px;background:#fbfbfd;')
  }, MONTH_NAMES.map((m, i) => /*#__PURE__*/React.createElement("option", {
    key: i,
    value: i
  }, m))), /*#__PURE__*/React.createElement("input", {
    type: "number", inputMode: "decimal",
    value: newSavingsYear,
    onChange: e => setNewSavingsYear(parseInt(e.target.value, 10) || new Date().getFullYear()),
    style: css('width:80px;padding:9px;border:1px solid #e5e5ea;border-radius:9px;font-size:12.5px;background:#fbfbfd;')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: css('position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:13px;color:#86868b;pointer-events:none;')
  }, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number", inputMode: "decimal",
    placeholder: "0",
    value: newSavingsAmount,
    onChange: e => setNewSavingsAmount(e.target.value),
    style: css('width:100%;padding:9px 9px 9px 20px;border:1px solid #e5e5ea;border-radius:9px;font-size:12.5px;background:#fbfbfd;box-sizing:border-box;')
  })), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const label = MONTH_NAMES[newSavingsMonth] + ' ' + newSavingsYear;
      addBackdatedSavingsEntry(sgSource.id, label, parseFloat(newSavingsAmount) || 0);
      setNewSavingsAmount('');
      setShowAddSavingsEntry(false);
    },
    style: css('flex:1;background:#0071e3;color:#fff;border:none;padding:9px;border-radius:9px;font-size:12.5px;font-weight:700;cursor:pointer;')
  }, s.language === 'es' ? 'Agregar' : 'Add'), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowAddSavingsEntry(false),
    style: css('flex:1;background:#f5f5f7;color:#1d1d1f;border:none;padding:9px;border-radius:9px;font-size:12.5px;font-weight:600;cursor:pointer;')
  }, s.language === 'es' ? 'Cancelar' : 'Cancel'))) : /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowAddSavingsEntry(true),
    style: css('width:100%;margin-top:10px;background:#f5f5f7;color:#0071e3;border:none;padding:9px;border-radius:9px;font-size:12.5px;font-weight:700;cursor:pointer;')
  }, "+ ", s.language === 'es' ? 'Agregar un mes atrasado' : 'Add a past month'))), s.tab === 'settings' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:center;gap:10px;margin-bottom:16px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => settingsView === 'menu' ? setTab('inicio') : setSettingsView('menu'),
    style: css('background:#fff;border:none;width:34px;height:34px;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;')
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "18",
    height: "18",
    fill: "none",
    stroke: "#1d1d1f",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 18l-6-6 6-6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:22px;font-weight:700;letter-spacing:-0.01em;')
  }, settingsView === 'menu' ? t('settings') : settingsView === 'profile' ? t('profileMenu') : settingsView === 'reports' ? t('reportsMenu') : settingsView === 'security' ? s.language === 'es' ? 'Seguridad' : 'Security' : settingsView === 'account' ? s.language === 'es' ? 'Cuenta' : 'Account' : t('moreMenu'))), settingsView === 'menu' && /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;flex-direction:column;gap:10px;')
  }, [{
    key: 'profile',
    label: t('profileMenu'),
    desc: t('profileMenuDesc')
  }, {
    key: 'reports',
    label: t('reportsMenu'),
    desc: t('reportsMenuDesc')
  }, {
    key: 'account',
    label: s.language === 'es' ? 'Cuenta' : 'Account',
    desc: authUser ? authUser.email : s.language === 'es' ? 'Inicia sesión para metas compartidas' : 'Sign in for shared goals'
  }, {
    key: 'security',
    label: s.language === 'es' ? 'Seguridad' : 'Security',
    desc: lockCfg && lockCfg.pinHash ? s.language === 'es' ? 'Bloqueo con PIN activado' : 'PIN lock is on' : s.language === 'es' ? 'Protege la app con un PIN' : 'Protect the app with a PIN'
  }, {
    key: 'more',
    label: t('moreMenu'),
    desc: t('moreMenuDesc')
  }].map(row => /*#__PURE__*/React.createElement("button", {
    key: row.key,
    onClick: () => setSettingsView(row.key),
    style: css('display:flex;align-items:center;justify-content:space-between;background:#fff;border:none;border-radius:14px;padding:16px;text-align:left;cursor:pointer;')
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:15px;font-weight:600;color:#1d1d1f;')
  }, row.label), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12px;color:#86868b;margin-top:2px;')
  }, row.desc)), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "16",
    height: "16",
    fill: "none",
    stroke: "#c7c7cc",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 18l6-6-6-6"
  }))))), settingsView === 'security' && /*#__PURE__*/React.createElement(SecuritySettings, {
    lang: s.language,
    config: lockCfg,
    setConfig: setLockCfg,
    userId: authUser ? authUser.email : 'local'
  }), settingsView === 'account' && /*#__PURE__*/React.createElement("div", null, authLoading ? /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;color:#86868b;')
  }, s.language === 'es' ? 'Cargando…' : 'Loading…') : authUser ? /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border-radius:16px;padding:20px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:center;gap:14px;margin-bottom:18px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      height: 52,
      borderRadius: '50%',
      background: 'linear-gradient(135deg,#0071e3,#5ac8fa)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 20,
      fontWeight: 700,
      flex: 'none'
    }
  }, (authUser.email || '?').charAt(0).toUpperCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:15px;font-weight:700;color:#1d1d1f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;')
  }, authUser.email), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11.5px;color:#86868b;margin-top:1px;')
  }, s.language === 'es' ? 'Sesión iniciada' : 'Signed in'))), /*#__PURE__*/React.createElement("button", {
    onClick: signOutUser,
    style: css('width:100%;background:#f5f5f7;color:#1d1d1f;border:none;padding:11px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;')
  }, s.language === 'es' ? 'Cerrar sesión' : 'Sign out'), /*#__PURE__*/React.createElement("div", {
    style: css('border-top:1px solid #f5f5f7;margin-top:16px;padding-top:16px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10.5px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:8px;')
  }, s.language === 'es' ? 'Respaldo en la nube' : 'Cloud backup'), cloudSyncError && /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11.5px;color:#ff3b30;margin-bottom:6px;')
  }, "⚠ ", cloudSyncError), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:center;gap:7px;font-size:12.5px;color:#6e6e73;line-height:1.4;')
  }, cloudSyncStatus === 'syncing' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: '#ff9500',
      flex: 'none'
    }
  }), s.language === 'es' ? 'Sincronizando…' : 'Syncing…'), cloudSyncStatus === 'synced' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: '#34c759',
      flex: 'none'
    }
  }), (s.language === 'es' ? 'Sincronizado — ' : 'Synced — ') + (cloudBackupInfo && cloudBackupInfo !== 'none' ? new Date(cloudBackupInfo.updatedAt).toLocaleString() : '')), cloudSyncStatus === 'error' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: '#ff3b30',
      flex: 'none'
    }
  }), s.language === 'es' ? 'No se pudo sincronizar' : "Couldn't sync"), cloudSyncStatus === 'idle' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: '#c7c7cc',
      flex: 'none'
    }
  }), s.language === 'es' ? 'Aún nada que sincronizar' : 'Nothing to sync yet')), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11px;color:#86868b;margin-top:8px;line-height:1.4;')
  }, s.language === 'es' ? 'Automático: al iniciar sesión, tus datos de la cuenta se traen solos. Cada cambio que hagas se guarda solo, en segundos.' : "Automatic: signing in pulls your account's data in by itself. Every change you make saves itself, within seconds.")), /*#__PURE__*/React.createElement("div", {
    style: css('border-top:1px solid #f5f5f7;margin-top:16px;padding-top:16px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11.5px;color:#86868b;line-height:1.4;')
  }, s.language === 'es' ? 'Próximamente: borrar cuenta permanentemente. Esto necesita una pieza extra de seguridad en el servidor que estamos armando.' : 'Coming soon: permanently delete account. This needs an extra server-side security piece we\'re building next.'))) : /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border-radius:16px;padding:16px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;color:#6e6e73;margin-bottom:14px;line-height:1.4;')
  }, s.language === 'es' ? 'Inicia sesión — tus datos se van a guardar y traer automáticamente entre dispositivos.' : "Log in — your data will automatically save and pull in across your devices."), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowLoginFromWelcome(true),
    style: css('width:100%;background:#0071e3;color:#fff;border:none;padding:11px;border-radius:10px;font-size:13.5px;font-weight:700;cursor:pointer;')
  }, s.language === 'es' ? 'Iniciar sesión' : 'Log in'), authError && /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11.5px;color:#ff3b30;margin-top:10px;')
  }, authError))), settingsView === 'profile' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:10px;')
  }, t('languageLabel')), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;margin-bottom:20px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setLanguage('en'),
    style: {
      flex: 1,
      background: s.language !== 'es' ? '#0071e3' : '#f5f5f7',
      color: s.language !== 'es' ? '#fff' : '#1d1d1f',
      border: 'none',
      padding: 9,
      borderRadius: 9,
      fontSize: 12.5,
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "English"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setLanguage('es'),
    style: {
      flex: 1,
      background: s.language === 'es' ? '#0071e3' : '#f5f5f7',
      color: s.language === 'es' ? '#fff' : '#1d1d1f',
      border: 'none',
      padding: 9,
      borderRadius: 9,
      fontSize: 12.5,
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Español")), typeof Notification !== 'undefined' && /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('flex:1;min-width:0;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;font-weight:600;color:#1d1d1f;')
  }, t('notifToggle')), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11.5px;color:#86868b;line-height:1.35;margin-top:2px;')
  }, t('notifToggleDesc'))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setNotificationsEnabled(!s.notificationsEnabled),
    "aria-label": t('notifToggle'),
    style: {
      width: 44,
      height: 26,
      borderRadius: 13,
      border: 'none',
      background: s.notificationsEnabled ? '#34c759' : '#e5e5ea',
      position: 'relative',
      cursor: 'pointer',
      flex: 'none',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: s.notificationsEnabled ? 21 : 3,
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: '#fff',
      transition: 'left 160ms',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
    }
  }))), typeof Notification !== 'undefined' && s.notificationsEnabled && Notification.permission === 'denied' && /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11.5px;color:#ff9500;margin-top:-14px;margin-bottom:20px;line-height:1.35;')
  }, t('notifBlocked')), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:10px;')
  }, t('profileQTitle')), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;flex-direction:column;gap:8px;margin-bottom:20px;')
  }, ['allowance', 'salary', 'freelance'].map(p => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => setIncomeProfile(p),
    style: {
      textAlign: 'left',
      padding: '12px 14px',
      borderRadius: 12,
      border: s.incomeProfile === p ? '2px solid #0071e3' : '1px solid #e5e5ea',
      background: s.incomeProfile === p ? '#eef6ff' : '#fbfbfd',
      fontSize: 13.5,
      fontWeight: 600,
      color: '#1d1d1f',
      cursor: 'pointer'
    }
  }, p === 'allowance' ? t('profileAllowance') : p === 'salary' ? t('profileSalary') : t('profileFreelance')))), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:10px;')
  }, t('howOldQ')), /*#__PURE__*/React.createElement("input", {
    type: "number", inputMode: "decimal",
    placeholder: t('yourAge'),
    value: s.studentAge || '',
    onChange: e => setStudentAge(parseInt(e.target.value, 10) || null),
    style: css('width:100%;padding:11px 12px;border:1px solid #d2d2d7;border-radius:12px;font-size:15px;background:#fbfbfd;margin-bottom:20px;')
  }), s.studentAge && s.studentAge < 18 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:10px;')
  }, t('investQ')), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;flex-direction:column;gap:8px;margin-bottom:20px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setInvestsWithParents(true),
    style: {
      textAlign: 'left',
      padding: '11px 14px',
      borderRadius: 11,
      border: s.investsWithParents === true ? '2px solid #0071e3' : '1px solid #e5e5ea',
      background: s.investsWithParents === true ? '#eef6ff' : '#fbfbfd',
      fontSize: 13,
      fontWeight: 600,
      color: '#1d1d1f',
      cursor: 'pointer'
    }
  }, t('investYes')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setInvestsWithParents(false),
    style: {
      textAlign: 'left',
      padding: '11px 14px',
      borderRadius: 11,
      border: s.investsWithParents === false ? '2px solid #0071e3' : '1px solid #e5e5ea',
      background: s.investsWithParents === false ? '#eef6ff' : '#fbfbfd',
      fontSize: 13,
      fontWeight: 600,
      color: '#1d1d1f',
      cursor: 'pointer'
    }
  }, t('investNo')))), s.incomeProfile === 'salary' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:10px;')
  }, t('employmentQ')), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;margin-bottom:16px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setEmploymentType('fulltime'),
    style: {
      flex: 1,
      padding: 11,
      borderRadius: 11,
      border: s.employmentType !== 'parttime' ? '2px solid #0071e3' : '1px solid #e5e5ea',
      background: s.employmentType !== 'parttime' ? '#eef6ff' : '#fbfbfd',
      fontSize: 13,
      fontWeight: 600,
      color: '#1d1d1f',
      cursor: 'pointer'
    }
  }, t('fulltimeLabel')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEmploymentType('parttime'),
    style: {
      flex: 1,
      padding: 11,
      borderRadius: 11,
      border: s.employmentType === 'parttime' ? '2px solid #0071e3' : '1px solid #e5e5ea',
      background: s.employmentType === 'parttime' ? '#eef6ff' : '#fbfbfd',
      fontSize: 13,
      fontWeight: 600,
      color: '#1d1d1f',
      cursor: 'pointer'
    }
  }, t('parttimeLabel'))), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:10px;')
  }, t('payFreqQ')), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;margin-bottom:20px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPayFrequency('monthly'),
    style: {
      flex: 1,
      padding: 11,
      borderRadius: 11,
      border: s.payFrequency !== 'biweekly' ? '2px solid #0071e3' : '1px solid #e5e5ea',
      background: s.payFrequency !== 'biweekly' ? '#eef6ff' : '#fbfbfd',
      fontSize: 13,
      fontWeight: 600,
      color: '#1d1d1f',
      cursor: 'pointer'
    }
  }, t('monthlyLabel')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPayFrequency('biweekly'),
    style: {
      flex: 1,
      padding: 11,
      borderRadius: 11,
      border: s.payFrequency === 'biweekly' ? '2px solid #0071e3' : '1px solid #e5e5ea',
      background: s.payFrequency === 'biweekly' ? '#eef6ff' : '#fbfbfd',
      fontSize: 13,
      fontWeight: 600,
      color: '#1d1d1f',
      cursor: 'pointer'
    }
  }, t('biweeklyLabel')))), s.incomeProfile === 'freelance' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:10px;')
  }, t('fixedContractsQ')), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;margin-bottom:20px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setHasFixedContracts(true),
    style: {
      flex: 1,
      padding: 11,
      borderRadius: 11,
      border: s.hasFixedContracts === true ? '2px solid #0071e3' : '1px solid #e5e5ea',
      background: s.hasFixedContracts === true ? '#eef6ff' : '#fbfbfd',
      fontSize: 13,
      fontWeight: 600,
      color: '#1d1d1f',
      cursor: 'pointer'
    }
  }, t('yesLabel')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setHasFixedContracts(false),
    style: {
      flex: 1,
      padding: 11,
      borderRadius: 11,
      border: s.hasFixedContracts === false ? '2px solid #0071e3' : '1px solid #e5e5ea',
      background: s.hasFixedContracts === false ? '#eef6ff' : '#fbfbfd',
      fontSize: 13,
      fontWeight: 600,
      color: '#1d1d1f',
      cursor: 'pointer'
    }
  }, t('noLabel'))))), settingsView === 'reports' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;margin-bottom:10px;')
  }, /*#__PURE__*/React.createElement("select", {
    value: reportQuarter,
    onChange: e => setReportQuarter(parseInt(e.target.value, 10)),
    style: css('flex:1;padding:9px 10px;border:1px solid #e5e5ea;border-radius:10px;font-size:13px;background:#fbfbfd;')
  }, /*#__PURE__*/React.createElement("option", {
    value: 1
  }, "Q1 (Jan–Mar)"), /*#__PURE__*/React.createElement("option", {
    value: 2
  }, "Q2 (Apr–Jun)"), /*#__PURE__*/React.createElement("option", {
    value: 3
  }, "Q3 (Jul–Sep)"), /*#__PURE__*/React.createElement("option", {
    value: 4
  }, "Q4 (Oct–Dec)")), /*#__PURE__*/React.createElement("input", {
    type: "number", inputMode: "decimal",
    value: reportYear,
    onChange: e => setReportYear(parseInt(e.target.value, 10) || new Date().getFullYear()),
    style: css('width:90px;padding:9px 10px;border:1px solid #e5e5ea;border-radius:10px;font-size:13px;background:#fbfbfd;')
  })), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => downloadReport('quarter'),
    style: css('flex:1;background:#eceded;color:#1d1d1f;border:none;padding:10px;border-radius:10px;font-size:12.5px;font-weight:600;cursor:pointer;')
  }, t('quarterlyReport')), /*#__PURE__*/React.createElement("button", {
    onClick: () => downloadReport('year'),
    style: css('flex:1;background:#eceded;color:#1d1d1f;border:none;padding:10px;border-radius:10px;font-size:12.5px;font-weight:600;cursor:pointer;')
  }, t('annualReport')))), settingsView === 'more' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: css('margin-bottom:24px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:12px;')
  }, t('backupTransfer'), /*#__PURE__*/React.createElement(InfoTip, {
    text: "Your data lives only on this device/browser. Export it here, then import that file on another device to bring your data along."
  })), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: exportData,
    style: css('flex:1;background:#f5f5f7;color:#1d1d1f;border:none;padding:10px;border-radius:10px;font-size:12.5px;font-weight:600;cursor:pointer;')
  }, t('exportData')), /*#__PURE__*/React.createElement("button", {
    onClick: triggerImport,
    style: css('flex:1;background:#34c759;color:#fff;border:none;padding:10px;border-radius:10px;font-size:12.5px;font-weight:600;cursor:pointer;')
  }, t('importData'))), /*#__PURE__*/React.createElement("input", {
    ref: importInputRef,
    type: "file",
    accept: "application/json",
    onChange: handleImportFile,
    style: {
      display: 'none'
    }
  }), importMessage && /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11.5px;color:#0071e3;margin-top:8px;')
  }, importMessage)), /*#__PURE__*/React.createElement("div", {
    style: css('border-top:1px solid #e5e5ea;padding-top:16px;margin-bottom:24px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:10px;')
  }, t('feedback')), feedbackStatus === 'sent' ? /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;color:#34c759;font-weight:600;background:#eafbf0;border-radius:10px;padding:12px;text-align:center;')
  }, s.language === 'es' ? '✓ ¡Enviado, gracias!' : '✓ Sent, thanks!') : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("textarea", {
    value: feedbackText,
    onChange: e => setFeedbackText(e.target.value),
    placeholder: s.language === 'es' ? '¿Qué te gustó, qué se sintió confuso, qué le agregarías?' : 'What did you like, what felt confusing, what would you add?',
    rows: 4,
    style: css('width:100%;padding:10px 12px;border:1px solid #e5e5ea;border-radius:10px;font-size:13px;background:#fbfbfd;margin-bottom:8px;resize:vertical;font-family:inherit;')
  }), /*#__PURE__*/React.createElement("button", {
    onClick: sendFeedback,
    disabled: feedbackStatus === 'sending' || !feedbackText.trim(),
    style: css('width:100%;background:' + (feedbackStatus === 'sending' ? '#a1c9f4' : '#0071e3') + ';color:#fff;border:none;padding:10px;border-radius:10px;font-size:12.5px;font-weight:600;cursor:pointer;')
  }, feedbackStatus === 'sending' ? s.language === 'es' ? 'Enviando…' : 'Sending…' : t('sendFeedback')), feedbackStatus === 'error' && /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11.5px;color:#ff3b30;margin-top:8px;')
  }, s.language === 'es' ? 'No se pudo enviar. Intenta de nuevo.' : "Couldn't send. Try again."))), /*#__PURE__*/React.createElement("div", {
    style: css('border-top:1px solid #e5e5ea;padding-top:16px;margin-bottom:24px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:10px;')
  }, t('reset')), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11.5px;color:#86868b;margin-bottom:10px;')
  }, s.language === 'es' ? 'Empezar de cero en este dispositivo? Esto borra todo — exporta un respaldo primero si quieres conservarlo.' : 'Starting fresh on this device? This clears everything — export a backup first if you want to keep it.'), /*#__PURE__*/React.createElement("button", {
    onClick: resetApp,
    style: css('width:100%;background:#fff2ef;color:#ff3b30;border:none;padding:10px;border-radius:10px;font-size:12.5px;font-weight:600;cursor:pointer;')
  }, t('resetApp'))))), s.tab === 'metas' && /*#__PURE__*/React.createElement(React.Fragment, null, !showGoalDetail && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:22px;font-weight:700;letter-spacing:-0.01em;margin-bottom:4px;')
  }, t('goals')), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;color:#86868b;margin-bottom:16px;')
  }, s.language === 'es' ? 'Así va cada meta este mes.' : 'How each goal is pacing this month.'), coachTips.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: css('background:#f7faff;border:1px solid #e4eefb;border-radius:14px;padding:14px 16px;margin-bottom:16px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;')
  }, /*#__PURE__*/React.createElement("span", {
    style: css('font-size:10.5px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#0071e3;')
  }, t('coachEyebrow')), coachTips.length > 1 && /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('guide'),
    style: css('background:none;border:none;color:#0071e3;font-size:11.5px;font-weight:600;cursor:pointer;padding:0;')
  }, t('coachSeeAll') + ' (' + coachTips.length + ')')), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:14px;font-weight:700;color:#1d1d1f;')
  }, coachTips[0].title), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12.5px;color:#6e6e73;line-height:1.4;margin-top:3px;margin-bottom:12px;')
  }, coachTips[0].body), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;justify-content:flex-end;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => dismissTip(coachTips[0].id),
    style: css('background:none;border:none;color:#86868b;font-size:12.5px;font-weight:600;cursor:pointer;padding:8px 6px;')
  }, coachTips[0].action ? t('coachNotNow') : t('coachGotIt')), coachTips[0].action && /*#__PURE__*/React.createElement("button", {
    onClick: coachTips[0].action,
    style: css('background:#0071e3;color:#fff;border:none;border-radius:9px;padding:8px 14px;font-size:12.5px;font-weight:700;cursor:pointer;')
  }, coachTips[0].actionLabel))), s.goals.length > 0 && (() => {
    const total = s.goals.reduce((a, g) => a + buildGoalView(g, false).monthlyBoosted, 0);
    const R = 46,
      C = 2 * Math.PI * R;
    let acc = 0;
    const segs = s.goals.map(g => {
      const v = buildGoalView(g, false).monthlyBoosted;
      const frac = total > 0 ? v / total : 0;
      const isCompleted = g.target > 0 && goalCur(g) >= g.target;
      const seg = {
        color: g.color,
        name: g.name,
        value: v,
        pct: frac * 100,
        dashOffset: -acc,
        isCompleted
      };
      acc += frac * C;
      return seg;
    });
    return /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff;border-radius:16px;padding:18px;margin-bottom:16px;display:flex;align-items:center;gap:16px;')
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 110 110",
      width: "110",
      height: "110",
      style: {
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "55",
      cy: "55",
      r: R,
      fill: "none",
      stroke: "#f0f0f2",
      strokeWidth: "13"
    }), segs.map((seg, i) => seg.pct > 0 && /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: "55",
      cy: "55",
      r: R,
      fill: "none",
      stroke: seg.color,
      strokeWidth: "13",
      strokeDasharray: (seg.pct / 100 * C).toFixed(1) + ' ' + C,
      strokeDashoffset: seg.dashOffset,
      transform: "rotate(-90 55 55)"
    }))), /*#__PURE__*/React.createElement("div", {
      style: css('flex:1;min-width:0;')
    }, segs.map((seg, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: css('display:flex;align-items:center;gap:7px;min-width:0;padding:6px 0;' + (i > 0 ? 'border-top:1px solid #f0f0f2;' : ''))
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 9,
        height: 9,
        borderRadius: '50%',
        background: seg.color,
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:12.5px;font-weight:600;color:#1d1d1f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;')
    }, seg.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 700,
        color: seg.color,
        flex: 'none'
      }
    }, seg.isCompleted ? t('completed') : seg.pct.toFixed(0) + '%')))));
  })(), (() => {
    const assignedTotal = s.goals.reduce((a, g) => a + buildGoalView(g, false).monthlyBoosted, 0);
    const unassigned = ctx.boostedAvailable - assignedTotal;
    return unassigned > 1 ? /*#__PURE__*/React.createElement("div", {
      style: css('background:linear-gradient(135deg,#0071e3,#5ac8fa);border-radius:14px;padding:14px 16px;color:#fff;margin:12px 0 16px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12px;font-weight:600;opacity:0.9;')
    }, "Unassigned each month"), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:20px;font-weight:800;margin-top:2px;')
    }, fmt(unassigned), "/mo"), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12px;opacity:0.9;margin-top:2px;')
    }, "Not covered by any goal's % — raise a goal's share below to put it to work.")) : null;
  })(), overAllocatedWarning && /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff2ef;border-radius:12px;padding:12px 14px;font-size:13px;color:#ff3b30;margin-bottom:14px;')
  }, overAllocatedWarning), /*#__PURE__*/React.createElement("div", {
    style: css('display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:16px;')
  }, s.goals.map(g => {
    const v = buildGoalView(g, false);
    const spark = buildGoalSparkline(g, v.monthlyBoosted, ctx.today);
    const remaining = Math.max(g.target - goalCur(g), 0);
    const monthEntries = (g.savingsLog || []).filter(e => {
      const p = parseMonthYearLabel(e.label);
      return p.year === ctx.today.getFullYear() && p.month === ctx.today.getMonth();
    });
    const loggedThisMonth = monthEntries.reduce((a, e) => a + e.amount, 0);
    const monthPct = v.monthlyBoosted > 0 ? Math.round(loggedThisMonth / v.monthlyBoosted * 100) : loggedThisMonth > 0 ? 100 : 0;
    const capColor = g.color;
    return /*#__PURE__*/React.createElement("div", Object.assign({
      key: g.id,
      ref: pfRevealRef,
      className: 'pf-reveal',
      onClick: cardTapGuard(() => {
        selectGoal(g.id);
        setShowGoalDetail(true);
      }),
      style: css('position:relative;display:flex;flex-direction:column;background:#fff;border-radius:18px;padding:15px 16px;cursor:pointer;min-height:138px;min-width:0;box-shadow:0 1px 2px rgba(0,0,0,0.05),0 8px 20px rgba(0,0,0,0.04);')
    }, cardPressProps(() => setDeleteConfirm({
      type: 'goal',
      id: g.id
    }))), deleteConfirm && deleteConfirm.type === 'goal' && deleteConfirm.id === g.id && deleteOverlay(() => deleteGoalNow(g.id)), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;align-items:center;gap:8px;margin-bottom:8px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 26,
        height: 26,
        borderRadius: 8,
        background: g.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(GoalIconGlyph, {
      icon: g.icon,
      size: 14
    })), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12.5px;font-weight:700;color:#1d1d1f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;')
    }, g.name)), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:21px;font-weight:800;color:#1d1d1f;letter-spacing:-0.01em;font-variant-numeric:tabular-nums;')
    }, fmt(goalCur(g))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        fontWeight: 600,
        color: capColor,
        marginTop: 3,
        marginBottom: 6
      }
    }, v.isCompleted ? s.language === 'es' ? 'Meta cumplida' : 'Goal reached' : fmt(remaining) + (s.language === 'es' ? ' por ahorrar' : ' left to save')), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'auto'
      }
    }, /*#__PURE__*/React.createElement(GoalSparkline, {
      actual: spark.actual,
      color: g.color,
      height: 30
    })));
  }), s.goals.length < 6 && !s.goals.some(g => g.name === 'Emergency Fund' || g.name === 'Fondo de emergencia') && /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowEmergencyFundPicker(true),
    style: css('background:#eef6ff;border:1.5px dashed #0071e3;border-radius:18px;padding:14px 8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;min-height:138px;')
  }, /*#__PURE__*/React.createElement("svg", { viewBox: "0 0 24 24", width: 20, height: 20, fill: "none", stroke: "#0071e3", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, /*#__PURE__*/React.createElement("path", { d: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" })), /*#__PURE__*/React.createElement("span", {
    style: css('font-size:11px;color:#0071e3;font-weight:700;text-align:center;line-height:1.3;')
  }, s.language === 'es' ? 'Fondo de emergencia' : 'Emergency Fund')), s.goals.length < 6 && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      addGoal();
      dismissTabIntro('metas');
    },
    style: css('background:#fff;border:1.5px dashed #d2d2d7;border-radius:18px;padding:14px 8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;min-height:138px;')
  }, /*#__PURE__*/React.createElement("span", {
    style: css('font-size:22px;color:#0071e3;line-height:1;')
  }, "+"), /*#__PURE__*/React.createElement("span", {
    style: css('font-size:11px;color:#0071e3;font-weight:600;')
  }, "Goal")), showEmergencyFundPicker && /*#__PURE__*/React.createElement("div", {
    onClick: () => setShowEmergencyFundPicker(false),
    className: 'pf-overlay-in',
    style: css('position:fixed;inset:0;z-index:130;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;padding:24px;')
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: 'pf-modal-in',
    style: css('background:#fff;border-radius:20px;padding:22px;max-width:360px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 30px 70px rgba(0,0,0,0.25);')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:17px;font-weight:700;color:#1d1d1f;margin-bottom:4px;')
  }, s.language === 'es' ? 'Fondo de emergencia' : 'Emergency Fund'), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12.5px;color:#86868b;margin-bottom:16px;line-height:1.4;')
  }, s.language === 'es' ? 'Elige cuántos meses de gastos quieres tener guardados. Puedes cambiar el monto después.' : 'Choose how many months of expenses you want saved up. You can change the amount later.'), /*#__PURE__*/React.createElement("div", {
    style: css('background:#f5f5f7;border-radius:14px;padding:14px;margin-bottom:16px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12.5px;font-weight:700;color:#1d1d1f;margin-bottom:2px;')
  }, s.language === 'es' ? '¿Está en una cuenta que genera intereses?' : 'Is it in an interest-earning account?'), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11px;color:#86868b;margin-bottom:10px;line-height:1.35;')
  }, s.language === 'es' ? 'Como una cuenta de ahorro high-yield. Si es así, aparecerá también en Portafolio.' : 'Like a high-yield savings account. If so, it also shows up in Portfolio.'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setEfEarnsInterest(true),
    style: css('flex:1;border-radius:10px;padding:9px;font-size:12.5px;font-weight:700;cursor:pointer;border:' + (efEarnsInterest === true ? '2px solid #0071e3' : '1px solid #d2d2d7') + ';background:' + (efEarnsInterest === true ? '#eef6ff' : '#fff') + ';color:#1d1d1f;')
  }, s.language === 'es' ? 'Sí' : 'Yes'), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setEfEarnsInterest(false);
      setEfApyInput('');
    },
    style: css('flex:1;border-radius:10px;padding:9px;font-size:12.5px;font-weight:700;cursor:pointer;border:' + (efEarnsInterest === false ? '2px solid #0071e3' : '1px solid #d2d2d7') + ';background:' + (efEarnsInterest === false ? '#eef6ff' : '#fff') + ';color:#1d1d1f;')
  }, s.language === 'es' ? 'No' : 'No')), efEarnsInterest === true && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "number", inputMode: "decimal",
    placeholder: s.language === 'es' ? 'Tasa anual (APY), ej. 4.5' : 'Annual rate (APY), e.g. 4.5',
    value: efApyInput,
    onChange: e => setEfApyInput(e.target.value),
    style: css('width:100%;padding:11px 30px 11px 12px;border:1px solid #d2d2d7;border-radius:10px;font-size:14px;background:#fff;')
  }), /*#__PURE__*/React.createElement("span", {
    style: css('position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:14px;color:#86868b;font-weight:600;pointer-events:none;')
  }, "%"))), [{
    months: 3,
    title: s.language === 'es' ? '3 meses' : '3 months',
    desc: s.language === 'es' ? 'Ingreso estable, empleo fijo, pocas personas a cargo, o ya tienes otro respaldo (familia, línea de crédito).' : 'Stable income, fixed job, few dependents, or you already have another safety net (family, credit line).'
  }, {
    months: 6,
    title: s.language === 'es' ? '6 meses' : '6 months',
    desc: s.language === 'es' ? 'Ingreso variable o freelance, eres el único sostén, o tu industria es más volátil.' : 'Variable or freelance income, you’re the sole provider, or your industry is more volatile.'
  }, {
    months: 12,
    title: s.language === 'es' ? '9–12 meses' : '9–12 months',
    desc: s.language === 'es' ? 'Trabajo por cuenta propia con ingresos muy irregulares, o eres el único proveedor con dependientes.' : 'Self-employed with very irregular income, or you’re the sole provider with dependents.'
  }].map(opt => /*#__PURE__*/React.createElement("button", {
    key: opt.months,
    onClick: () => {
      addEmergencyFundGoal(opt.months, efEarnsInterest === true ? parseFloat(efApyInput) || 0 : null);
      setShowEmergencyFundPicker(false);
      setEfEarnsInterest(null);
      setEfApyInput('');
      setShowGoalDetail(true);
    },
    style: css('display:block;width:100%;text-align:left;background:#f5f5f7;border:none;border-radius:14px;padding:14px;margin-bottom:10px;cursor:pointer;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;')
  }, /*#__PURE__*/React.createElement("span", {
    style: css('font-size:14px;font-weight:700;color:#1d1d1f;')
  }, opt.title), /*#__PURE__*/React.createElement("span", {
    style: css('font-size:13px;font-weight:700;color:#0071e3;')
  }, fmt((ctx.totalExpenses > 0 ? ctx.totalExpenses : monthlyIncomeOf(s) * 0.6) * opt.months))), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11.5px;color:#6e6e73;line-height:1.4;')
  }, opt.desc))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowEmergencyFundPicker(false);
      setEfEarnsInterest(null);
      setEfApyInput('');
    },
    style: css('display:block;width:100%;text-align:center;background:none;border:none;color:#86868b;font-size:13px;font-weight:600;cursor:pointer;padding:6px;margin-top:2px;')
  }, s.language === 'es' ? 'Cancelar' : 'Cancel')))), s.goals.length >= 6 && /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12px;color:#86868b;margin:-10px 0 16px;')
  }, "You already have 6 goals — the max. Fewer goals helps you prioritize."), !s.seenTabIntro.metas && /*#__PURE__*/React.createElement("div", {
    className: "tip-banner",
    style: css('display:flex;align-items:center;gap:12px;background:#fff;border-radius:16px;padding:16px 18px;margin-bottom:16px;box-shadow:0 8px 24px rgba(0,0,0,0.10);')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('flex:1;font-size:13px;color:#6e6e73;font-weight:400;line-height:1.3;')
  }, t('tabIntroGoals')), /*#__PURE__*/React.createElement("button", {
    onClick: () => dismissTabIntro('metas'),
    style: css('flex:none;background:#fff;color:#0071e3;border:1.5px solid #d2d2d7;padding:8px 15px;border-radius:9px;font-size:12.5px;font-weight:700;cursor:pointer;')
  }, t('gotIt')))), showGoalDetail && sg && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowGoalDetail(false),
    style: css('display:flex;align-items:center;gap:6px;background:none;border:none;color:#0071e3;font-size:14px;font-weight:600;cursor:pointer;padding:8px 0;margin-bottom:4px;')
  }, /*#__PURE__*/React.createElement("svg", { viewBox: "0 0 24 24", width: 18, height: 18, fill: "none", stroke: "#0071e3", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" }, /*#__PURE__*/React.createElement("path", { d: "M15 18l-6-6 6-6" })), s.language === 'es' ? 'Metas' : 'Goals'), /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border-radius:18px;padding:18px;margin-bottom:14px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:center;gap:12px;margin-bottom:14px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('position:relative;flex:none;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditingGoalMeta(v => !v),
    "aria-label": s.language === 'es' ? 'Editar ícono y color' : 'Edit icon and color',
    style: css('width:40px;height:40px;border-radius:11px;background:' + sgSource.color + ';border:none;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;')
  }, /*#__PURE__*/React.createElement(GoalIconGlyph, {
    icon: sgSource.icon,
    size: 20
  })), editingGoalMeta && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: () => setEditingGoalMeta(false),
    style: css('position:fixed;inset:0;z-index:30;')
  }), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: 'pf-popover-in',
    style: css('position:absolute;top:46px;left:0;z-index:31;background:#fff;border-radius:16px;padding:14px;box-shadow:0 14px 44px rgba(0,0,0,0.20);width:264px;transform-origin:top left;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:grid;grid-template-columns:1fr 1fr;gap:10px;')
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:8px;')
  }, t('color')), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:6px;flex-wrap:wrap;')
  }, PALETTE.concat(MORE_COLORS).map(hex => /*#__PURE__*/React.createElement("button", {
    key: hex,
    onClick: () => setGoalColor(sgSource.id, hex),
    style: {
      width: 22,
      height: 22,
      borderRadius: '50%',
      background: hex,
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      boxShadow: hex === sgSource.color ? '0 0 0 2px #fff, 0 0 0 3px ' + hex : 'none'
    }
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:8px;')
  }, t('icon')), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:6px;flex-wrap:wrap;')
  }, ICONS.concat(MORE_ICONS).map(ic => /*#__PURE__*/React.createElement("button", {
    key: ic.key,
    onClick: () => setGoalIcon(sgSource.id, ic.key),
    style: {
      width: 26,
      height: 26,
      borderRadius: 8,
      background: ic.key === sgSource.icon ? sgSource.color : '#f5f5f7',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "14",
    height: "14",
    fill: "none",
    stroke: ic.key === sgSource.icon ? '#fff' : '#86868b',
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: ic.path
  })))))))))), /*#__PURE__*/React.createElement("div", {
    style: css('flex:1;min-width:0;')
  }, editingGoalName ? /*#__PURE__*/React.createElement("input", {
    type: "text",
    autoFocus: true,
    value: sgSource.name,
    onChange: e => updateGoal(sgSource.id, 'name', e.target.value),
    onBlur: () => setEditingGoalName(false),
    onKeyDown: e => {
      if (e.key === 'Enter') setEditingGoalName(false);
    },
    style: css('width:100%;font-size:16px;font-weight:600;color:#1d1d1f;border:1px solid #d2d2d7;border-radius:9px;padding:7px 9px;background:#fbfbfd;')
  }) : /*#__PURE__*/React.createElement("span", {
    onClick: () => setEditingGoalName(true),
    style: css('display:block;font-size:16px;font-weight:600;color:#1d1d1f;overflow:hidden;cursor:pointer;line-height:1.25;')
  }, sgSource.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowReminderPopup(v => !v),
    style: css('background:#f5f5f7;border:none;padding:6px 12px;border-radius:8px;font-size:11.5px;font-weight:600;color:#1d1d1f;cursor:pointer;white-space:nowrap;')
  }, sgSource.reminderOn ? s.language === 'es' ? 'Día ' + sgSource.reminderDay : 'Day ' + sgSource.reminderDay : t('setReminder')), showReminderPopup && /*#__PURE__*/React.createElement("div", {
    className: 'pf-popover-in',
    style: css('position:absolute;top:34px;right:0;z-index:20;background:#fff;border-radius:12px;padding:12px;box-shadow:0 12px 30px rgba(0,0,0,0.18);width:200px;transform-origin:top right;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:center;gap:6px;font-size:11.5px;color:#86868b;margin-bottom:12px;')
  }, /*#__PURE__*/React.createElement("span", null, s.language === 'es' ? 'día' : 'day'), /*#__PURE__*/React.createElement("input", {
    type: "number", inputMode: "decimal",
    min: "1",
    max: "31",
    value: sgSource.reminderDay || '',
    onChange: e => updateGoal(sgSource.id, 'reminderDay', Math.max(1, Math.min(31, parseInt(e.target.value, 10) || 1))),
    style: css('width:44px;padding:5px 6px;border:1px solid #e5e5ea;border-radius:7px;font-size:12px;background:#fbfbfd;')
  }), /*#__PURE__*/React.createElement("span", null, s.language === 'es' ? 'de cada mes' : 'of each month')), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;')
  }, /*#__PURE__*/React.createElement("span", {
    style: css('font-size:12px;color:#1d1d1f;font-weight:600;')
  }, sgSource.reminderOn ? t('on') : t('off')), /*#__PURE__*/React.createElement("button", {
    onClick: () => toggleReminder(sgSource.id),
    style: {
      width: 40,
      height: 23,
      borderRadius: 12,
      background: sgSource.reminderOn ? '#0071e3' : '#e5e5ea',
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: sgSource.reminderOn ? 19 : 2,
      width: 19,
      height: 19,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.25)'
    }
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowReminderPopup(false),
    style: css('width:100%;background:#0071e3;color:#fff;border:none;padding:8px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;')
  }, t('done'))))), sgSource.isRetirementGoal && /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11.5px;color:#6e6e73;background:#f7faff;border:1px solid #e4eefb;border-radius:12px;padding:10px 12px;margin-bottom:12px;line-height:1.4;')
  }, t('retireNote')), /*#__PURE__*/React.createElement("div", {
    style: css('display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border:1px solid #f0f0f2;border-radius:14px;padding:12px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;justify-content:space-between;align-items:center;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;')
  }, t('target')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditingTarget(v => !v),
    style: css('background:none;border:none;color:#0071e3;font-size:10px;font-weight:700;cursor:pointer;padding:0;')
  }, editingTarget ? t('done') : t('edit'))), editingTarget ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: css('position:absolute;left:8px;top:50%;transform:translateY(-50%);font-size:14px;color:#86868b;pointer-events:none;')
  }, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number", inputMode: "decimal",
    autoFocus: true,
    value: sgSource.target || '',
    onChange: e => updateGoal(sgSource.id, 'target', parseFloat(e.target.value) || 0),
    onKeyDown: e => {
      if (e.key === 'Enter') setEditingTarget(false);
    },
    style: css('width:100%;padding:6px 8px 6px 18px;border:1px solid #e5e5ea;border-radius:8px;font-size:15px;font-weight:700;background:#fbfbfd;')
  })) : /*#__PURE__*/React.createElement("div", {
    style: css('font-size:16px;font-weight:700;color:#1d1d1f;margin-top:3px;')
  }, fmt(sgSource.target))), /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border:1px solid #f0f0f2;border-radius:14px;padding:12px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;justify-content:space-between;align-items:center;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;')
  }, t('current')), !s.investments.some(i => i.goalId === sgSource.id) && /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditingCurrent(v => !v),
    style: css('background:none;border:none;color:#0071e3;font-size:10px;font-weight:700;cursor:pointer;padding:0;')
  }, editingCurrent ? t('done') : t('edit'))), editingCurrent && !s.investments.some(i => i.goalId === sgSource.id) ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: css('position:absolute;left:8px;top:50%;transform:translateY(-50%);font-size:14px;color:#86868b;pointer-events:none;')
  }, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number", inputMode: "decimal",
    autoFocus: true,
    value: sgSource.current || '',
    onChange: e => updateGoal(sgSource.id, 'current', parseFloat(e.target.value) || 0),
    onKeyDown: e => {
      if (e.key === 'Enter') setEditingCurrent(false);
    },
    style: css('width:100%;padding:6px 8px 6px 18px;border:1px solid #e5e5ea;border-radius:8px;font-size:15px;font-weight:700;background:#fbfbfd;')
  })) : /*#__PURE__*/React.createElement("div", {
    style: css('font-size:16px;font-weight:700;color:#1d1d1f;margin-top:3px;')
  }, fmt(sg.current)))), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:12px;align-items:center;margin-bottom:10px;flex-wrap:wrap;')
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 120px',
      minWidth: 120,
      order: 2
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: css('display:block;font-size:10.5px;color:#86868b;font-weight:600;margin-bottom:5px;')
  }, t('logSavings')), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: css('position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:14px;color:#86868b;pointer-events:none;')
  }, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number", inputMode: "decimal",
    placeholder: "0",
    value: depositAmount,
    onChange: e => setDepositAmount(e.target.value),
    style: css('width:100%;padding:10px 10px 10px 22px;border:1px solid #e5e5ea;border-radius:10px;font-size:15px;background:#fbfbfd;')
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => registerDeposit(sgSource.id),
    style: css('width:100%;background:#0071e3;color:#fff;border:none;padding:12px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;')
  }, t('log')), (() => {
    const now = new Date();
    const skipped = (sgSource.skippedMonths || []).some(sm => sm.year === now.getFullYear() && sm.month === now.getMonth());
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => toggleSkipMonth(sgSource.id, now.getFullYear(), now.getMonth()),
      style: css('width:100%;background:none;border:none;color:' + (skipped ? '#ff9500' : '#86868b') + ';font-size:11px;font-weight:600;cursor:pointer;margin-top:6px;padding:4px;')
    }, skipped ? s.language === 'es' ? '↩ Deshacer — sí voy a depositar' : "↩ Undo — I'll deposit after all" : s.language === 'es' ? 'No voy a depositar este mes' : "I won't deposit this month");
  })()), (() => {
    const now = new Date();
    const monthEntries = (sgSource.savingsLog || []).filter(entry => {
      const p = parseMonthYearLabel(entry.label);
      return p.year === now.getFullYear() && p.month === now.getMonth();
    });
    const extrasLogged = monthEntries.filter(e => e.label.includes(' — ')).reduce((a, e) => a + e.amount, 0);
    const salaryLogged = monthEntries.filter(e => !e.label.includes(' — ')).reduce((a, e) => a + e.amount, 0);
    const salaryMonthlyTarget = Math.max(ctx.baseAvailable, 0) * (sg.percent / 100);
    const extrasMonthlyTarget = ctx.assignedByGoal[sgSource.id] || 0;
    const hasExtras = extrasMonthlyTarget > 0;
    const salaryPct = salaryMonthlyTarget > 0 ? Math.min(100, salaryLogged / salaryMonthlyTarget * 100) : salaryLogged > 0 ? 100 : 0;
    const extrasPct = extrasMonthlyTarget > 0 ? Math.min(100, extrasLogged / extrasMonthlyTarget * 100) : extrasLogged > 0 ? 100 : 0;
    const R1 = 16,
      R2 = 27,
      C1 = 2 * Math.PI * R1,
      C2 = 2 * Math.PI * R2;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        flex: '1 1 150px',
        minWidth: 150,
        order: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 64 64",
      width: "56",
      height: "56",
      style: {
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "32",
      cy: "32",
      r: R1,
      fill: "none",
      stroke: "#f0f0f2",
      strokeWidth: "5"
    }), hasExtras && /*#__PURE__*/React.createElement("circle", {
      cx: "32",
      cy: "32",
      r: R2,
      fill: "none",
      stroke: "#f0f0f2",
      strokeWidth: "5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "32",
      cy: "32",
      r: R1,
      fill: "none",
      stroke: sgSource.color,
      strokeWidth: "5",
      strokeLinecap: "round",
      strokeDasharray: C1,
      strokeDashoffset: C1 * (1 - salaryPct / 100),
      transform: "rotate(-90 32 32)"
    }), hasExtras && /*#__PURE__*/React.createElement("circle", {
      cx: "32",
      cy: "32",
      r: R2,
      fill: "none",
      stroke: "#34c759",
      strokeWidth: "5",
      strokeLinecap: "round",
      strokeDasharray: C2,
      strokeDashoffset: C2 * (1 - extrasPct / 100),
      transform: "rotate(-90 32 32)"
    })), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:10px;color:#86868b;line-height:1.4;text-align:center;')
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 800,
        color: sgSource.color
      }
    }, salaryPct.toFixed(0), "%"), " savings monthly"), hasExtras && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 800,
        color: '#34c759'
      }
    }, extrasPct.toFixed(0), "%"), " extras")));
  })()), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('savingsLog'),
    style: css('display:flex;align-items:center;justify-content:space-between;background:none;border:none;border-top:1px solid #eef0f2;border-bottom:1px solid #eef0f2;border-radius:0;padding:16px 2px;cursor:pointer;width:100%;margin-top:16px;')
  }, /*#__PURE__*/React.createElement("span", {
    style: css('font-size:13.5px;font-weight:700;color:#1d1d1f;')
  }, t('savingsLogged')), /*#__PURE__*/React.createElement("span", {
    style: css('display:flex;align-items:center;gap:6px;')
  }, /*#__PURE__*/React.createElement("span", {
    style: css('font-size:12px;color:#86868b;')
  }, (sgSource.savingsLog || []).length), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "15",
    height: "15",
    fill: "none",
    stroke: "#c7c7cc",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 18l6-6-6-6"
  })))), /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border-radius:16px;padding:16px;margin-top:16px;')
  }, (() => {
    const curY = ctx.today.getFullYear(),
      curM = ctx.today.getMonth();
    const cYear = typeof sgSource.createdYear === 'number' ? sgSource.createdYear : curY;
    const cMonth = typeof sgSource.createdMonth === 'number' ? sgSource.createdMonth : curM;
    const monthsList = [];
    for (let m = 0; m <= 11; m++) {
      const isFuture = m > curM;
      const beforeCreation = cYear < curY ? false : m < cMonth;
      monthsList.push({
        year: curY,
        month: m,
        isFuture,
        beforeCreation,
        inactive: isFuture || beforeCreation
      });
    }
    return /*#__PURE__*/React.createElement("div", {
      ref: monthStripRef,
      style: css('display:flex;gap:12px;overflow-x:auto;padding-bottom:4px;-webkit-overflow-scrolling:touch;scroll-snap-type:x mandatory;')
    }, monthsList.map((mo, idx) => {
      const monthActual = (sgSource.savingsLog || []).filter(e => {
        const p = parseMonthYearLabel(e.label);
        return p.year === mo.year && p.month === mo.month;
      }).reduce((a, e) => a + e.amount, 0);
      const skipped = (sgSource.skippedMonths || []).some(sm => sm.year === mo.year && sm.month === mo.month);
      const target = sg.monthlyBoosted;
      const pct = target > 0 ? Math.min(100, monthActual / target * 100) : monthActual > 0 ? 100 : 0;
      const done = pct >= 100;
      const isCurrent = !mo.inactive && mo.year === curY && mo.month === curM;
      const R2 = 15,
        C2 = 2 * Math.PI * R2;
      return /*#__PURE__*/React.createElement("div", {
        key: idx,
        "data-current": isCurrent ? 'true' : undefined,
        style: {
          flex: '0 0 44px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          scrollSnapAlign: 'start'
        }
      }, /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 36 36",
        width: "35",
        height: "35"
      }, /*#__PURE__*/React.createElement("circle", {
        cx: "18",
        cy: "18",
        r: R2,
        fill: "none",
        stroke: "#f0f0f2",
        strokeWidth: "3.5"
      }), mo.inactive ? null : skipped ? /*#__PURE__*/React.createElement("path", {
        d: "M12 18h12",
        fill: "none",
        stroke: "#ff9500",
        strokeWidth: "3",
        strokeLinecap: "round"
      }) : /*#__PURE__*/React.createElement(React.Fragment, null, pct > 0 && /*#__PURE__*/React.createElement("circle", {
        cx: "18",
        cy: "18",
        r: R2,
        fill: "none",
        stroke: sgSource.color,
        strokeWidth: "3.5",
        strokeLinecap: "round",
        strokeDasharray: C2,
        strokeDashoffset: C2 * (1 - pct / 100),
        transform: "rotate(-90 18 18)"
      }), done && /*#__PURE__*/React.createElement("path", {
        d: "M11.5 18.5l4 4 9-9",
        fill: "none",
        stroke: sgSource.color,
        strokeWidth: "3",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }))), /*#__PURE__*/React.createElement("span", {
        style: css('font-size:9px;white-space:nowrap;color:' + (mo.inactive ? '#c7c7cc' : isCurrent ? '#0071e3' : '#86868b') + (isCurrent ? ';font-weight:700' : '') + ';')
      }, MONTH_NAMES[mo.month]));
    }));
  })()), /*#__PURE__*/React.createElement("div", {
    style: css('display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px;margin-bottom:16px;align-items:stretch;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border:1px solid #f0f0f2;border-radius:14px;padding:14px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;')
  }, /*#__PURE__*/React.createElement("label", {
    style: css('font-size:11.5px;color:#86868b;font-weight:600;')
  }, "% of monthly savings"), /*#__PURE__*/React.createElement("button", {
    onClick: () => toggleGoalMode(sgSource.id),
    style: css('background:#f5f5f7;border:none;padding:4px 9px;border-radius:8px;font-size:10.5px;font-weight:600;color:#1d1d1f;cursor:pointer;')
  }, sgSource.mode === 'manual' ? 'Manual' : 'Auto')), sgSource.mode === 'manual' ? /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:baseline;gap:5px;font-size:15px;color:#1d1d1f;font-weight:700;')
  }, /*#__PURE__*/React.createElement("input", {
    type: "number", inputMode: "decimal",
    min: "0",
    max: "100",
    value: sgSource.percent || '',
    onChange: e => updateGoal(sgSource.id, 'percent', Math.max(0, Math.min(100, parseFloat(e.target.value) || 0))),
    style: css('width:42px;padding:2px 3px;border:none;border-bottom:1.5px solid #0071e3;font-size:15px;font-weight:700;color:#1d1d1f;background:transparent;text-align:center;')
  }), /*#__PURE__*/React.createElement("span", { style: css('font-size:13px;color:#86868b;font-weight:600;') }, "% → ", sg.monthlyLabel, "/mo")) : /*#__PURE__*/React.createElement("div", {
    style: css('font-size:15px;font-weight:700;color:#1d1d1f;')
  }, sg.percentLabel, /*#__PURE__*/React.createElement("span", { style: css('font-size:13px;color:#86868b;font-weight:600;') }, " → ", sg.monthlyLabel, "/mo")), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11.5px;color:#6e6e73;margin-top:10px;padding-top:10px;border-top:1px solid #f5f5f7;')
  }, "You'll reach your goal in ", /*#__PURE__*/React.createElement("b", {
    style: css('color:#1d1d1f;')
  }, sg.estDateLabel), " (", sg.monthsLabel, ")")), /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border:1px solid #f0f0f2;border-radius:14px;padding:14px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12.5px;font-weight:700;color:#1d1d1f;margin-bottom:10px;')
  }, t('hitDate')), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: sgSource.customDate || '',
    onChange: e => updateGoal(sgSource.id, 'customDate', e.target.value),
    style: css('width:88%;padding:6px 6px;border:1px solid #e5e5ea;border-radius:8px;font-size:11px;background:#fbfbfd;')
  }), sgSource.customDate && sg.customMsg && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: sg.customMsgColor,
      fontWeight: 600,
      marginTop: 8,
      lineHeight: 1.35
    }
  }, sg.customMsg), !sgSource.customDate && /*#__PURE__*/React.createElement("div", {
    style: css('margin-top:10px;padding-top:10px;border-top:1px solid #f5f5f7;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10.5px;color:#86868b;margin-bottom:8px;line-height:1.3;')
  }, t('horizonHint')), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;flex-direction:column;gap:6px;')
  }, [['short', 'horizonShort'], ['medium', 'horizonMedium'], ['long', 'horizonLong']].map(function (opt) {
    var val = opt[0];
    var sel = sgSource.horizon === val;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      onClick: function () {
        updateGoal(sgSource.id, 'horizon', sel ? null : val);
      },
      style: {
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '8px 10px',
        borderRadius: 9,
        border: sel ? '1.5px solid #0071e3' : '1px solid #e5e5ea',
        background: sel ? '#eef6ff' : '#fff',
        fontSize: 11.5,
        fontWeight: 600,
        color: '#1d1d1f',
        cursor: 'pointer'
      }
    }, t(opt[1]));
  }))))), false && /*#__PURE__*/React.createElement("div", {
    style: css('display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border:1px solid #f0f0f2;border-radius:14px;padding:12px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:8px;')
  }, t('color')), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:6px;flex-wrap:wrap;align-items:center;')
  }, PALETTE.map(hex => /*#__PURE__*/React.createElement("button", {
    key: hex,
    onClick: () => setGoalColor(sgSource.id, hex),
    style: {
      width: 22,
      height: 22,
      borderRadius: '50%',
      background: hex,
      border: 'none',
      cursor: 'pointer',
      boxShadow: hex === sgSource.color ? '0 0 0 2px #fff, 0 0 0 3px ' + hex : 'none'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowColorPopup(v => !v),
    style: css('width:22px;height:22px;border-radius:50%;background:#f5f5f7;border:1px dashed #c7c7cc;display:flex;align-items:center;justify-content:center;font-size:13px;color:#86868b;cursor:pointer;padding:0;')
  }, "+"), showColorPopup && /*#__PURE__*/React.createElement("div", {
    className: 'pf-popover-in',
    style: css('position:absolute;top:28px;left:0;z-index:20;background:#fff;border-radius:12px;padding:10px;box-shadow:0 12px 30px rgba(0,0,0,0.18);display:flex;gap:6px;flex-wrap:wrap;width:112px;transform-origin:top left;')
  }, MORE_COLORS.map(hex => /*#__PURE__*/React.createElement("button", {
    key: hex,
    onClick: () => {
      setGoalColor(sgSource.id, hex);
      setShowColorPopup(false);
    },
    style: {
      width: 22,
      height: 22,
      borderRadius: '50%',
      background: hex,
      border: 'none',
      cursor: 'pointer',
      boxShadow: hex === sgSource.color ? '0 0 0 2px #fff, 0 0 0 3px ' + hex : 'none'
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border:1px solid #f0f0f2;border-radius:14px;padding:12px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:8px;')
  }, t('icon')), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:6px;flex-wrap:wrap;align-items:center;')
  }, ICONS.map(ic => /*#__PURE__*/React.createElement("button", {
    key: ic.key,
    onClick: () => setGoalIcon(sgSource.id, ic.key),
    style: {
      width: 26,
      height: 26,
      borderRadius: 8,
      background: ic.key === sgSource.icon ? sgSource.color : '#f5f5f7',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "14",
    height: "14",
    fill: "none",
    stroke: ic.key === sgSource.icon ? '#fff' : '#86868b',
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: ic.path
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowIconPopup(v => !v),
    style: css('width:26px;height:26px;border-radius:8px;background:#f5f5f7;border:1px dashed #c7c7cc;cursor:pointer;font-size:13px;color:#86868b;display:flex;align-items:center;justify-content:center;padding:0;')
  }, "+"), showIconPopup && /*#__PURE__*/React.createElement("div", {
    className: 'pf-popover-in',
    style: css('position:absolute;top:32px;left:0;z-index:20;background:#fff;border-radius:12px;padding:10px;box-shadow:0 12px 30px rgba(0,0,0,0.18);display:flex;gap:6px;flex-wrap:wrap;width:130px;transform-origin:top left;')
  }, MORE_ICONS.map(ic => /*#__PURE__*/React.createElement("button", {
    key: ic.key,
    onClick: () => {
      setGoalIcon(sgSource.id, ic.key);
      setShowIconPopup(false);
    },
    style: {
      width: 26,
      height: 26,
      borderRadius: 8,
      background: ic.key === sgSource.icon ? sgSource.color : '#f5f5f7',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "14",
    height: "14",
    fill: "none",
    stroke: ic.key === sgSource.icon ? '#fff' : '#86868b',
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: ic.path
  }))))))))), /*#__PURE__*/React.createElement("div", {
    style: css('border-top:1px solid #f0f0f2;margin-top:6px;')
  }), /*#__PURE__*/React.createElement("div", {
    style: css('border-top:1px solid #f0f0f2;margin-top:14px;padding-top:14px;')
  }, /*#__PURE__*/React.createElement("label", {
    style: css('display:block;font-size:11.5px;color:#86868b;font-weight:600;margin-bottom:10px;')
  }, t('savingsProjection')), (() => {
    const capVal = sgSource.target > 0 ? sgSource.target * 1.05 : 1;
    const createdY = typeof sgSource.createdYear === 'number' ? sgSource.createdYear : ctx.today.getFullYear();
    const createdM = typeof sgSource.createdMonth === 'number' ? sgSource.createdMonth : ctx.today.getMonth();
    const curY = ctx.today.getFullYear(),
      curM = ctx.today.getMonth();
    const monthsElapsed = Math.max((curY - createdY) * 12 + (curM - createdM), 0);
    const N_future = 12;
    const totalMonths = monthsElapsed + N_future;
    const actualSeries = [];
    for (let i = 0; i <= monthsElapsed; i++) {
      actualSeries.push(monthsElapsed > 0 ? sg.current * i / monthsElapsed : sg.current);
    }
    const projSeries = [];
    for (let i = 0; i <= N_future; i++) {
      projSeries.push(Math.min(sg.current + sg.monthlyBoosted * i, capVal));
    }
    const maxY = Math.max(capVal, Math.max(...actualSeries, 0), Math.max(...projSeries, 0), 1);
    const W = 300,
      H = 130,
      padL = 4,
      padR = 4,
      padT = 16,
      padB = 6;
    const xAt = i => padL + (totalMonths > 0 ? i / totalMonths : 0) * (W - padL - padR);
    const yAt = v => padT + (1 - v / maxY) * (H - padT - padB);
    const actualPoints = actualSeries.map((v, i) => xAt(i).toFixed(1) + ',' + yAt(v).toFixed(1)).join(' ');
    const projPoints = projSeries.map((v, i) => xAt(monthsElapsed + i).toFixed(1) + ',' + yAt(v).toFixed(1)).join(' ');
    const targetY = yAt(Math.min(sgSource.target, capVal));
    const todayX = xAt(monthsElapsed);
    const createdLabel = MONTH_NAMES[createdM] + ' ' + createdY;
    const endDate = addMonths(ctx.today, N_future);
    const endLabel = MONTH_NAMES[endDate.getMonth()] + ' ' + endDate.getFullYear();
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;justify-content:space-between;font-size:9.5px;color:#86868b;margin-bottom:2px;')
    }, /*#__PURE__*/React.createElement("span", null, fmt(maxY)), /*#__PURE__*/React.createElement("span", null, s.language === 'es' ? 'dinero ahorrado' : 'money saved')), /*#__PURE__*/React.createElement("svg", {
      viewBox: '0 0 ' + W + ' ' + H,
      width: "100%",
      height: "130",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("line", {
      x1: padL,
      x2: W - padR,
      y1: padT,
      y2: padT,
      stroke: "#f0f0f2",
      strokeWidth: "1"
    }), /*#__PURE__*/React.createElement("line", {
      x1: padL,
      x2: W - padR,
      y1: H - padB,
      y2: H - padB,
      stroke: "#f0f0f2",
      strokeWidth: "1"
    }), sgSource.target > 0 && sgSource.target <= capVal && /*#__PURE__*/React.createElement("line", {
      x1: padL,
      x2: W - padR,
      y1: targetY,
      y2: targetY,
      stroke: "#c7c7cc",
      strokeWidth: "1",
      strokeDasharray: "3,3"
    }), /*#__PURE__*/React.createElement("line", {
      x1: todayX,
      x2: todayX,
      y1: padT,
      y2: H - padB,
      stroke: "#e5e5ea",
      strokeWidth: "1",
      strokeDasharray: "2,2"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: projPoints,
      fill: "none",
      stroke: sgSource.color,
      strokeOpacity: "0.22",
      strokeWidth: "3",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: actualPoints,
      fill: "none",
      stroke: sgSource.color,
      strokeWidth: "3",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: todayX,
      cy: yAt(sg.current),
      r: "3.5",
      fill: sgSource.color
    })), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;justify-content:space-between;font-size:9.5px;color:#86868b;margin-top:2px;')
    }, /*#__PURE__*/React.createElement("span", null, fmt(0))), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;justify-content:space-between;font-size:10px;color:#86868b;margin-top:6px;')
    }, /*#__PURE__*/React.createElement("span", null, createdLabel), /*#__PURE__*/React.createElement("span", {
      style: css('font-weight:700;color:' + sgSource.color + ';')
    }, s.language === 'es' ? 'hoy' : 'today'), /*#__PURE__*/React.createElement("span", null, endLabel)));
  })(), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:16px;font-size:11.5px;color:#6e6e73;margin-top:10px;')
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 10,
      height: 10,
      borderRadius: 2,
      background: sgSource.color,
      marginRight: 5
    }
  }), s.language === 'es' ? 'Ya ahorrado' : 'Already saved'), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 10,
      height: 10,
      borderRadius: 2,
      background: sgSource.color,
      opacity: 0.3,
      marginRight: 5
    }
  }), s.language === 'es' ? 'Proyección' : 'Projected')))), /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border-radius:18px;padding:16px;margin-top:14px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => askConfirm(s.language === 'es' ? '¿Eliminar esta meta? Se perderá el progreso guardado y su historial.' : "Delete this goal? Its saved progress and history will be lost.", () => {
      patch(st => {
        const goals = st.goals.filter(g => g.id !== sgSource.id);
        return { goals, selectedGoalId: goals[0] ? goals[0].id : null };
      });
      setShowGoalDetail(false);
    }),
    style: css('width:100%;background:#fff2ef;color:#ff3b30;border:none;border-radius:12px;padding:13px;font-size:13.5px;font-weight:700;cursor:pointer;')
  }, s.language === 'es' ? 'Eliminar meta' : 'Delete goal')))), s.tab === 'gastos' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:center;gap:10px;margin-bottom:16px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:22px;font-weight:700;letter-spacing:-0.01em;')
  }, "Expenses", /*#__PURE__*/React.createElement(InfoTip, {
    text: "Tap a day to view or log expenses. Tap the month to see the full summary."
  }))), !showDayLog && /*#__PURE__*/React.createElement("div", {
    ref: expensesCalRef,
    style: css('background:#fff;border-radius:16px;padding:16px;margin-bottom:14px;box-sizing:border-box;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: calPrevMonth,
    style: css('background:#f5f5f7;border:none;width:30px;height:30px;border-radius:9px;font-size:15px;cursor:pointer;color:#1d1d1f;')
  }, "‹"), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:15px;font-weight:700;color:#1d1d1f;')
  }, MONTH_NAMES[s.logMonth], " ", s.logYear), /*#__PURE__*/React.createElement("button", {
    onClick: calNextMonth,
    style: css('background:#f5f5f7;border:none;width:30px;height:30px;border-radius:9px;font-size:15px;cursor:pointer;color:#1d1d1f;')
  }, "›")), /*#__PURE__*/React.createElement("div", {
    style: css('display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:4px;')
  }, WEEKDAY_NAMES.map((w, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: css('text-align:center;font-size:10.5px;color:#86868b;font-weight:600;padding:4px 0;')
  }, w))), calendarWeeks.map((week, wi) => /*#__PURE__*/React.createElement("div", {
    key: wi,
    style: css('display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:4px;')
  }, week.map((day, di) => {
    if (!day) return /*#__PURE__*/React.createElement("div", {
      key: di
    });
    const ds = toDateStr(s.logYear, s.logMonth, day);
    const isSelected = ds === selectedDate;
    const isToday = ds === todayStr;
    const dayColors = (colorsByDate[ds] || []).slice(0, 4);
    return /*#__PURE__*/React.createElement("button", {
      key: di,
      onClick: () => {
        setSelectedDate(ds);
        setShowDayLog(true);
        if (logType === 'recurring') fillRecurringAmount(logCategory || s.expenseCategories[0] && s.expenseCategories[0].name || '', s);
      },
      style: {
        background: isSelected ? '#0071e3' : '#f5f5f7',
        color: isSelected ? '#fff' : '#1d1d1f',
        border: isToday && !isSelected ? '1.5px solid #0071e3' : 'none',
        borderRadius: 10,
        padding: '6px 2px 5px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        minHeight: 40
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: isToday ? 700 : 500
      }
    }, day), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 2,
        height: 5
      }
    }, dayColors.map((c, ci) => /*#__PURE__*/React.createElement("span", {
      key: ci,
      style: {
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: isSelected ? '#fff' : c
      }
    }))));
  })))), !s.seenTabIntro.gastos && /*#__PURE__*/React.createElement("div", {
    className: "tip-banner",
    style: css('display:flex;align-items:center;gap:12px;background:#fff;border-radius:16px;padding:16px 18px;margin-bottom:16px;box-shadow:0 8px 24px rgba(0,0,0,0.10);')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('flex:1;font-size:13px;color:#6e6e73;font-weight:400;line-height:1.3;')
  }, t('tabIntroExpenses')), /*#__PURE__*/React.createElement("button", {
    onClick: () => dismissTabIntro('gastos'),
    style: css('flex:none;background:#fff;color:#0071e3;border:1.5px solid #d2d2d7;padding:8px 15px;border-radius:9px;font-size:12.5px;font-weight:700;cursor:pointer;')
  }, t('gotIt'))), showDayLog && selectedDate && /*#__PURE__*/React.createElement("div", {
    style: Object.assign(css('display:flex;flex-direction:column;background:#fff;border-radius:16px;padding:18px;margin-bottom:14px;box-sizing:border-box;'), expensesCalH ? { minHeight: expensesCalH } : {})
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowDayLog(false),
    style: css('display:flex;align-items:center;gap:6px;background:none;border:none;color:#0071e3;font-size:13.5px;font-weight:600;cursor:pointer;padding:0 0 12px;align-self:flex-start;')
  }, /*#__PURE__*/React.createElement("svg", { viewBox: "0 0 24 24", width: 16, height: 16, fill: "none", stroke: "#0071e3", strokeWidth: 2.3, strokeLinecap: "round", strokeLinejoin: "round" }, /*#__PURE__*/React.createElement("path", { d: "M15 18l-6-6 6-6" })), s.language === 'es' ? 'Calendario' : 'Calendar'), (() => {
    const d = new Date(selectedDate + 'T00:00:00');
    const wd = (s.language === 'es' ? ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])[d.getDay()];
    return /*#__PURE__*/React.createElement("div", {
      style: css('margin-bottom:18px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:3px;')
    }, wd), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:26px;font-weight:800;color:#1d1d1f;letter-spacing:-0.02em;')
    }, MONTH_NAMES[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear()));
  })(), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: css('display:block;font-size:11.5px;color:#86868b;font-weight:600;margin-bottom:8px;')
  }, s.language === 'es' ? 'Registrar un gasto para este día' : 'Log an expense for this day'), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;margin-bottom:10px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setLogType('recurring');
      fillRecurringAmount(logCategory || s.expenseCategories[0] && s.expenseCategories[0].name || '', s);
    },
    style: {
      flex: 1,
      background: logType === 'recurring' ? '#0071e3' : '#f5f5f7',
      color: logType === 'recurring' ? '#fff' : '#1d1d1f',
      border: 'none',
      padding: 11,
      borderRadius: 10,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, s.language === 'es' ? 'Recurrente' : 'Recurring'), /*#__PURE__*/React.createElement("button", {
    onClick: () => setLogType('nonrecurring'),
    style: {
      flex: 1,
      background: logType !== 'recurring' ? '#0071e3' : '#f5f5f7',
      color: logType !== 'recurring' ? '#fff' : '#1d1d1f',
      border: 'none',
      padding: 11,
      borderRadius: 10,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, s.language === 'es' ? 'No recurrente' : 'Non-recurring')), logType === 'recurring' ? /*#__PURE__*/React.createElement("select", {
    value: effectiveLogCategory,
    onChange: e => {
      setLogCategory(e.target.value);
      fillRecurringAmount(e.target.value, s);
    },
    style: css('width:100%;padding:11px 12px;border:1px solid #e5e5ea;border-radius:11px;font-size:13.5px;background:#fbfbfd;margin-bottom:10px;')
  }, recurringCategoryOptions.map((n, i) => /*#__PURE__*/React.createElement("option", {
    key: i,
    value: n
  }, n))) : /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: s.language === 'es' ? 'Nombre del gasto (ej. reparación, regalo)' : 'Expense name (e.g. repair, gift)',
    value: logName,
    onChange: e => setLogName(e.target.value),
    style: css('width:100%;padding:11px 12px;border:1px solid #e5e5ea;border-radius:11px;font-size:13.5px;background:#fbfbfd;margin-bottom:10px;')
  }), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: css('position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:15px;color:#86868b;pointer-events:none;')
  }, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number", inputMode: "decimal",
    placeholder: s.language === 'es' ? 'Monto gastado' : 'Amount spent',
    value: logAmount,
    onChange: e => {
      setLogAmount(e.target.value);
      dismissTabIntro('gastos');
    },
    style: css('width:100%;padding:12px 12px 12px 26px;border:1px solid #e5e5ea;border-radius:11px;font-size:15px;font-weight:700;background:#fbfbfd;')
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      addLogEntry();
      setShowDayLog(false);
    },
    style: css('flex:none;background:#0071e3;color:#fff;border:none;padding:12px 20px;border-radius:11px;font-size:14px;font-weight:700;cursor:pointer;')
  }, t('log')))), /*#__PURE__*/React.createElement("div", {
    style: css('margin-top:18px;border-top:1px solid #f0f0f2;padding-top:14px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11.5px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:10px;')
  }, s.language === 'es' ? 'Registrado este día' : 'Logged this day'), selectedDayActualEntries.length === 0 && selectedDayPlannedEntries.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12.5px;color:#86868b;')
  }, s.language === 'es' ? 'Nada registrado en este día aún.' : "Nothing logged for this day yet."), selectedDayActualEntries.map(entry => /*#__PURE__*/React.createElement("div", {
    key: entry.id,
    style: css('display:flex;justify-content:space-between;align-items:center;font-size:13px;padding:8px 0;border-bottom:1px solid #f0f0f2;')
  }, /*#__PURE__*/React.createElement("span", null, entry.name || 'Expense', /*#__PURE__*/React.createElement("span", {
    style: css('color:#86868b;font-size:11px;')
  }, " · ", entry.recurring ? 'recurring' : 'non-recurring', " · spent")), /*#__PURE__*/React.createElement("span", {
    style: css('display:flex;align-items:center;gap:8px;')
  }, fmt(entry.amount), /*#__PURE__*/React.createElement("button", {
    onClick: () => removeLogEntry(entry.id),
    style: css('background:none;border:none;color:#ff3b30;cursor:pointer;font-size:14px;')
  }, "×")))), selectedDayPlannedEntries.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: css('display:flex;justify-content:space-between;align-items:center;font-size:13px;padding:8px 0;border-bottom:1px solid #f0f0f2;')
  }, /*#__PURE__*/React.createElement("span", null, p.name, /*#__PURE__*/React.createElement("span", {
    style: css('color:#0071e3;font-size:11px;')
  }, " · planned")), /*#__PURE__*/React.createElement("span", {
    style: css('display:flex;align-items:center;gap:8px;')
  }, fmt(p.amount), /*#__PURE__*/React.createElement("button", {
    onClick: () => markPlannedAsSpent(p.id),
    style: css('background:#f0f0f2;border:none;color:#1d1d1f;border-radius:7px;padding:4px 8px;font-size:11px;font-weight:600;cursor:pointer;')
  }, "Already spent"), /*#__PURE__*/React.createElement("button", {
    onClick: () => removePlannedExpense(p.id),
    style: css('background:none;border:none;color:#ff3b30;cursor:pointer;font-size:14px;')
  }, "×")))))), /*#__PURE__*/React.createElement("button", {
    onClick: function(){ setTab('budgetPlan'); },
    style: css('width:100%;background:#0071e3;color:#fff;border:none;padding:12px;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:14px;')
  }, s.language==='es'?'Plan de presupuesto':'Budget plan'), true && /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border-radius:16px;padding:16px;margin-bottom:14px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:4px;')
  }, "Expense summary — ", MONTH_NAMES[s.logMonth], " ", s.logYear), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12.5px;color:#86868b;margin-bottom:12px;')
  }, "Comparison between what you planned and what you actually spent (everything included)."), /*#__PURE__*/React.createElement("div", {
    style: css('margin-bottom:12px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 13,
      marginBottom: 6,
      color: pctColor(resumenTotalPct)
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, "Total spent"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, fmt(resumenActualTotalNum)), " / ", fmt(resumenPlannedTotalNum))), /*#__PURE__*/React.createElement("div", {
    style: css('height:8px;border-radius:4px;background:#f0f0f2;overflow:hidden;')
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      borderRadius: 4,
      background: pctGradient(resumenTotalPct),
      width: Math.min(resumenTotalPct, 100).toFixed(1) + '%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: pctColor(resumenTotalPct),
      marginTop: 4
    }
  }, resumenTotalPct.toFixed(0), "% of budget", resumenTotalPct > 100 ? ' — over budget' : ' · ' + fmt(resumenPlannedTotalNum - resumenActualTotalNum) + ' left over so far')), fixedResumenRows.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: css('display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px;margin-bottom:14px;')
  }, fixedResumenRows.map((cr, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: '#fff',
      border: cr.paid ? '1.5px solid #34c759' : '1.5px solid #f0f0f2',
      borderRadius: 11,
      padding: '9px 10px',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      flex: 'none',
      background: cr.paid ? '#34c759' : '#e5e5ea',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, cr.paid && /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "12",
    height: "12",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 12l5 5L20 6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: css('min-width:0;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:center;gap:5px;')
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: cr.catColor,
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: css('font-size:12px;font-weight:600;color:#1d1d1f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;')
  }, cr.name)), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10.5px;color:#86868b;margin-left:12px;')
  }, cr.planned_fmt))))), variableResumenRows.map((cr, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: css('margin-bottom:10px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;justify-content:space-between;align-items:center;font-size:12.5px;margin-bottom:4px;')
  }, /*#__PURE__*/React.createElement("span", {
    style: css('display:flex;align-items:center;gap:6px;')
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: cr.catColor,
      flex: 'none'
    }
  }), cr.name), /*#__PURE__*/React.createElement("span", null, cr.actual_fmt, " / ", cr.planned_fmt)), /*#__PURE__*/React.createElement("div", {
    style: css('height:6px;border-radius:3px;background:#f0f0f2;overflow:hidden;')
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      borderRadius: 3,
      background: cr.grad,
      width: cr.width
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: css('margin-top:12px;padding-top:10px;border-top:1px solid #f0f0f2;')
  }, (() => {
    const nrPct = s.nonRecurringBudget > 0 ? resumenActualNonRecurringNum / s.nonRecurringBudget * 100 : 0;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: css('display:flex;align-items:center;gap:6px;')
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: NONRECURRING_COLOR,
        flex: 'none'
      }
    }), "Non-recurring (one-off)"), /*#__PURE__*/React.createElement("span", null, fmt(resumenActualNonRecurringNum), " / ", fmt(s.nonRecurringBudget || 0))), /*#__PURE__*/React.createElement("div", {
      style: css('height:6px;border-radius:3px;background:#f0f0f2;overflow:hidden;')
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        borderRadius: 3,
        background: pctGradient(nrPct),
        width: Math.min(nrPct, 100).toFixed(1) + '%'
      }
    })));
  })()))), s.tab === 'guide' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:center;gap:10px;margin-bottom:6px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('metas'),
    style: css('background:#f5f5f7;border:none;width:34px;height:34px;border-radius:10px;cursor:pointer;font-size:20px;color:#1d1d1f;display:flex;align-items:center;justify-content:center;line-height:1;')
  }, "‹"), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:22px;font-weight:700;letter-spacing:-0.01em;')
  }, t('guideTitle'))), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12.5px;color:#86868b;margin-bottom:16px;line-height:1.4;')
  }, t('guideIntro')), coachTips.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;color:#86868b;text-align:center;padding:24px;')
  }, t('coachAllGood')) : coachTips.map(function (tip) {
    return /*#__PURE__*/React.createElement("div", {
      key: tip.id,
      style: css('background:#fff;border:1px solid #f0f0f2;border-radius:14px;padding:14px 16px;margin-bottom:10px;box-shadow:0 1px 2px rgba(0,0,0,0.04);')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:14px;font-weight:700;color:#1d1d1f;')
    }, tip.title), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12.5px;color:#6e6e73;line-height:1.4;margin-top:3px;margin-bottom:12px;')
    }, tip.body), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;gap:8px;justify-content:flex-end;')
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        dismissTip(tip.id);
      },
      style: css('background:none;border:none;color:#86868b;font-size:12.5px;font-weight:600;cursor:pointer;padding:8px 6px;')
    }, tip.action ? t('coachNotNow') : t('coachGotIt')), tip.action && /*#__PURE__*/React.createElement("button", {
      onClick: tip.action,
      style: css('background:#0071e3;color:#fff;border:none;border-radius:9px;padding:8px 14px;font-size:12.5px;font-weight:700;cursor:pointer;')
    }, tip.actionLabel)));
  })), s.tab === 'monthSummary' && (function () {
    var pl = s.pendingLeftover;
    var parsed = pl ? parseMonthYearLabel(pl.label) : {
      month: s.logMonth,
      year: s.logYear
    };
    var pmMonth = parsed.month,
      pmYear = parsed.year;
    var label = pl ? pl.label : MONTH_NAMES[pmMonth] + ' ' + pmYear;
    var pmEntries = s.expenseLog.filter(function (e) {
      var d = new Date(entryDateStr(e) + 'T00:00:00');
      return d.getFullYear() === pmYear && d.getMonth() === pmMonth;
    });
    var pmSpent = pmEntries.reduce(function (a, e) {
      return a + e.amount;
    }, 0);
    var catRows = s.expenseCategories.map(function (c) {
      return {
        name: c.name,
        amt: pmEntries.filter(function (e) {
          return e.recurring && e.name === c.name;
        }).reduce(function (a, e) {
          return a + e.amount;
        }, 0)
      };
    }).filter(function (r) {
      return r.amt > 0;
    });
    var pmNonRec = pmEntries.filter(function (e) {
      return !e.recurring;
    }).reduce(function (a, e) {
      return a + e.amount;
    }, 0);
    var pmIncome = ctx.monthlyIncome;
    var leftover = pl ? pendingLeftoverLive : Math.max(pmIncome - pmSpent, 0);
    var suggestion = (function () {
      if (!pl) return {
        spending: 0,
        byGoal: {},
        byInv: {}
      };
      var L = pendingLeftoverLive,
        byGoal = {},
        byInv = {},
        assigned = 0;
      s.goals.forEach(function (g) {
        var done = g.target > 0 && goalCurrentTotal(g, s.investments) >= g.target;
        var p = done ? 0 : g.mode === 'manual' ? g.percent || 0 : ctx.autoPercentEach;
        var sh = Math.round(L * p / 100);
        if (sh > 0) {
          byGoal[g.id] = sh;
          assigned += sh;
        }
      });
      s.investments.forEach(function (i) {
        var iv = buildInvestView(i);
        // Skip synced funds — their share is already counted via their linked goal above.
        if (iv.mode !== 'off' && !iv.synced) {
          var sh = Math.round(L * iv.percent / 100);
          if (sh > 0) {
            byInv[i.id] = sh;
            assigned += sh;
          }
        }
      });
      return {
        spending: Math.max(L - assigned, 0),
        byGoal: byGoal,
        byInv: byInv
      };
    })();
    var allocated = Object.keys(msSplits).reduce(function (a, k) {
      return a + (parseFloat(msSplits[k]) || 0);
    }, 0);
    var remaining = leftover - allocated;
    var rowStyle = 'display:flex;justify-content:space-between;align-items:center;font-size:13px;margin-bottom:6px;';
    var inputStyle = 'width:88px;padding:6px 8px;border:1px solid #e5e5ea;border-radius:8px;font-size:13px;text-align:right;background:#fbfbfd;';
    var splitRow = function (key, name) {
      return /*#__PURE__*/React.createElement("div", {
        key: key,
        style: css('display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-top:1px solid #f5f5f7;')
      }, /*#__PURE__*/React.createElement("span", {
        style: css('font-size:13px;color:#1d1d1f;')
      }, name), /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: css('position:absolute;left:8px;top:50%;transform:translateY(-50%);font-size:12px;color:#86868b;pointer-events:none;')
      }, "$"), /*#__PURE__*/React.createElement("input", {
        type: "number", inputMode: "decimal",
        placeholder: "0",
        value: msSplits[key] || '',
        onChange: function (e) {
          var v = e.target.value;
          setMsSplits(function (prev) {
            var n = Object.assign({}, prev);
            n[key] = v;
            return n;
          });
        },
        style: css('width:96px;padding:6px 8px 6px 18px;border:1px solid #e5e5ea;border-radius:8px;font-size:13px;text-align:right;background:#fbfbfd;')
      })));
    };
    var confirmSplit = function () {
      var spendingAmt = parseFloat(msSplits.spending) || 0;
      var goalAmts = {};
      s.goals.forEach(function (g) {
        goalAmts[g.id] = parseFloat(msSplits['g' + g.id]) || 0;
      });
      var invAmts = {};
      s.investments.forEach(function (i) {
        invAmts[i.id] = parseFloat(msSplits['i' + i.id]) || 0;
      });
      applyLeftoverAllocation(spendingAmt, goalAmts, invAmts);
      setMsSplits({});
      setTab('inicio');
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;align-items:center;gap:10px;margin-bottom:14px;')
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        setTab('inicio');
      },
      style: css('background:#f5f5f7;border:none;width:34px;height:34px;border-radius:10px;cursor:pointer;font-size:20px;color:#1d1d1f;display:flex;align-items:center;justify-content:center;line-height:1;')
    }, "‹"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:22px;font-weight:700;letter-spacing:-0.01em;')
    }, t('monthSummaryTitle')), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:13px;color:#86868b;')
    }, label))), /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff;border:1px solid #f0f0f2;border-radius:16px;padding:16px 18px;margin-bottom:14px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css(rowStyle)
    }, /*#__PURE__*/React.createElement("span", {
      style: css('color:#86868b;')
    }, t('msIncome')), /*#__PURE__*/React.createElement("b", null, fmt(pmIncome))), /*#__PURE__*/React.createElement("div", {
      style: css(rowStyle)
    }, /*#__PURE__*/React.createElement("span", {
      style: css('color:#86868b;')
    }, t('msSpent')), /*#__PURE__*/React.createElement("b", null, fmt(pmSpent))), catRows.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: css('margin:8px 0;padding:8px 0;border-top:1px solid #f5f5f7;border-bottom:1px solid #f5f5f7;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:10.5px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:6px;')
    }, t('msByCategory')), catRows.map(function (r) {
      return /*#__PURE__*/React.createElement("div", {
        key: r.name,
        style: css('display:flex;justify-content:space-between;font-size:12.5px;color:#6e6e73;margin-bottom:4px;')
      }, /*#__PURE__*/React.createElement("span", null, r.name), /*#__PURE__*/React.createElement("span", null, fmt(r.amt)));
    }), pmNonRec > 0 && /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;justify-content:space-between;font-size:12.5px;color:#6e6e73;')
    }, /*#__PURE__*/React.createElement("span", null, t('msNonRecurring')), /*#__PURE__*/React.createElement("span", null, fmt(pmNonRec)))), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;justify-content:space-between;align-items:center;font-size:15px;font-weight:800;color:#1d1d1f;margin-top:6px;')
    }, /*#__PURE__*/React.createElement("span", null, t('msLeftover')), /*#__PURE__*/React.createElement("span", {
      style: {
        color: leftover >= 0 ? '#34c759' : '#ff3b30'
      }
    }, fmt(leftover))), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:10.5px;color:#86868b;margin-top:8px;line-height:1.3;')
    }, t('msIncomeNote'))), pl && leftover > 0 ? /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff;border:1px solid #f0f0f2;border-radius:16px;padding:16px 18px;margin-bottom:14px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:15px;font-weight:700;color:#1d1d1f;margin-bottom:3px;')
    }, t('msAssignTitle')), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12px;color:#86868b;margin-bottom:10px;line-height:1.35;')
    }, t('msAssignHint')), /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        var ns = {
          spending: String(suggestion.spending)
        };
        Object.keys(suggestion.byGoal).forEach(function (id) {
          ns['g' + id] = String(suggestion.byGoal[id]);
        });
        Object.keys(suggestion.byInv).forEach(function (id) {
          ns['i' + id] = String(suggestion.byInv[id]);
        });
        setMsSplits(ns);
      },
      style: css('background:#eef6ff;border:none;border-radius:9px;padding:8px 12px;font-size:12px;font-weight:700;color:#0071e3;cursor:pointer;margin-bottom:6px;')
    }, t('msUseSuggestion')), splitRow('spending', t('msSpending')), s.goals.map(function (g) {
      return splitRow('g' + g.id, g.name);
    }), s.investments.map(function (i) {
      return splitRow('i' + i.id, i.name);
    }), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12px;color:' + (remaining < 0 ? '#ff3b30' : '#86868b') + ';margin:12px 0;')
    }, fmt(Math.max(remaining, 0)) + ' ' + t('msLeftToAssign') + (remaining < 0 ? ' — ' + t('msOverAssigned') : '')), /*#__PURE__*/React.createElement("button", {
      onClick: confirmSplit,
      style: css('width:100%;background:#0071e3;color:#fff;border:none;padding:13px;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:8px;')
    }, t('msConfirm')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        applyLeftoverAllocation(suggestion.spending, suggestion.byGoal, suggestion.byInv);
        setMsSplits({});
        setTab('inicio');
      },
      style: css('flex:1;background:#f5f5f7;color:#1d1d1f;border:none;padding:11px;border-radius:11px;font-size:12.5px;font-weight:700;cursor:pointer;')
    }, t('msSaveAll')), /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        applyLeftoverAllocation(leftover, {}, {});
        setMsSplits({});
        setTab('inicio');
      },
      style: css('flex:1;background:#f5f5f7;color:#1d1d1f;border:none;padding:11px;border-radius:11px;font-size:12.5px;font-weight:600;cursor:pointer;')
    }, t('msKeepSpending')))) : /*#__PURE__*/React.createElement("div", {
      style: css('font-size:13px;color:#86868b;text-align:center;padding:20px;')
    }, t('msNoLeftover')));
  })(), s.tab === 'budgetPlan' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement('div', { style: css('display:flex;align-items:center;gap:10px;margin-bottom:6px;') }, /*#__PURE__*/React.createElement('button', { onClick: function(){ setTab('gastos'); }, style: css('background:#f5f5f7;border:none;width:34px;height:34px;border-radius:10px;cursor:pointer;font-size:20px;color:#1d1d1f;display:flex;align-items:center;justify-content:center;line-height:1;') }, '\u2039'), /*#__PURE__*/React.createElement('div', { style: css('font-size:22px;font-weight:700;letter-spacing:-0.01em;') }, s.language==='es'?'Plan de presupuesto':'Budget Plan')), /*#__PURE__*/React.createElement('div', { style: css('font-size:13px;color:#86868b;margin-bottom:16px;line-height:1.4;') }, s.language==='es'?'Esta es la base de tus gastos. Def\u00EDnelo primero y aj\u00FAstalo con el tiempo.':'This is the base for your expenses. Set it up first, then adjust it over time.'), /*#__PURE__*/React.createElement('div', { style: css('background:linear-gradient(135deg,#0071e3,#5ac8fa);border-radius:16px;padding:16px;margin-bottom:14px;color:#fff;') }, /*#__PURE__*/React.createElement('div', { style: css('font-size:11.5px;opacity:0.85;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:8px;') }, s.language==='es'?'Resumen del plan':'Plan summary'), /*#__PURE__*/React.createElement('div', { style: css('display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px;') }, /*#__PURE__*/React.createElement('span', { style: css('opacity:0.9;') }, s.language==='es'?'Ingreso mensual':'Monthly income'), /*#__PURE__*/React.createElement('b', null, fmt(ctx.monthlyIncome))), /*#__PURE__*/React.createElement('div', { style: css('display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px;') }, /*#__PURE__*/React.createElement('span', { style: css('opacity:0.9;') }, s.language==='es'?'Presupuesto planeado':'Planned budget'), /*#__PURE__*/React.createElement('b', null, fmt(monthlyTotal))), /*#__PURE__*/React.createElement('div', { style: css('display:flex;justify-content:space-between;font-size:14px;font-weight:700;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.25);') }, /*#__PURE__*/React.createElement('span', null, s.language==='es'?'Te queda para ahorrar':'Left to save'), /*#__PURE__*/React.createElement('span', null, fmt(Math.max(ctx.monthlyIncome - monthlyTotal, 0))))), /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border-radius:16px;padding:16px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:10px;')
  }, t('plannedBudget'), /*#__PURE__*/React.createElement(InfoTip, {
    text: "Mark \"Fixed\" for costs that are always the same (rent, insurance) — those auto-fill when you log them. Leave unmarked for things that vary (groceries, gas)."
  })), s.expenseCategories.map((row, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    ref: el => {
      budgetRowRefs.current[i] = el;
    },
    onMouseDown: e => startBudgetRowPress(i, e.clientY),
    onMouseMove: e => moveBudgetRowPress(e.clientY),
    onMouseUp: endBudgetRowPress,
    onMouseLeave: () => {
      if (dragIndex !== i) endBudgetRowPress();
    },
    onTouchStart: e => startBudgetRowPress(i, e.touches[0].clientY),
    onTouchMove: e => moveBudgetRowPress(e.touches[0].clientY),
    onTouchEnd: endBudgetRowPress,
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      padding: '6px 0',
      borderBottom: '1px solid #f0f0f2',
      background: dragIndex === i ? '#eef6ff' : 'transparent',
      borderRadius: dragIndex === i ? 10 : 0,
      boxShadow: dragIndex === i ? '0 6px 16px rgba(0,0,0,0.12)' : 'none',
      touchAction: dragIndex === i ? 'none' : 'auto',
      userSelect: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: css('color:#c7c7cc;font-size:13px;cursor:grab;flex:none;line-height:1;')
  }, "⠿"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: row.color || PALETTE[i % PALETTE.length],
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: row.name,
    onChange: e => updateExpenseRow(i, 'name', e.target.value),
    style: css('flex:1;min-width:0;border:none;background:transparent;font-size:14px;padding:4px 0;')
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => toggleExpenseFixed(i),
    style: {
      background: row.fixed ? '#0071e3' : '#f5f5f7',
      color: row.fixed ? '#fff' : '#86868b',
      border: 'none',
      borderRadius: 7,
      padding: '6px 9px',
      fontSize: 11,
      fontWeight: 600,
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    }
  }, row.fixed ? '✓ Fixed' : 'Fixed'), /*#__PURE__*/React.createElement("input", {
    type: "number", inputMode: "decimal",
    value: row.amount || '',
    onChange: e => updateExpenseRow(i, 'amount', e.target.value),
    style: css('width:80px;border:1px solid #e5e5ea;border-radius:8px;padding:6px 8px;font-size:13px;background:#fbfbfd;')
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => removeExpenseRow(i),
    style: css('background:none;border:none;color:#ff3b30;cursor:pointer;font-size:15px;')
  }, "×"))), /*#__PURE__*/React.createElement("button", {
    onClick: addExpenseRow,
    style: css('margin-top:10px;background:#f5f5f7;border:none;padding:8px 14px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;')
  }, t('addExpense')), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;align-items:center;padding:10px 0;border-top:1px solid #f0f0f2;margin-top:10px;')
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: NONRECURRING_COLOR,
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: css('flex:1;min-width:0;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:14px;')
  }, t('nonRecurringAllowance')), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10.5px;color:#86868b;')
  }, "Outings, one-off buys — a monthly cap for everything that isn't a fixed category")), /*#__PURE__*/React.createElement("input", {
    type: "number", inputMode: "decimal",
    value: s.nonRecurringBudget || '',
    onChange: onNonRecurringBudget,
    style: css('width:80px;border:1px solid #e5e5ea;border-radius:8px;padding:6px 8px;font-size:13px;background:#fbfbfd;')
  })), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;justify-content:space-between;font-weight:700;font-size:13.5px;margin-top:10px;padding-top:8px;border-top:1px solid #f0f0f2;')
  }, /*#__PURE__*/React.createElement("span", null, "Monthly total"), /*#__PURE__*/React.createElement("span", null, fmt(monthlyTotal)))), s.expenseCategories.length === 0 && !s.skippedBudgetSetup && (() => {
    const isMinor = s.incomeProfile === 'allowance' && s.studentAge && s.studentAge < 18;
    const presetsEn = isMinor ? ['Phone', 'Subscriptions', 'Gym', 'Clothes & shopping', 'Going out with friends', 'School supplies'] : ['Rent/Mortgage', 'Utilities', 'Phone', 'Internet', 'Car payment', 'Insurance', 'Subscriptions', 'Groceries', 'Gym', 'Debt payment'];
    const presetsEs = isMinor ? ['Teléfono', 'Suscripciones', 'Gimnasio', 'Ropa y compras', 'Salidas con amigos', 'Útiles escolares'] : ['Renta/Hipoteca', 'Servicios (luz/agua)', 'Teléfono', 'Internet', 'Pago del carro', 'Seguro', 'Suscripciones', 'Mercado', 'Gimnasio', 'Pago de deuda'];
    const presetList = s.language === 'es' ? presetsEs : presetsEn;
    return /*#__PURE__*/React.createElement("div", {
      style: css('position:fixed;inset:0;z-index:90;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;padding:24px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('background:#fff;border-radius:20px;padding:22px;max-width:360px;width:100%;max-height:80vh;overflow-y:auto;box-shadow:0 30px 70px rgba(0,0,0,0.25);')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('font-size:18px;font-weight:700;margin-bottom:6px;')
    }, s.language === 'es' ? '¿Cuáles son tus gastos fijos?' : 'What are your fixed expenses?'), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:12.5px;color:#86868b;margin-bottom:16px;line-height:1.4;')
    }, s.language === 'es' ? 'Elige los que apliquen. Podrás ajustar los montos después.' : "Pick the ones that apply. You'll set the amounts after."), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;flex-direction:column;gap:8px;margin-bottom:20px;')
    }, presetList.map(name => /*#__PURE__*/React.createElement("button", {
      key: name,
      onClick: () => togglePreset(name),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '11px 12px',
        borderRadius: 11,
        border: selectedPresets.includes(name) ? '2px solid #0071e3' : '1px solid #e5e5ea',
        background: selectedPresets.includes(name) ? '#eef6ff' : '#fbfbfd',
        cursor: 'pointer',
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 18,
        height: 18,
        borderRadius: 5,
        border: selectedPresets.includes(name) ? 'none' : '1.5px solid #c7c7cc',
        background: selectedPresets.includes(name) ? '#0071e3' : 'transparent',
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, selectedPresets.includes(name) && /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "12",
      height: "12",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "3",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4 12l5 5L20 6"
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        color: '#1d1d1f'
      }
    }, name)))), /*#__PURE__*/React.createElement("button", {
      onClick: applyBudgetPresets,
      disabled: selectedPresets.length === 0,
      style: css('width:100%;padding:12px;background:' + (selectedPresets.length === 0 ? '#a1c9f4' : '#0071e3') + ';color:#fff;border:none;border-radius:12px;font-size:14.5px;font-weight:600;cursor:pointer;margin-bottom:8px;')
    }, s.language === 'es' ? 'Listo' : 'OK'), /*#__PURE__*/React.createElement("button", {
      onClick: skipBudgetSetup,
      style: css('width:100%;padding:10px;background:none;color:#86868b;border:none;font-size:12.5px;font-weight:600;cursor:pointer;')
    }, s.language === 'es' ? 'Prefiero agregarlos yo mismo' : "I'll add them myself")));
  })()), s.tab === 'extra' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:22px;font-weight:700;letter-spacing:-0.01em;margin-bottom:16px;')
  }, s.incomeProfile === 'freelance' ? t('freelanceExtrasLabel') : t('extraIncome'), /*#__PURE__*/React.createElement(InfoTip, {
    text: "Freelance, sales, commissions — every extra dollar speeds up your goals."
  })), /*#__PURE__*/React.createElement("div", {
    style: css('background:linear-gradient(135deg,#0071e3,#5ac8fa);border-radius:20px;padding:22px;color:#fff;margin-bottom:18px;box-shadow:0 16px 40px rgba(0,113,227,0.25);')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;opacity:0.85;')
  }, "Total extra / month"), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:36px;font-weight:700;margin:4px 0 10px;')
  }, fmt(hustleTotal)), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13.5px;line-height:1.5;opacity:0.95;')
  }, globalHustleMessage)), s.hustles.map(h => {
    const streak = h.streak || 0;
    let badgeLabel = '',
      badgeColor = '';
    if (streak >= 12) {
      badgeLabel = 'Gold';
      badgeColor = '#ff9500';
    } else if (streak >= 6) {
      badgeLabel = 'Silver';
      badgeColor = '#8e8e93';
    } else if (streak >= 3) {
      badgeLabel = 'Bronze';
      badgeColor = '#cd7f32';
    }
    const checkedThisMonth = h.lastMonth === currentKey;
    return /*#__PURE__*/React.createElement("div", {
      key: h.id,
      style: css('background:#fff;border-radius:16px;padding:16px;margin-bottom:12px;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;gap:10px;align-items:center;margin-bottom:10px;')
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: h.name,
      onChange: e => updateHustle(h.id, 'name', e.target.value),
      style: css('flex:1;min-width:0;font-size:15px;font-weight:600;border:none;background:transparent;padding:4px 0;')
    }), /*#__PURE__*/React.createElement("button", {
      onClick: () => removeHustle(h.id),
      style: css('background:#f5f5f7;border:none;color:#ff3b30;width:26px;height:26px;border-radius:8px;cursor:pointer;font-size:14px;')
    }, "×")), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;gap:10px;align-items:center;flex-wrap:wrap;')
    }, /*#__PURE__*/React.createElement("div", {
      style: css('flex:1;min-width:90px;')
    }, /*#__PURE__*/React.createElement("label", {
      style: css('display:block;font-size:11px;color:#86868b;font-weight:600;margin-bottom:4px;')
    }, "Amount / month"), /*#__PURE__*/React.createElement("input", {
      type: "number", inputMode: "decimal",
      value: h.amount || '',
      onChange: e => updateHustle(h.id, 'amount', e.target.value),
      style: css('width:100%;padding:8px 10px;border:1px solid #e5e5ea;border-radius:9px;font-size:13.5px;background:#fbfbfd;')
    })), /*#__PURE__*/React.createElement("div", {
      style: css('flex:1;min-width:120px;')
    }, /*#__PURE__*/React.createElement("label", {
      style: css('display:block;font-size:11px;color:#86868b;font-weight:600;margin-bottom:4px;')
    }, "Assign to goal"), /*#__PURE__*/React.createElement("select", {
      value: h.goalId || '',
      onChange: e => setHustleGoal(h.id, e.target.value ? parseFloat(e.target.value) : null),
      style: css('width:100%;padding:8px 10px;border:1px solid #e5e5ea;border-radius:9px;font-size:13px;background:#fbfbfd;')
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "General (all)"), goalOptionsFull.map(go => /*#__PURE__*/React.createElement("option", {
      key: go.id,
      value: go.id
    }, go.name)))), badgeLabel && /*#__PURE__*/React.createElement("div", {
      style: {
        background: badgeColor,
        color: '#fff',
        fontSize: 11,
        fontWeight: 700,
        padding: '5px 10px',
        borderRadius: 20,
        whiteSpace: 'nowrap'
      }
    }, badgeLabel), /*#__PURE__*/React.createElement("button", {
      onClick: () => checkInHustle(h.id),
      disabled: checkedThisMonth,
      style: {
        background: checkedThisMonth ? '#f0f0f2' : '#1d1d1f',
        color: checkedThisMonth ? '#86868b' : '#fff',
        border: 'none',
        padding: '9px 12px',
        borderRadius: 9,
        fontSize: 12.5,
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }
    }, checkedThisMonth ? t('checked') : t('checkIn'))), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11.5px;color:#86868b;margin-top:8px;')
    }, "🔥 Streak: ", streak, " ", streak === 1 ? 'month' : 'months'), h.goalId && h.amount > 0 && !checkedThisMonth && /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11px;color:#0071e3;margin-top:4px;')
    }, "Checking in adds ", fmt(h.amount), " to that goal's savings."));
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      addHustle();
      dismissTabIntro('extra');
    },
    style: css('width:100%;padding:13px;background:#0071e3;color:#fff;border:none;border-radius:14px;font-size:14.5px;font-weight:600;cursor:pointer;')
  }, t('addSideHustle')), !s.seenTabIntro.extra && /*#__PURE__*/React.createElement("div", {
    className: "tip-banner",
    style: css('display:flex;align-items:center;gap:12px;background:#fff;border-radius:16px;padding:16px 18px;margin-top:16px;margin-bottom:16px;box-shadow:0 8px 24px rgba(0,0,0,0.10);')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('flex:1;font-size:13px;color:#6e6e73;font-weight:400;line-height:1.3;')
  }, t('tabIntroExtra')), /*#__PURE__*/React.createElement("button", {
    onClick: () => dismissTabIntro('extra'),
    style: css('flex:none;background:#fff;color:#0071e3;border:1.5px solid #d2d2d7;padding:8px 15px;border-radius:9px;font-size:12.5px;font-weight:700;cursor:pointer;')
  }, t('gotIt')))), s.tab === 'invest' && !hideInvestTab && /*#__PURE__*/React.createElement(React.Fragment, null, buildInvestTabContent())))), !isDesktop && /*#__PURE__*/React.createElement("div", {
    style: css('position:fixed;bottom:0;left:0;right:0;z-index:30;background:rgba(255,255,255,0.94);backdrop-filter:blur(14px);border-top:1px solid rgba(0,0,0,0.08);display:flex;padding:8px 4px calc(8px + env(safe-area-inset-bottom));')
  }, /*#__PURE__*/React.createElement(TabButton, {
    name: "inicio",
    label: t('tabHome'),
    icon: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 11.5L12 4l9 7.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5.5 10v9a1 1 0 0 0 1 1h4v-6h3v6h4a1 1 0 0 0 1-1v-9"
    }))
  }), /*#__PURE__*/React.createElement(TabButton, {
    name: "metas",
    label: t('tabGoals'),
    icon: color => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "4.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "0.6",
      fill: color
    }))
  }), /*#__PURE__*/React.createElement(TabButton, {
    name: "gastos",
    label: t('tabExpenses'),
    icon: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "6",
      width: "18",
      height: "13",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 10h18"
    }))
  }), /*#__PURE__*/React.createElement(TabButton, {
    name: "extra",
    label: t('tabExtra'),
    icon: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 17l6-6 4 4 8-8"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M15 7h6v6"
    }))
  }), !hideInvestTab && /*#__PURE__*/React.createElement(TabButton, {
    name: "invest",
    label: t('tabInvest'),
    icon: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 3v18h18"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7 15l4-5 3 3 5-7"
    }))
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));