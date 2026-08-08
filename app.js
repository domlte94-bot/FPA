const {
  useState,
  useEffect,
  useRef
} = React;

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
    lastProcessedMonth: state.lastProcessedMonth,
    lastProcessedYear: state.lastProcessedYear,
    expenseCategories: state.expenseCategories,
    expenseLog: state.expenseLog,
    plannedExpenses: state.plannedExpenses,
    hustles: state.hustles,
    goals: state.goals,
    investments: state.investments,
    selectedGoalId: state.selectedGoalId
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
function currentMonthKey() {
  const d = new Date();
  return d.getFullYear() + '-' + d.getMonth();
}
function iconPathFor(key) {
  const f = ICONS.concat(MORE_ICONS).find(i => i.key === key);
  return f ? f.path : ICONS[0].path;
}
function defaultState() {
  const today = new Date();
  return {
    tab: 'inicio',
    income: 3173,
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
  const received = receivedThisMonth(s, today);
  return received > 0 ? received : monthlyIncomeOf(s);
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
  const manualPercentTotal = s.goals.filter(g => g.mode === 'manual').reduce((a, g) => a + (g.percent || 0), 0);
  const autoCount = Math.max(s.goals.filter(g => g.mode !== 'manual').length, 1);
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
    today
  };
}

/* ---------- app ---------- */
function InfoTip({
  text
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("button", {
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
  }, "i"), open && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 22,
      left: 0,
      zIndex: 20,
      background: '#1d1d1f',
      color: '#fff',
      fontSize: 11.5,
      fontWeight: 400,
      lineHeight: 1.45,
      padding: '10px 12px',
      borderRadius: 10,
      width: 230,
      boxShadow: '0 10px 26px rgba(0,0,0,0.25)',
      display: 'block',
      textTransform: 'none',
      letterSpacing: 'normal'
    }
  }, text));
}
const STRINGS = {
  en: {
    tabHome: 'Home',
    tabGoals: 'Goals',
    tabExpenses: 'Expenses',
    tabExtra: 'Extra',
    tabInvest: 'Invest',
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
    investments: 'Investments',
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
    tabInvest: 'Inversión',
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
    investments: 'Inversiones',
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
function App() {
  const [state, setState] = useState(null);
  const [storageWarning, setStorageWarning] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
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
  const [showAddPaycheck, setShowAddPaycheck] = useState(false);
  const [newPaycheckDate, setNewPaycheckDate] = useState('');
  const [newPaycheckAmount, setNewPaycheckAmount] = useState('');
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [allocatingLeftover, setAllocatingLeftover] = useState(false);
  const [welcomeStep, setWelcomeStep] = useState(0);
  const [settingsView, setSettingsView] = useState('menu');
  const [selectedPresets, setSelectedPresets] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const askConfirm = (message, onYes) => setConfirmDialog({
    message,
    onYes
  });
  const [leftoverSplits, setLeftoverSplits] = useState({});
  const [reportQuarter, setReportQuarter] = useState(Math.floor(new Date().getMonth() / 3) + 1);
  const lineCanvasRef = useRef(null);
  const monthStripRef = useRef(null);
  useEffect(() => {
    if (!monthStripRef.current) return;
    const cur = monthStripRef.current.querySelector('[data-current="true"]');
    if (cur && typeof cur.scrollIntoView === 'function') cur.scrollIntoView({
      inline: 'start',
      block: 'nearest'
    });else monthStripRef.current.scrollLeft = monthStripRef.current.scrollWidth;
  }, [state && state.selectedGoalId, state && state.tab]);
  const donutCanvasRef = useRef(null);
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
          setState(Object.assign(defaultState(), loaded));
        } else {
          setState(defaultState());
        }
      } catch (e) {
        if (!cancelled) setState(defaultState());
      } finally {
        if (!cancelled) hasLoaded.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* persist (debounced) */
  useEffect(() => {
    if (!state || !hasLoaded.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const toSave = buildPersistPayload(state);
      storageAdapter.set(STORAGE_KEY, JSON.stringify(toSave)).catch(() => setStorageWarning('Could not save. Your changes might not persist.'));
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [state]);
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
  const markPaidToday = () => {
    patch(s => {
      const amt = s.income || 0;
      const entry = {
        id: Date.now(),
        date: todayStr,
        amount: amt
      };
      const anchor = s.nextPaydayDate ? new Date(s.nextPaydayDate + 'T00:00:00') : new Date();
      const advanced = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() + 14);
      let next = advanced;
      const today = new Date();
      while (next.getTime() < new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) {
        next = new Date(next.getFullYear(), next.getMonth(), next.getDate() + 14);
      }
      return {
        paycheckLog: (s.paycheckLog || []).concat([entry]).slice(-52),
        nextPaydayDate: toDateStr(next.getFullYear(), next.getMonth(), next.getDate())
      };
    });
  };
  const applyLeftoverAllocation = (spendingAmt, goalAmts) => {
    patch(s => {
      let goals = s.goals;
      const label = (s.pendingLeftover && s.pendingLeftover.label ? s.pendingLeftover.label : 'Last month') + ' leftover';
      goals = s.goals.map(g => {
        const amt = goalAmts[g.id] || 0;
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
      return {
        goals,
        spendingBoost: (s.spendingBoost || 0) + (spendingAmt || 0),
        pendingLeftover: null
      };
    });
  };
  const dismissLeftover = () => {
    patch(s => {
      if (!s.pendingLeftover || s.pendingLeftover.amount <= 0) return {
        pendingLeftover: null
      };
      const amount = s.pendingLeftover.amount;
      const label = s.pendingLeftover.label + ' leftover';
      const manualPercentTotal = s.goals.filter(g => g.mode === 'manual').reduce((a, g) => a + (g.percent || 0), 0);
      const autoCount = Math.max(s.goals.filter(g => g.mode !== 'manual').length, 1);
      const autoPercentEach = Math.max(100 - manualPercentTotal, 0) / autoCount;
      const goals = s.goals.map(g => {
        const percent = g.mode === 'manual' ? g.percent || 0 : autoPercentEach;
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
  const removeGoal = id => {
    askConfirm('Delete this goal? Its saved progress and history will be lost.', () => patch(s => {
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
        }].concat(g.savingsLog || []).slice(0, 12)
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
  const addInvestment = () => patch(s => ({
    investments: s.investments.concat([{
      id: Date.now(),
      name: 'New investment',
      amount: 0,
      currentValue: 0,
      lastUpdated: todayStr
    }])
  }));
  const removeInvestment = id => {
    askConfirm('Delete this investment from your tracker?', () => patch(s => ({
      investments: s.investments.filter(i => i.id !== id)
    })));
  };
  const updateInvestment = (id, field, val) => patch(s => ({
    investments: s.investments.map(i => i.id === id ? {
      ...i,
      [field]: field === 'amount' || field === 'currentValue' ? parseFloat(val) || 0 : val,
      ...(field === 'currentValue' ? {
        lastUpdated: todayStr
      } : {})
    } : i)
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
      const pct = g.target > 0 ? Math.min(100, g.current / g.target * 100) : 0;
      return {
        name: g.name,
        deposits,
        current: g.current,
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
  const hideInvestTab = s.incomeProfile === 'allowance' && s.studentAge && s.studentAge < 18 && s.investsWithParents === false;
  const ctx = computeCtx(s);
  function buildGoalView(goal, isDetail) {
    const percent = goal.mode === 'manual' ? goal.percent || 0 : ctx.autoPercentEach;
    const monthlyBoosted = ctx.boostedAvailable * (percent / 100) + (ctx.assignedByGoal[goal.id] || 0);
    const remaining = Math.max(goal.target - goal.current, 0);
    const monthsToGoal = monthlyBoosted > 0 ? Math.ceil(remaining / monthlyBoosted) : Infinity;
    const estDate = isFinite(monthsToGoal) ? addMonths(ctx.today, monthsToGoal) : null;
    const estDateLabel = estDate ? MONTH_NAMES[estDate.getMonth()] + ' ' + estDate.getFullYear() : 'No savings assigned';
    const progressPct = goal.target > 0 ? Math.min(100, goal.current / goal.target * 100) : 0;
    const isCompleted = goal.target > 0 && goal.current >= goal.target;
    const view = {
      goal,
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
  const monthlyTotal = ctx.totalExpenses,
    hustleTotal = ctx.hustleTotal;
  const totalCurrent = s.goals.reduce((a, g) => a + (g.current || 0), 0);
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
    return {
      ...inv,
      monthsSince,
      isStale,
      gainAmount,
      gainPct,
      dateLabel
    };
  });
  const recurringCategoryOptions = s.expenseCategories.map(c => c.name);
  const effectiveLogCategory = logCategory || recurringCategoryOptions[0] || '';
  const currentKey = currentMonthKey();
  const goalOptionsFull = s.goals.map(g => ({
    id: g.id,
    name: g.name
  }));

  /* ================= RENDER ================= */
  const TabButton = ({
    name,
    label,
    icon
  }) => {
    const active = s.tab === name;
    const color = active ? '#0071e3' : '#86868b';
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => setTab(name),
      style: css('flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 2px;cursor:pointer;color:' + color + ';')
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "21",
      height: "21",
      fill: "none",
      stroke: color,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, icon(color)), /*#__PURE__*/React.createElement("span", {
      style: css('font-size:10px;font-weight:600;')
    }, label));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: css('min-height:100vh;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display",Inter,system-ui,sans-serif;color:#1d1d1f;')
  }, confirmDialog && /*#__PURE__*/React.createElement("div", {
    style: css('position:fixed;inset:0;z-index:110;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;padding:24px;')
  }, /*#__PURE__*/React.createElement("div", {
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
  }, s.language === 'es' ? 'Sí, continuar' : 'Yes, continue')))), !s.hasSeenWelcome && /*#__PURE__*/React.createElement("div", {
    style: css('position:fixed;inset:0;z-index:100;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;padding:24px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border-radius:20px;padding:26px 24px;max-width:360px;width:100%;box-shadow:0 30px 70px rgba(0,0,0,0.25);')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#0071e3,#34c759);display:flex;align-items:center;justify-content:center;margin-bottom:16px;')
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "24",
    height: "24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7v5l3 3"
  }))), welcomeStep === 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:6px;margin-bottom:16px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setLanguage('en'),
    style: {
      flex: 1,
      background: s.language !== 'es' ? '#0071e3' : '#f5f5f7',
      color: s.language !== 'es' ? '#fff' : '#1d1d1f',
      border: 'none',
      padding: 8,
      borderRadius: 8,
      fontSize: 12.5,
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, "English"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setLanguage('es'),
    style: {
      flex: 1,
      background: s.language === 'es' ? '#0071e3' : '#f5f5f7',
      color: s.language === 'es' ? '#fff' : '#1d1d1f',
      border: 'none',
      padding: 8,
      borderRadius: 8,
      fontSize: 12.5,
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, "Español")), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:20px;font-weight:700;letter-spacing:-0.01em;margin-bottom:6px;')
  }, t('welcome')), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13.5px;color:#6e6e73;line-height:1.5;margin-bottom:14px;')
  }, t('profileQTitle')), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;flex-direction:column;gap:8px;margin-bottom:18px;')
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
  }, p === 'allowance' ? t('profileAllowance') : p === 'salary' ? t('profileSalary') : t('profileFreelance')))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setWelcomeStep(1),
    style: css('width:100%;padding:12px;background:#0071e3;color:#fff;border:none;border-radius:12px;font-size:14.5px;font-weight:600;cursor:pointer;')
  }, t('continueLabel'))) : welcomeStep === 1 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:20px;font-weight:700;letter-spacing:-0.01em;margin-bottom:16px;')
  }, t('welcome')), s.incomeProfile === 'allowance' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13.5px;color:#6e6e73;margin-bottom:10px;')
  }, t('howOldQ')), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    autoFocus: true,
    placeholder: t('yourAge'),
    value: s.studentAge || '',
    onChange: e => setStudentAge(parseInt(e.target.value, 10) || null),
    style: css('width:100%;padding:11px 12px;border:1px solid #d2d2d7;border-radius:12px;font-size:15px;background:#fbfbfd;')
  })), s.studentAge && s.studentAge < 18 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13.5px;color:#6e6e73;margin-bottom:10px;')
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
  }, t('investNo'))))), s.incomeProfile === 'salary' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13.5px;color:#6e6e73;margin-bottom:10px;')
  }, t('employmentQ')), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;margin-bottom:18px;')
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
    style: css('font-size:13.5px;color:#6e6e73;margin-bottom:10px;')
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
    style: css('font-size:13.5px;color:#6e6e73;margin-bottom:10px;')
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
  }, t('noLabel')))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setWelcomeStep(2),
    style: css('width:100%;padding:12px;background:#0071e3;color:#fff;border:none;border-radius:12px;font-size:14.5px;font-weight:600;cursor:pointer;')
  }, t('continueLabel'))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:20px;font-weight:700;letter-spacing:-0.01em;margin-bottom:6px;')
  }, t('welcome')), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13.5px;color:#6e6e73;line-height:1.5;margin-bottom:16px;')
  }, s.language === 'es' ? 'Un aviso rápido antes de empezar:' : 'A quick heads-up before you start:'), s.language === 'es' ? /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;color:#1d1d1f;line-height:1.7;margin-bottom:14px;')
  }, "1. Pon tu ", /*#__PURE__*/React.createElement("b", null, s.incomeProfile === 'allowance' ? 'mesada' : s.incomeProfile === 'freelance' ? 'ingreso de contratos fijos' : 'ingreso'), " en Inicio.", /*#__PURE__*/React.createElement("br", null), "2. Agrega tus ", /*#__PURE__*/React.createElement("b", null, "gastos"), " en la pestaña Gastos — marca los fijos.", /*#__PURE__*/React.createElement("br", null), "3. Crea una ", /*#__PURE__*/React.createElement("b", null, "meta"), " y registra tus ahorros ahí.", /*#__PURE__*/React.createElement("br", null), "4. Todo se guarda solo en ", /*#__PURE__*/React.createElement("b", null, "este dispositivo/navegador"), " — usa Ajustes → Exportar para respaldarlo.") : /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;color:#1d1d1f;line-height:1.7;margin-bottom:14px;')
  }, "1. Set your ", /*#__PURE__*/React.createElement("b", null, s.incomeProfile === 'allowance' ? 'allowance' : s.incomeProfile === 'freelance' ? 'fixed contracts income' : 'income'), " on the Home tab.", /*#__PURE__*/React.createElement("br", null), "2. Add your ", /*#__PURE__*/React.createElement("b", null, "expenses"), " in the Expenses tab — mark the fixed ones.", /*#__PURE__*/React.createElement("br", null), "3. Add a ", /*#__PURE__*/React.createElement("b", null, "goal"), " and log savings as you go.", /*#__PURE__*/React.createElement("br", null), "4. Everything saves only on ", /*#__PURE__*/React.createElement("b", null, "this device/browser"), " — use Settings → Export to back it up."), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12px;color:#0071e3;background:#eef6ff;border-radius:10px;padding:10px 12px;margin-bottom:18px;line-height:1.5;')
  }, s.language === 'es' ? '🤝 Próximamente: metas compartidas — invita a alguien de confianza a ahorrar contigo para el mismo objetivo (ej. una casa), y cada quien aporta un % justo según su propio ingreso y gastos.' : "🤝 Coming soon: shared goals — invite someone you trust to save toward the same goal together (like a house), with each person's fair share based on their own income and expenses."), /*#__PURE__*/React.createElement("button", {
    onClick: dismissWelcome,
    style: css('width:100%;padding:12px;background:#0071e3;color:#fff;border:none;border-radius:12px;font-size:14.5px;font-weight:600;cursor:pointer;')
  }, t('getStarted'))))), /*#__PURE__*/React.createElement("div", {
    style: css('padding-bottom:96px;')
  }, storageWarning && /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff2ef;color:#ff3b30;font-size:12.5px;padding:8px 20px;')
  }, storageWarning), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: '0 auto',
      padding: 'calc(20px + env(safe-area-inset-top)) 20px 0'
    }
  }, s.tab === 'inicio' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;justify-content:flex-end;margin-bottom:4px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('settings'),
    style: css('background:#fff;border:none;width:34px;height:34px;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;')
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "18",
    height: "18",
    fill: "none",
    stroke: "#6e6e73",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
  })))), /*#__PURE__*/React.createElement("div", {
    style: css('background:linear-gradient(135deg,' + (homeSpentPct >= 100 ? '#ff3b30,#ff9500' : '#0071e3,#5ac8fa') + ');border-radius:20px;padding:20px;margin-bottom:16px;color:#fff;box-shadow:0 14px 34px rgba(0,113,227,0.22);')
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
  }, homeSpendHeadline)), s.pendingLeftover && /*#__PURE__*/React.createElement("div", {
    style: css('background:linear-gradient(135deg,#0071e3,#34c759);border-radius:18px;padding:18px;color:#fff;margin-bottom:16px;box-shadow:0 12px 30px rgba(0,113,227,0.25);')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;font-weight:600;opacity:0.9;')
  }, "Leftover from ", s.pendingLeftover.label), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:28px;font-weight:800;margin:4px 0 8px;')
  }, fmt(s.pendingLeftover.amount)), !allocatingLeftover ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;opacity:0.95;margin-bottom:12px;')
  }, "You had this left over — split it yourself, or we'll add it all to savings for you."), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setLeftoverSplits({});
      setAllocatingLeftover(true);
    },
    style: css('flex:1;background:#fff;color:#0071e3;border:none;padding:10px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;')
  }, "Split it up"), /*#__PURE__*/React.createElement("button", {
    onClick: dismissLeftover,
    style: css('background:rgba(255,255,255,0.2);color:#fff;border:none;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;')
  }, "Just save it all"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12px;opacity:0.9;margin-bottom:10px;')
  }, "Split it however you like — spending, one goal, or several."), /*#__PURE__*/React.createElement("div", {
    style: css('background:rgba(255,255,255,0.15);border-radius:12px;padding:10px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;')
  }, /*#__PURE__*/React.createElement("span", {
    style: css('font-size:13px;')
  }, "Add to spending"), /*#__PURE__*/React.createElement("input", {
    type: "number",
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
    type: "number",
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
    onClick: () => setTab('incomeHistory'),
    style: css('background:#fff;border-radius:14px;padding:13px;cursor:pointer;')
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
  }, fmt(s.income)), s.payFrequency === 'biweekly' && /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      markPaidToday();
    },
    style: css('width:100%;margin-top:8px;background:#0071e3;color:#fff;border:none;padding:7px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;')
  }, "✓ I got paid (", fmt(s.income), ")")), /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border-radius:14px;padding:13px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10.5px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;')
  }, t('availableMonth'), /*#__PURE__*/React.createElement(InfoTip, {
    text: s.language === 'es' ? 'Tu ingreso menos tus gastos presupuestados de este mes.' : "Your income minus your budgeted expenses this month."
  })), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:17px;font-weight:700;color:#1d1d1f;margin-top:3px;')
  }, fmt(Math.max(ctx.boostedAvailable, 0)))), /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border-radius:14px;padding:13px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10.5px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;')
  }, t('totalSaved')), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:17px;font-weight:700;color:#1d1d1f;margin-top:3px;')
  }, fmt(totalCurrent)), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:9.5px;color:#86868b;margin-top:2px;')
  }, overallPct.toFixed(0), "% of goal")), /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border-radius:14px;padding:13px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10.5px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;')
  }, t('totalInvested')), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:17px;font-weight:700;color:#1d1d1f;margin-top:3px;')
  }, fmt(investmentTotal)), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:9.5px;color:#86868b;margin-top:2px;')
  }, s.investments.length, " ", s.investments.length === 1 ? 'investment' : 'investments'))), donutLegend.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border-radius:16px;padding:16px;margin-bottom:22px;display:flex;align-items:center;gap:18px;flex-wrap:wrap;')
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
  }), /*#__PURE__*/React.createElement("span", null, c.label))))), !s.seenTabIntro.inicio && /*#__PURE__*/React.createElement("div", {
    className: "tip-banner",
    style: css('display:flex;align-items:center;gap:12px;background:#fff;border-radius:16px;padding:16px 18px;margin-bottom:16px;box-shadow:0 8px 24px rgba(0,0,0,0.10);')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('flex:1;font-size:13px;color:#6e6e73;font-weight:400;line-height:1.3;')
  }, t('tabIntroHome')), /*#__PURE__*/React.createElement("button", {
    onClick: () => dismissTabIntro('inicio'),
    style: css('flex:none;background:#fff;color:#0071e3;border:1.5px solid #d2d2d7;padding:8px 15px;border-radius:9px;font-size:12.5px;font-weight:700;cursor:pointer;')
  }, t('gotIt'))), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:10px;')
  }, "Your goals"), s.goals.map(g => {
    const v = buildGoalView(g, false);
    return /*#__PURE__*/React.createElement("div", {
      key: g.id,
      onClick: () => {
        selectGoal(g.id);
        setTab('metas');
      },
      style: css('background:#fff;border-radius:18px;padding:18px 18px 16px;margin-bottom:12px;cursor:pointer;')
    }, /*#__PURE__*/React.createElement("div", {
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
    }, fmt(g.current), " of ", fmt(g.target))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 19,
        fontWeight: 700,
        color: g.color
      }
    }, v.progressLabel)), /*#__PURE__*/React.createElement("div", {
      style: css('height:8px;border-radius:4px;background:#f0f0f2;overflow:hidden;')
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        borderRadius: 4,
        background: g.color,
        width: v.progressWidth
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: css('display:flex;justify-content:space-between;margin-top:10px;font-size:12.5px;color:#86868b;')
    }, /*#__PURE__*/React.createElement("span", null, v.monthlyLabel, "/mo (", v.percentLabel, ")"), /*#__PURE__*/React.createElement("span", null, "Est. target: ", v.estDateLabel)));
  })), s.tab === 'incomeHistory' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
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
  }, s.language === 'es' ? 'Historial de ingreso' : 'Income history')), /*#__PURE__*/React.createElement("div", {
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
    type: "number",
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
  }, s.language === 'es' ? 'Pagos recibidos' : 'Paychecks received'), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11px;color:#86868b;margin-bottom:12px;line-height:1.4;')
  }, s.language === 'es' ? 'Cada pago real que has recibido, con su fecha.' : 'Every real payment you actually received, with its date.'), (() => {
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
  }, /*#__PURE__*/React.createElement("span", null, p.date), /*#__PURE__*/React.createElement("span", {
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
    type: "number",
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
  }, "+ ", s.language === 'es' ? 'Registrar un pago que ya recibiste' : 'Register a paycheck you already received'))), s.tab === 'settings' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
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
  }, settingsView === 'menu' ? t('settings') : settingsView === 'profile' ? t('profileMenu') : settingsView === 'reports' ? t('reportsMenu') : t('moreMenu'))), settingsView === 'menu' && /*#__PURE__*/React.createElement("div", {
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
  }))))), settingsView === 'profile' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
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
  }, "Español")), /*#__PURE__*/React.createElement("div", {
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
  }, p === 'allowance' ? t('profileAllowance') : p === 'salary' ? t('profileSalary') : t('profileFreelance')))), s.incomeProfile === 'allowance' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:10px;')
  }, t('howOldQ')), /*#__PURE__*/React.createElement("input", {
    type: "number",
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
  }, t('investNo'))))), s.incomeProfile === 'salary' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
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
    type: "number",
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
  }, t('resetApp'))))), s.tab === 'metas' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:22px;font-weight:700;letter-spacing:-0.01em;margin-bottom:4px;')
  }, t('goals')), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;color:#86868b;margin-bottom:16px;')
  }, "Set savings targets and see how your money is split between them."), s.goals.length > 0 && (() => {
    const total = s.goals.reduce((a, g) => a + buildGoalView(g, false).monthlyBoosted, 0);
    const R = 46,
      C = 2 * Math.PI * R;
    let acc = 0;
    const segs = s.goals.map(g => {
      const v = buildGoalView(g, false).monthlyBoosted;
      const frac = total > 0 ? v / total : 0;
      const isCompleted = g.target > 0 && g.current >= g.target;
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
    }))), segs.length > 4 ? /*#__PURE__*/React.createElement("div", {
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
    }, seg.isCompleted ? t('completed') : seg.pct.toFixed(0) + '%')))) : (() => {
      const cols = Math.max(1, Math.ceil(Math.sqrt(Math.max(segs.length, 1))));
      return /*#__PURE__*/React.createElement("div", {
        style: css('flex:1;min-width:0;display:grid;grid-template-columns:repeat(' + cols + ',1fr);gap:10px 12px;')
      }, segs.map((seg, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: css('display:flex;align-items:center;gap:6px;min-width:0;')
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 9,
          height: 9,
          borderRadius: '50%',
          background: seg.color,
          flex: 'none'
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: css('min-width:0;')
      }, /*#__PURE__*/React.createElement("div", {
        style: css('font-size:12px;font-weight:700;color:#1d1d1f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;')
      }, seg.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11.5,
          fontWeight: 700,
          color: seg.color
        }
      }, seg.isCompleted ? t('completed') : seg.pct.toFixed(0) + '%')))));
    })());
  })(), (() => {
    const assignedTotal = s.goals.reduce((a, g) => a + buildGoalView(g, false).monthlyBoosted, 0);
    const unassigned = ctx.boostedAvailable - assignedTotal;
    return unassigned > 1 ? /*#__PURE__*/React.createElement("div", {
      style: css('background:linear-gradient(135deg,#0071e3,#34c759);border-radius:14px;padding:14px 16px;color:#fff;margin:12px 0 16px;')
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
    style: css('display:grid;grid-template-columns:repeat(auto-fill,minmax(86px,1fr));gap:10px;margin-bottom:20px;')
  }, s.goals.map(g => {
    const v = buildGoalView(g, false);
    const selected = g.id === s.selectedGoalId;
    return /*#__PURE__*/React.createElement("div", {
      key: g.id,
      onClick: () => selectGoal(g.id),
      style: {
        position: 'relative',
        background: selected ? '#eef6ff' : '#fff',
        border: 'none',
        borderRadius: 16,
        padding: '14px 8px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        cursor: 'pointer',
        boxShadow: selected ? '0 0 0 2px ' + g.color : 'none'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: e => {
        e.stopPropagation();
        removeGoal(g.id);
      },
      style: css('position:absolute;top:-7px;right:-7px;background:#fff;border:1px solid #f0f0f2;color:#ff3b30;width:20px;height:20px;border-radius:50%;cursor:pointer;font-size:12px;line-height:1;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.12);z-index:2;')
    }, "×"), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 40,
        height: 40,
        borderRadius: 11,
        background: g.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(GoalIconGlyph, {
      icon: g.icon,
      size: 20
    })), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:11.5px;font-weight:600;text-align:center;line-height:1.2;')
    }, g.name), /*#__PURE__*/React.createElement("div", {
      style: css('font-size:10.5px;color:#86868b;')
    }, v.progressLabel));
  }), s.goals.length < 6 && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      addGoal();
      dismissTabIntro('metas');
    },
    style: css('background:#fff;border:1.5px dashed #d2d2d7;border-radius:16px;padding:14px 8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;min-height:88px;')
  }, /*#__PURE__*/React.createElement("span", {
    style: css('font-size:22px;color:#0071e3;line-height:1;')
  }, "+"), /*#__PURE__*/React.createElement("span", {
    style: css('font-size:11px;color:#0071e3;font-weight:600;')
  }, "Goal"))), s.goals.length >= 6 && /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12px;color:#86868b;margin:-10px 0 16px;')
  }, "You already have 6 goals — the max. Fewer goals helps you prioritize."), !s.seenTabIntro.metas && /*#__PURE__*/React.createElement("div", {
    className: "tip-banner",
    style: css('display:flex;align-items:center;gap:12px;background:#fff;border-radius:16px;padding:16px 18px;margin-bottom:16px;box-shadow:0 8px 24px rgba(0,0,0,0.10);')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('flex:1;font-size:13px;color:#6e6e73;font-weight:400;line-height:1.3;')
  }, t('tabIntroGoals')), /*#__PURE__*/React.createElement("button", {
    onClick: () => dismissTabIntro('metas'),
    style: css('flex:none;background:#fff;color:#0071e3;border:1.5px solid #d2d2d7;padding:8px 15px;border-radius:9px;font-size:12.5px;font-weight:700;cursor:pointer;')
  }, t('gotIt'))), sg && /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border-radius:18px;padding:18px;margin-bottom:14px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:center;gap:12px;margin-bottom:14px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 11,
      background: sgSource.color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(GoalIconGlyph, {
    icon: sgSource.icon,
    size: 20
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: sgSource.name,
    onChange: e => updateGoal(sgSource.id, 'name', e.target.value),
    style: css('flex:1;min-width:0;font-size:16px;font-weight:600;border:none;background:transparent;padding:6px 0;')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowReminderPopup(v => !v),
    style: css('background:#f5f5f7;border:none;padding:6px 12px;border-radius:8px;font-size:11.5px;font-weight:600;color:#1d1d1f;cursor:pointer;white-space:nowrap;')
  }, sgSource.reminderOn ? s.language === 'es' ? 'Día ' + sgSource.reminderDay : 'Day ' + sgSource.reminderDay : t('setReminder')), showReminderPopup && /*#__PURE__*/React.createElement("div", {
    style: css('position:absolute;top:34px;right:0;z-index:20;background:#fff;border-radius:12px;padding:12px;box-shadow:0 12px 30px rgba(0,0,0,0.18);width:200px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:center;gap:6px;font-size:11.5px;color:#86868b;margin-bottom:12px;')
  }, /*#__PURE__*/React.createElement("span", null, s.language === 'es' ? 'día' : 'day'), /*#__PURE__*/React.createElement("input", {
    type: "number",
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
  }, t('done'))))), /*#__PURE__*/React.createElement("div", {
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
    type: "number",
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
  }, t('current')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditingCurrent(v => !v),
    style: css('background:none;border:none;color:#0071e3;font-size:10px;font-weight:700;cursor:pointer;padding:0;')
  }, editingCurrent ? t('done') : t('edit'))), editingCurrent ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: css('position:absolute;left:8px;top:50%;transform:translateY(-50%);font-size:14px;color:#86868b;pointer-events:none;')
  }, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    autoFocus: true,
    value: sgSource.current || '',
    onChange: e => updateGoal(sgSource.id, 'current', parseFloat(e.target.value) || 0),
    onKeyDown: e => {
      if (e.key === 'Enter') setEditingCurrent(false);
    },
    style: css('width:100%;padding:6px 8px 6px 18px;border:1px solid #e5e5ea;border-radius:8px;font-size:15px;font-weight:700;background:#fbfbfd;')
  })) : /*#__PURE__*/React.createElement("div", {
    style: css('font-size:16px;font-weight:700;color:#1d1d1f;margin-top:3px;')
  }, fmt(sgSource.current)))), /*#__PURE__*/React.createElement("div", {
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
    type: "number",
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
        alignItems: 'center',
        gap: 10
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
      style: css('font-size:10px;color:#86868b;line-height:1.4;')
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
  })()), sgSource.savingsLog && sgSource.savingsLog.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10.5px;color:#86868b;font-weight:600;margin-top:12px;margin-bottom:4px;')
  }, t('savingsLogged')), sgSource.savingsLog.map(entry => /*#__PURE__*/React.createElement("div", {
    key: entry.id,
    style: css('display:flex;justify-content:space-between;align-items:center;font-size:12.5px;color:#6e6e73;padding:4px 0;border-bottom:1px solid #f5f5f7;')
  }, /*#__PURE__*/React.createElement("span", null, entry.label), /*#__PURE__*/React.createElement("span", {
    style: css('display:flex;align-items:center;gap:8px;')
  }, fmt(entry.amount), /*#__PURE__*/React.createElement("button", {
    onClick: () => removeSavingsLogEntry(sgSource.id, entry.id),
    style: css('background:none;border:none;color:#ff3b30;cursor:pointer;font-size:14px;')
  }, "×"))))), /*#__PURE__*/React.createElement("div", {
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
      style: css('display:flex;gap:12px;overflow-x:auto;padding-bottom:4px;-webkit-overflow-scrolling:touch;')
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
          gap: 4
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
        stroke: done ? '#34c759' : sgSource.color,
        strokeWidth: "3.5",
        strokeLinecap: "round",
        strokeDasharray: C2,
        strokeDashoffset: C2 * (1 - pct / 100),
        transform: "rotate(-90 18 18)"
      }), done && /*#__PURE__*/React.createElement("path", {
        d: "M11.5 18.5l4 4 9-9",
        fill: "none",
        stroke: "#34c759",
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
  }, /*#__PURE__*/React.createElement("label", {
    style: css('display:block;font-size:11.5px;color:#86868b;font-weight:600;margin-bottom:8px;')
  }, "% of monthly savings"), sgSource.mode === 'manual' ? /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;align-items:baseline;gap:5px;font-size:13px;color:#86868b;margin-bottom:8px;')
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    max: "100",
    value: sgSource.percent || '',
    onChange: e => updateGoal(sgSource.id, 'percent', Math.max(0, Math.min(100, parseFloat(e.target.value) || 0))),
    style: css('width:42px;padding:2px 3px;border:none;border-bottom:1.5px solid #0071e3;font-size:14px;font-weight:700;color:#1d1d1f;background:transparent;text-align:center;')
  }), /*#__PURE__*/React.createElement("span", null, "% → ", sg.monthlyLabel, "/mo")) : /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12.5px;color:#1d1d1f;background:#f5f5f7;border-radius:10px;padding:9px 10px;margin-bottom:8px;')
  }, /*#__PURE__*/React.createElement("b", null, sg.percentLabel), " → ", /*#__PURE__*/React.createElement("b", null, sg.monthlyLabel), "/mo"), /*#__PURE__*/React.createElement("button", {
    onClick: () => toggleGoalMode(sgSource.id),
    style: css('display:block;margin-left:auto;background:#f5f5f7;border:none;padding:5px 10px;border-radius:8px;font-size:11.5px;font-weight:600;color:#1d1d1f;cursor:pointer;')
  }, sgSource.mode === 'manual' ? 'Manual' : 'Auto'), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:11.5px;color:#6e6e73;margin-top:10px;padding-top:10px;border-top:1px solid #f5f5f7;')
  }, "You'll reach your goal in ", /*#__PURE__*/React.createElement("b", {
    style: css('color:#1d1d1f;')
  }, sg.estDateLabel), " (", sg.monthsLabel, ")")), /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border:1px solid #f0f0f2;border-radius:14px;padding:14px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12.5px;font-weight:700;color:#1d1d1f;margin-bottom:3px;')
  }, t('hitDate')), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:10.5px;color:#86868b;margin-bottom:8px;line-height:1.35;')
  }, s.language === 'es' ? 'Pon la fecha en la que necesitas o quieres lograrla.' : 'Set the date you need or want this goal done by.'), /*#__PURE__*/React.createElement("input", {
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
  }, sg.customMsg))), /*#__PURE__*/React.createElement("div", {
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
    style: css('position:absolute;top:28px;left:0;z-index:20;background:#fff;border-radius:12px;padding:10px;box-shadow:0 12px 30px rgba(0,0,0,0.18);display:flex;gap:6px;flex-wrap:wrap;width:112px;')
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
    style: css('position:absolute;top:32px;left:0;z-index:20;background:#fff;border-radius:12px;padding:10px;box-shadow:0 12px 30px rgba(0,0,0,0.18);display:flex;gap:6px;flex-wrap:wrap;width:130px;')
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
      actualSeries.push(monthsElapsed > 0 ? sgSource.current * i / monthsElapsed : sgSource.current);
    }
    const projSeries = [];
    for (let i = 0; i <= N_future; i++) {
      projSeries.push(Math.min(sgSource.current + sg.monthlyBoosted * i, capVal));
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
      cy: yAt(sgSource.current),
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
  }), s.language === 'es' ? 'Proyección' : 'Projected'))))), s.tab === 'gastos' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:22px;font-weight:700;letter-spacing:-0.01em;margin-bottom:16px;')
  }, "Expenses", /*#__PURE__*/React.createElement(InfoTip, {
    text: "Tap a day to view or log expenses. Tap the month to see the full summary."
  })), /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border-radius:16px;padding:16px;margin-bottom:14px;')
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
  }, t('gotIt'))), selectedDate && /*#__PURE__*/React.createElement("div", {
    style: css('background:#fff;border-radius:16px;padding:16px;margin-bottom:14px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:12px;')
  }, (() => {
    const d = new Date(selectedDate + 'T00:00:00');
    return MONTH_NAMES[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  })()), selectedDayActualEntries.length === 0 && selectedDayPlannedEntries.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12.5px;color:#86868b;margin-bottom:12px;')
  }, "Nothing logged for this day yet."), selectedDayActualEntries.map(entry => /*#__PURE__*/React.createElement("div", {
    key: entry.id,
    style: css('display:flex;justify-content:space-between;align-items:center;font-size:13px;padding:6px 0;border-bottom:1px solid #f0f0f2;')
  }, /*#__PURE__*/React.createElement("span", null, entry.name || 'Expense', /*#__PURE__*/React.createElement("span", {
    style: css('color:#86868b;font-size:11px;')
  }, " · ", entry.recurring ? 'recurring' : 'non-recurring', " · spent")), /*#__PURE__*/React.createElement("span", {
    style: css('display:flex;align-items:center;gap:8px;')
  }, fmt(entry.amount), /*#__PURE__*/React.createElement("button", {
    onClick: () => removeLogEntry(entry.id),
    style: css('background:none;border:none;color:#ff3b30;cursor:pointer;font-size:14px;')
  }, "×")))), selectedDayPlannedEntries.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: css('display:flex;justify-content:space-between;align-items:center;font-size:13px;padding:6px 0;border-bottom:1px solid #f0f0f2;')
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
  }, "×")))), /*#__PURE__*/React.createElement("div", {
    style: css('border-top:1px solid #f0f0f2;margin-top:12px;padding-top:14px;')
  }, /*#__PURE__*/React.createElement("label", {
    style: css('display:block;font-size:11.5px;color:#86868b;font-weight:600;margin-bottom:8px;')
  }, "Log an expense for this day"), /*#__PURE__*/React.createElement("div", {
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
      padding: 9,
      borderRadius: 9,
      fontSize: 12.5,
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Recurring"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setLogType('nonrecurring'),
    style: {
      flex: 1,
      background: logType !== 'recurring' ? '#0071e3' : '#f5f5f7',
      color: logType !== 'recurring' ? '#fff' : '#1d1d1f',
      border: 'none',
      padding: 9,
      borderRadius: 9,
      fontSize: 12.5,
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Non-recurring")), logType === 'recurring' ? /*#__PURE__*/React.createElement("select", {
    value: effectiveLogCategory,
    onChange: e => {
      setLogCategory(e.target.value);
      fillRecurringAmount(e.target.value, s);
    },
    style: css('width:100%;padding:9px 10px;border:1px solid #e5e5ea;border-radius:10px;font-size:13px;background:#fbfbfd;margin-bottom:8px;')
  }, recurringCategoryOptions.map((n, i) => /*#__PURE__*/React.createElement("option", {
    key: i,
    value: n
  }, n))) : /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Expense name (e.g. repair, gift)",
    value: logName,
    onChange: e => setLogName(e.target.value),
    style: css('width:100%;padding:9px 10px;border:1px solid #e5e5ea;border-radius:10px;font-size:13px;background:#fbfbfd;margin-bottom:8px;')
  }), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:8px;')
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    placeholder: "Amount spent",
    value: logAmount,
    onChange: e => {
      setLogAmount(e.target.value);
      dismissTabIntro('gastos');
    },
    style: css('flex:1;padding:9px 10px;border:1px solid #e5e5ea;border-radius:10px;font-size:13px;background:#fbfbfd;')
  }), /*#__PURE__*/React.createElement("button", {
    onClick: addLogEntry,
    style: css('background:#0071e3;color:#fff;border:none;padding:9px 16px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;')
  }, "Log")))), true && /*#__PURE__*/React.createElement("div", {
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
  })())), /*#__PURE__*/React.createElement("div", {
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
    type: "number",
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
    type: "number",
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
    style: css('background:linear-gradient(135deg,#0071e3,#34c759);border-radius:20px;padding:22px;color:#fff;margin-bottom:18px;box-shadow:0 16px 40px rgba(0,113,227,0.25);')
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
      type: "number",
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
    style: css('width:100%;padding:13px;background:#34c759;color:#fff;border:none;border-radius:14px;font-size:14.5px;font-weight:600;cursor:pointer;')
  }, t('addSideHustle')), !s.seenTabIntro.extra && /*#__PURE__*/React.createElement("div", {
    className: "tip-banner",
    style: css('display:flex;align-items:center;gap:12px;background:#fff;border-radius:16px;padding:16px 18px;margin-top:16px;margin-bottom:16px;box-shadow:0 8px 24px rgba(0,0,0,0.10);')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('flex:1;font-size:13px;color:#6e6e73;font-weight:400;line-height:1.3;')
  }, t('tabIntroExtra')), /*#__PURE__*/React.createElement("button", {
    onClick: () => dismissTabIntro('extra'),
    style: css('flex:none;background:#fff;color:#0071e3;border:1.5px solid #d2d2d7;padding:8px 15px;border-radius:9px;font-size:12.5px;font-weight:700;cursor:pointer;')
  }, t('gotIt')))), s.tab === 'invest' && !hideInvestTab && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:22px;font-weight:700;letter-spacing:-0.01em;margin-bottom:16px;')
  }, t('investments'), /*#__PURE__*/React.createElement(InfoTip, {
    text: "Track what's growing your money outside your goals. Update the current value every so often — 6 months is a good rhythm."
  })), /*#__PURE__*/React.createElement("div", {
    style: css('background:linear-gradient(135deg,#0071e3,#34c759);border-radius:20px;padding:22px;color:#fff;margin-bottom:18px;box-shadow:0 16px 40px rgba(0,113,227,0.25);')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;opacity:0.85;')
  }, "Current value"), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:36px;font-weight:700;margin:4px 0 4px;')
  }, fmt(investmentValueTotal)), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13px;opacity:0.9;margin-bottom:10px;')
  }, fmt(investmentTotal), " invested · ", (() => {
    const g = investmentValueTotal - investmentTotal;
    const pct = investmentTotal > 0 ? g / investmentTotal * 100 : 0;
    return (g >= 0 ? '+' : '−') + fmt(Math.abs(g)) + ' (' + (g >= 0 ? '+' : '−') + Math.abs(pct).toFixed(1) + '%)';
  })()), /*#__PURE__*/React.createElement("div", {
    style: css('font-size:13.5px;line-height:1.5;opacity:0.95;')
  }, s.investments.length === 0 ? 'Add an investment below to start tracking it.' : 'Across ' + s.investments.length + (s.investments.length === 1 ? ' investment.' : ' investments.'))), investmentViews.map(inv => /*#__PURE__*/React.createElement("div", {
    key: inv.id,
    style: css('background:#fff;border-radius:16px;padding:16px;margin-bottom:12px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:10px;align-items:center;margin-bottom:10px;')
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: inv.name,
    onChange: e => updateInvestment(inv.id, 'name', e.target.value),
    style: css('flex:1;min-width:0;font-size:15px;font-weight:600;border:none;background:transparent;padding:4px 0;')
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => removeInvestment(inv.id),
    style: css('background:#f5f5f7;border:none;color:#ff3b30;width:26px;height:26px;border-radius:8px;cursor:pointer;font-size:14px;')
  }, "×")), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;gap:10px;align-items:center;flex-wrap:wrap;')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('flex:1;min-width:90px;')
  }, /*#__PURE__*/React.createElement("label", {
    style: css('display:block;font-size:11px;color:#86868b;font-weight:600;margin-bottom:4px;')
  }, "Amount invested"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: inv.amount || '',
    onChange: e => updateInvestment(inv.id, 'amount', e.target.value),
    style: css('width:100%;padding:8px 10px;border:1px solid #e5e5ea;border-radius:9px;font-size:13.5px;background:#fbfbfd;')
  })), /*#__PURE__*/React.createElement("div", {
    style: css('flex:1;min-width:90px;')
  }, /*#__PURE__*/React.createElement("label", {
    style: css('display:block;font-size:11px;color:#86868b;font-weight:600;margin-bottom:4px;')
  }, "Current value"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: inv.currentValue || '',
    onChange: e => updateInvestment(inv.id, 'currentValue', e.target.value),
    style: css('width:100%;padding:8px 10px;border:1px solid #e5e5ea;border-radius:9px;font-size:13.5px;background:#fbfbfd;')
  }))), /*#__PURE__*/React.createElement("div", {
    style: css('display:flex;justify-content:space-between;align-items:center;margin-top:10px;')
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: inv.gainAmount >= 0 ? '#34c759' : '#ff3b30'
    }
  }, inv.gainAmount >= 0 ? '+' : '−', fmt(Math.abs(inv.gainAmount)), " (", inv.gainAmount >= 0 ? '+' : '−', Math.abs(inv.gainPct).toFixed(1), "%)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: inv.isStale ? '#ff9500' : '#86868b'
    }
  }, "as of ", inv.dateLabel)), inv.isStale && /*#__PURE__*/React.createElement("button", {
    onClick: () => markInvestmentUpdated(inv.id),
    style: css('width:100%;margin-top:10px;background:#fff2e5;border:none;color:#ff9500;border-radius:8px;padding:8px;font-size:11.5px;font-weight:700;cursor:pointer;')
  }, "🔔 It's been ", inv.monthsSince, " months — update the value?"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      addInvestment();
      dismissTabIntro('invest');
    },
    style: css('width:100%;padding:13px;background:#0071e3;color:#fff;border:none;border-radius:14px;font-size:14.5px;font-weight:600;cursor:pointer;')
  }, t('addInvestment')), !s.seenTabIntro.invest && /*#__PURE__*/React.createElement("div", {
    className: "tip-banner",
    style: css('display:flex;align-items:center;gap:12px;background:#fff;border-radius:16px;padding:16px 18px;margin-top:16px;margin-bottom:16px;box-shadow:0 8px 24px rgba(0,0,0,0.10);')
  }, /*#__PURE__*/React.createElement("div", {
    style: css('flex:1;font-size:13px;color:#6e6e73;font-weight:400;line-height:1.3;')
  }, t('tabIntroInvest')), /*#__PURE__*/React.createElement("button", {
    onClick: () => dismissTabIntro('invest'),
    style: css('flex:none;background:#fff;color:#0071e3;border:1.5px solid #d2d2d7;padding:8px 15px;border-radius:9px;font-size:12.5px;font-weight:700;cursor:pointer;')
  }, t('gotIt')))))), /*#__PURE__*/React.createElement("div", {
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