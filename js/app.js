'use strict';
/* =========================================================
   Crónicas del Aventurero — app de hábitos estilo RPG
   Todo se guarda en el propio celular (localStorage).
   ========================================================= */

const STORE_KEY = 'cronicas-aventurero-v1';

/* ---------- Datos del juego ---------- */
const AREAS = {
  salud:        { name: 'Salud', short: 'Salud',            icon: '❤️', attr: 'Vitalidad', abbr: 'VIT' },
  ejercicio:    { name: 'Ejercicio', short: 'Ejercicio',        icon: '⚔️', attr: 'Fuerza',    abbr: 'FUE' },
  conocimiento: { name: 'Conocimiento', short: 'Saber',     icon: '📜', attr: 'Intelecto', abbr: 'INT' },
  hobbies:      { name: 'Hobbies', short: 'Hobbies',          icon: '🎨', attr: 'Destreza',  abbr: 'DES' },
  profesional:  { name: 'Vida profesional', short: 'Trabajo', icon: '💼', attr: 'Prestigio', abbr: 'PRE' },
  mente:        { name: 'Mente y espíritu', short: 'Mente', icon: '🔮', attr: 'Maná',      abbr: 'MAN' },
  social:       { name: 'Social y familia', short: 'Social', icon: '🤝', attr: 'Carisma',   abbr: 'CAR' },
  finanzas:     { name: 'Finanzas y hogar', short: 'Finanzas', icon: '🪙', attr: 'Fortuna',   abbr: 'FOR' },
};
const AREA_KEYS = Object.keys(AREAS);

const DIFF = [
  { name: 'Fácil',   xp: 10, gold: 4,  dmg: 3 },
  { name: 'Normal',  xp: 20, gold: 8,  dmg: 5 },
  { name: 'Difícil', xp: 35, gold: 14, dmg: 8 },
  { name: 'Épica',   xp: 60, gold: 25, dmg: 12 },
];

// Rangos al estilo de las escuelas de magia: Principiante → Dios.
const RANKS = ['Principiante', 'Intermedio', 'Avanzado', 'Santo', 'Rey', 'Emperador', 'Dios'];
const HERO_RANK_LV = [1, 5, 10, 18, 28, 40, 55];
const ATTR_RANK_LV = [1, 3, 6, 10, 15, 21, 28];

const DAY_NAMES = ['D', 'L', 'M', 'X', 'J', 'V', 'S']; // índice = getDay() (0 = domingo)
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

const CLASSES = {
  aventurero: { name: 'Aventurero', fem: 'Aventurera', icon: '🧭', desc: '+5% XP en todas las áreas', bonus: 'all' },
  mago:       { name: 'Mago', fem: 'Maga',       icon: '🧙', desc: '+15% XP en Conocimiento y Mente', bonus: ['conocimiento', 'mente'] },
  espadachin: { name: 'Espadachín', fem: 'Espadachina', icon: '🗡️', desc: '+15% XP en Ejercicio y Salud', bonus: ['ejercicio', 'salud'] },
  sanador:    { name: 'Sanador', fem: 'Sanadora',    icon: '🌿', desc: '+15% XP en Salud y Mente', bonus: ['salud', 'mente'] },
  erudito:    { name: 'Erudito', fem: 'Erudita',    icon: '📚', desc: '+15% XP en Conocimiento y Profesional', bonus: ['conocimiento', 'profesional'] },
  bardo:      { name: 'Bardo', fem: 'Barda',      icon: '🎻', desc: '+15% XP en Hobbies y Social', bonus: ['hobbies', 'social'] },
  mercader:   { name: 'Mercader', fem: 'Mercader',   icon: '⚖️', desc: '+15% XP en Finanzas y Profesional', bonus: ['finanzas', 'profesional'] },
};

const THEMES = {
  taberna: { name: 'Taberna del Gremio',  desc: 'Madera, luz dorada y fuego de chimenea', sw: ['#1e130d', '#f0a04a', '#e8b864', '#4aa8e0'] },
  cronica: { name: 'Crónica del Viajero', desc: 'Azul noche, turquesa, oro y carmesí', sw: ['#121a2b', '#3fb8af', '#d4a64a', '#b23a48'] },
  arcano:  { name: 'Arcano Azul',         desc: 'Azules de maga del agua y plata',     sw: ['#0b1430', '#5aa9e6', '#b9cbe6', '#8f7ae0'] },
  carmesi: { name: 'Furia Carmesí',       desc: 'Rojo de espadachina, vino y oro',     sw: ['#170b0e', '#e0364c', '#e0b04f', '#7a1f2b'] },
  bosque:  { name: 'Bosque Plateado',     desc: 'Verde élfico, plata y madera',         sw: ['#0e1c15', '#74c27a', '#d7dfda', '#a8865c'] },
};

// type: daily = tarea diaria, habit = hábito +/−, quest = misión única
const TEMPLATES = {
  salud: [
    { t: 'Beber 8 vasos de agua', type: 'daily', diff: 0 },
    { t: 'Dormir 7–8 horas', type: 'daily', diff: 1 },
    { t: 'Comer frutas y verduras', type: 'daily', diff: 0 },
    { t: 'Tomar vitaminas / medicamentos', type: 'daily', diff: 0 },
    { t: 'Comida chatarra', type: 'habit', diff: 1, neg: true },
    { t: 'Agendar revisión médica', type: 'quest', diff: 2 },
  ],
  ejercicio: [
    { t: 'Caminar 30 minutos', type: 'daily', diff: 1 },
    { t: 'Entrenamiento de fuerza', type: 'daily', diff: 2, days: [1, 3, 5] },
    { t: 'Estirar 10 minutos', type: 'daily', diff: 0 },
    { t: 'Llegar a 10 000 pasos', type: 'daily', diff: 1 },
    { t: 'Usar escaleras en vez de elevador', type: 'habit', diff: 0 },
    { t: 'Correr 5 km por primera vez', type: 'quest', diff: 3 },
  ],
  conocimiento: [
    { t: 'Leer 20 páginas', type: 'daily', diff: 1 },
    { t: 'Estudiar un idioma 15 min', type: 'daily', diff: 1 },
    { t: 'Aprender algo nuevo y anotarlo', type: 'daily', diff: 0 },
    { t: 'Ver una clase o documental', type: 'habit', diff: 1 },
    { t: 'Terminar un libro', type: 'quest', diff: 3 },
  ],
  hobbies: [
    { t: 'Practicar un instrumento', type: 'daily', diff: 1 },
    { t: 'Dibujar o pintar', type: 'habit', diff: 1 },
    { t: 'Escribir una página creativa', type: 'habit', diff: 0 },
    { t: 'Cocinar una receta nueva', type: 'quest', diff: 1 },
    { t: 'Terminar un proyecto personal', type: 'quest', diff: 3 },
  ],
  profesional: [
    { t: 'Planificar el día', type: 'daily', diff: 0 },
    { t: 'Bloque de trabajo profundo (90 min)', type: 'daily', diff: 2, days: [1, 2, 3, 4, 5] },
    { t: 'Bandeja de entrada en cero', type: 'daily', diff: 1, days: [1, 2, 3, 4, 5] },
    { t: 'Curso profesional 30 min', type: 'habit', diff: 1 },
    { t: 'Procrastinar', type: 'habit', diff: 1, neg: true },
    { t: 'Actualizar CV / portafolio', type: 'quest', diff: 2 },
  ],
  mente: [
    { t: 'Meditar 10 minutos', type: 'daily', diff: 0 },
    { t: 'Diario de gratitud', type: 'daily', diff: 0 },
    { t: 'Sin pantallas 1 h antes de dormir', type: 'daily', diff: 1 },
    { t: 'Redes sociales sin control', type: 'habit', diff: 1, neg: true },
  ],
  social: [
    { t: 'Llamar a un familiar o amigo', type: 'habit', diff: 0 },
    { t: 'Comer sin celular en la mesa', type: 'habit', diff: 1 },
    { t: 'Hacer un acto de amabilidad', type: 'habit', diff: 0 },
    { t: 'Organizar una reunión con amigos', type: 'quest', diff: 2 },
  ],
  finanzas: [
    { t: 'Registrar mis gastos', type: 'daily', diff: 0 },
    { t: 'Ordenar la casa 10 min', type: 'daily', diff: 0 },
    { t: 'Ahorrar una cantidad', type: 'habit', diff: 1 },
    { t: 'Compra impulsiva', type: 'habit', diff: 1, neg: true },
    { t: 'Pagar facturas del mes', type: 'quest', diff: 1 },
  ],
};
const ONBOARD_DEFAULT_PICKS = ['salud:0', 'ejercicio:0', 'conocimiento:0', 'mente:0', 'profesional:0'];

// Cada jefe semanal encarna un vicio que combates con tus hábitos.
const BOSSES = [
  { name: 'Wyrm de la Pereza',              icon: '🐉', vice: 'Pereza',        lore: 'Duerme sobre un tesoro de planes que nunca empezaste. Cada tarea cumplida le arranca una escama.' },
  { name: 'Lich de la Procrastinación',     icon: '💀', vice: 'Procrastinación', lore: 'Susurra "mañana" desde su cripta. Su filacteria se rompe con acción constante.' },
  { name: 'Sirena de la Distracción',       icon: '🧜', vice: 'Distracción',   lore: 'Canta notificaciones infinitas para hundir a los navegantes. Tapa tus oídos y avanza.' },
  { name: 'Ogro del Atracón',               icon: '👹', vice: 'Excesos',       lore: 'Devora todo a su paso y deja a los aldeanos sin fuerzas. La disciplina es su debilidad.' },
  { name: 'Espectro del Insomnio',          icon: '👻', vice: 'Mal descanso',  lore: 'Ronda tu habitación a las 3 a. m. La rutina y el descanso lo disipan.' },
  { name: 'Hidra de las Excusas',           icon: '🐍', vice: 'Excusas',       lore: 'Por cada excusa cortada crecen dos. Solo los hechos la derrotan.' },
  { name: 'Gólem del Estrés',               icon: '🗿', vice: 'Estrés',        lore: 'Un coloso de piedra hecho de pendientes acumulados. Se agrieta con calma y orden.' },
  { name: 'Conde Vampiro del Scroll',       icon: '🧛', vice: 'Scroll infinito', lore: 'Te drena el tiempo pantalla tras pantalla. La luz de tus metas lo quema.' },
  { name: 'Reina Aracnea del Desorden',     icon: '🕷️', vice: 'Desorden',      lore: 'Teje telarañas en cada rincón olvidado. Cada espacio ordenado corta un hilo.' },
  { name: 'Mantícora del Derroche',         icon: '🦂', vice: 'Derroche',      lore: 'Su aguijón vacía bolsas de oro. El ahorro y la prudencia la mantienen a raya.' },
];

// desc = efecto en el juego; lore = descripción del objeto en el mundo.
const SHOP_ITEMS = [
  { id: 'bread',  name: 'Hogaza de la taberna', icon: '🍞', cost: 12, desc: 'Restaura 10 PV.',
    lore: 'Pan recién horneado por la tabernera, todavía tibio y con corteza crujiente. Nada cura mejor un mal día que una comida caliente.' },
  { id: 'potion', name: 'Poción de curación',  icon: '🧪', cost: 30, desc: 'Restaura 25 PV al instante.',
    lore: 'Destilada por la boticaria del gremio con hierbas de montaña y una gota de maná curativo. Sabe a menta y a hierro.' },
  { id: 'shield', name: 'Pergamino protector', icon: '📜', cost: 60, desc: 'Si fallas diarias un día, protege tus rachas y tu vida. Se usa solo.',
    lore: 'Un sello de protección escrito en lengua antigua. Al amanecer absorbe el castigo de tus olvidos y se deshace en ceniza.' },
  { id: 'elixir', name: 'Elixir de sabiduría', icon: '✨', cost: 90, desc: 'Doble XP en tus próximas 5 tareas.',
    lore: 'Brilla como polvo de estrellas dentro de la botella. Afila la mente y duplica lo que aprendes de cada hazaña.' },
];

const DEFAULT_REWARDS = [
  { title: 'Ver un episodio de anime', icon: '📺', cost: 40, desc: 'Un capítulo de tu serie favorita, sin culpa.' },
  { title: 'Mi postre favorito', icon: '🍰', cost: 60, desc: 'El dulce que más te gusta, disfrutado con calma.' },
  { title: 'Una hora de videojuegos', icon: '🎮', cost: 80, desc: 'Otra aventura, esta vez en la pantalla.' },
  { title: 'Comprar un libro o manga', icon: '📖', cost: 250, desc: 'Un nuevo tomo para tu biblioteca.' },
];
const REWARD_ICONS = ['🎁', '📺', '🍰', '🎮', '📖', '☕', '🍕', '🎬', '🛍️', '🎧', '🛀', '🏖️', '🍺', '🗡️', '🎻', '🌙'];

// Íconos que se pueden asignar a cada tarea.
const TASK_ICONS = ['💧', '🥗', '💊', '🛏️', '🏃', '🏋️', '🧘', '🚶', '📚', '✍️', '🗣️', '🧠', '🎸', '🎨', '🍳', '🎮',
  '💼', '📧', '📈', '💰', '🧹', '🪴', '🤝', '📞', '⚔️', '🛡️', '🏹', '🪄', '📜', '🗝️', '🍺', '🐉'];

const ACHIEVEMENTS = [
  { id: 'c1',      icon: '👣', name: 'Primer paso',          desc: 'Completa tu primera tarea',   test: (s) => s.stats.completed >= 1 },
  { id: 'c10',     icon: '🗡️', name: 'Aprendiz constante',   desc: '10 tareas completadas',       test: (s) => s.stats.completed >= 10 },
  { id: 'c50',     icon: '⚔️', name: 'Aventurero curtido',   desc: '50 tareas completadas',       test: (s) => s.stats.completed >= 50 },
  { id: 'c200',    icon: '🏅', name: 'Veterano del gremio',  desc: '200 tareas completadas',      test: (s) => s.stats.completed >= 200 },
  { id: 'c1000',   icon: '👑', name: 'Leyenda viviente',     desc: '1000 tareas completadas',     test: (s) => s.stats.completed >= 1000 },
  { id: 'r7',      icon: '🔥', name: 'Llama encendida',      desc: 'Racha de 7 días',             test: (s) => bestStreak(s) >= 7 },
  { id: 'r30',     icon: '☄️', name: 'Fuego eterno',         desc: 'Racha de 30 días',            test: (s) => bestStreak(s) >= 30 },
  { id: 'r100',    icon: '🌋', name: 'Voluntad de acero',    desc: 'Racha de 100 días',           test: (s) => bestStreak(s) >= 100 },
  { id: 'lv5',     icon: '🥉', name: 'Rango Intermedio',     desc: 'Alcanza el nivel 5',          test: (s) => s.hero.lv >= 5 },
  { id: 'lv10',    icon: '🥈', name: 'Rango Avanzado',       desc: 'Alcanza el nivel 10',         test: (s) => s.hero.lv >= 10 },
  { id: 'lv18',    icon: '🥇', name: 'Rango Santo',          desc: 'Alcanza el nivel 18',         test: (s) => s.hero.lv >= 18 },
  { id: 'lv28',    icon: '💎', name: 'Rango Rey',            desc: 'Alcanza el nivel 28',         test: (s) => s.hero.lv >= 28 },
  { id: 'lv40',    icon: '🌟', name: 'Rango Emperador',      desc: 'Alcanza el nivel 40',         test: (s) => s.hero.lv >= 40 },
  { id: 'lv55',    icon: '🌌', name: 'Rango Dios',           desc: 'Alcanza el nivel 55',         test: (s) => s.hero.lv >= 55 },
  { id: 'boss1',   icon: '🐲', name: 'Cazador de bestias',   desc: 'Derrota a tu primer jefe',    test: (s) => s.stats.bosses >= 1 },
  { id: 'boss5',   icon: '🏹', name: 'Matadragones',         desc: 'Derrota 5 jefes',             test: (s) => s.stats.bosses >= 5 },
  { id: 'perfect1',icon: '🌅', name: 'Día perfecto',         desc: 'Completa todas tus diarias',  test: (s) => s.stats.perfect >= 1 },
  { id: 'perfect7',icon: '🌞', name: 'Semana de oro',        desc: '7 días perfectos',            test: (s) => s.stats.perfect >= 7 },
  { id: 'quest10', icon: '📯', name: 'Cumplidor de encargos',desc: '10 misiones únicas',          test: (s) => s.stats.quests >= 10 },
  { id: 'gold500', icon: '💰', name: 'Tesoro del dragón',    desc: 'Gana 500 de oro en total',    test: (s) => s.stats.goldEarned >= 500 },
  { id: 'balance', icon: '⚖️', name: 'Vida equilibrada',     desc: 'Todas las áreas en nivel 2',  test: (s) => AREA_KEYS.every((k) => s.attrs[k].lv >= 2) },
  { id: 'master',  icon: '🔮', name: 'Maestro de un arte',   desc: 'Un área en rango Avanzado',   test: (s) => AREA_KEYS.some((k) => s.attrs[k].lv >= ATTR_RANK_LV[2]) },
  { id: 'reward1', icon: '🍻', name: 'Merecido descanso',    desc: 'Canjea una recompensa',       test: (s) => s.stats.rewards >= 1 },
  { id: 'fall',    icon: '🩹', name: 'Levántate de nuevo',   desc: 'Cae en batalla y regresa',    test: (s) => s.stats.deaths >= 1 },
];

/* ---------- Utilidades ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function dstr(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
const today = () => dstr(new Date());
function addDays(s, n) { const d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return dstr(d); }
const dow = (s) => new Date(s + 'T12:00:00').getDay();
const weekKey = (s) => addDays(s, -((dow(s) + 6) % 7)); // lunes de esa semana
function prettyDate(s) {
  return new Date(s + 'T12:00:00').toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' });
}

const xpToNext = (lv) => 100 + (lv - 1) * 25;
const attrXpToNext = (lv) => 40 + (lv - 1) * 20;
const maxHp = () => 50 + Math.floor((state.hero?.lv || 1) / 5) * 10;
function rankOf(lv, table) { let r = 0; table.forEach((min, i) => { if (lv >= min) r = i; }); return RANKS[r]; }
const heroRank = (lv) => rankOf(lv, HERO_RANK_LV);
const attrRank = (lv) => rankOf(lv, ATTR_RANK_LV);
const bestStreak = (s) => s.habits.reduce((m, h) => Math.max(m, h.best || 0), s.bestEver || 0);
const gems = (d) => '◆'.repeat(d + 1) + '◇'.repeat(3 - d);

/* ---------- Estado ---------- */
function newState() {
  return {
    v: 1,
    hero: null,
    attrs: Object.fromEntries(AREA_KEYS.map((k) => [k, { lv: 1, xp: 0 }])),
    habits: [],
    archive: [],
    rewards: DEFAULT_REWARDS.map((r) => ({ id: uid(), ...r })),
    inv: { shield: 0 },
    buffs: { xp: 0 },
    log: {},
    boss: null,
    bossIdx: 0,
    ach: {},
    bestEver: 0,
    stats: { completed: 0, quests: 0, bad: 0, rewards: 0, deaths: 0, perfect: 0, bosses: 0, goldEarned: 0 },
    settings: { theme: 'taberna', vibrate: true },
    lastDate: null,
  };
}

function migrate(s) {
  const b = newState();
  if (s.hero) s.hero = { owned: [], ...s.hero, avatar: { ...DEFAULT_AVATAR, ...s.hero.avatar } };
  return {
    ...b, ...s,
    attrs: { ...b.attrs, ...s.attrs },
    inv: { ...b.inv, ...s.inv },
    buffs: { ...b.buffs, ...s.buffs },
    stats: { ...b.stats, ...s.stats },
    settings: { ...b.settings, ...s.settings },
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return migrate(JSON.parse(raw));
  } catch (e) { console.warn(e); }
  return newState();
}

function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
  catch (e) { toast('⚠️ No se pudo guardar el progreso'); }
}

let state = load();
const ui = { tab: 'misiones', filter: 'daily', area: 'all', guild: 'logros' };
let events = [];       // eventos que se muestran como modal/toast tras una acción
let editor = null;     // borrador del editor de tareas
let rewardEditor = null;
let onboard = null;
let avatarEdit = null; // { draft, target: 'hero' | 'onboard' }
let installPrompt = null;

/* ---------- Mecánicas ---------- */
function classBonus(area) {
  const c = CLASSES[state.hero.cls];
  if (!c) return 0;
  if (c.bonus === 'all') return 0.05;
  return c.bonus.includes(area) ? 0.15 : 0;
}

function addHeroXp(n) {
  const h = state.hero;
  h.xp += n;
  while (h.xp >= xpToNext(h.lv)) {
    h.xp -= xpToNext(h.lv);
    const before = heroRank(h.lv);
    h.lv++;
    h.hp = maxHp();
    const after = heroRank(h.lv);
    events.push({ type: 'level', lv: h.lv, rank: after !== before ? after : null });
  }
}

function addAttrXp(area, n) {
  const a = state.attrs[area];
  a.xp += n;
  while (a.xp >= attrXpToNext(a.lv)) {
    a.xp -= attrXpToNext(a.lv);
    const before = attrRank(a.lv);
    a.lv++;
    const after = attrRank(a.lv);
    if (after !== before) events.push({ type: 'attr-rank', area, rank: after });
    else events.push({ type: 'toast', text: `${AREAS[area].icon} ${AREAS[area].attr} sube a nivel ${a.lv}` });
  }
}

function logDay(count, xp) {
  const t = today();
  const l = state.log[t] || (state.log[t] = { c: 0, xp: 0 });
  l.c = Math.max(0, l.c + count);
  l.xp = Math.max(0, l.xp + xp);
}

function ensureBoss() {
  const wk = weekKey(today());
  if (state.boss && state.boss.week === wk) return;
  const prev = state.boss;
  const tpl = BOSSES[state.bossIdx % BOSSES.length];
  state.bossIdx++;
  // Si el jefe aparece a mitad de semana (p. ej. el primer día de uso), su vida se ajusta a los días restantes.
  const daysLeft = 7 - ((dow(today()) + 6) % 7);
  const max = Math.max(80, Math.round((300 + (state.hero ? state.hero.lv : 1) * 40) * daysLeft / 7));
  state.boss = { week: wk, name: tpl.name, icon: tpl.icon, vice: tpl.vice, lore: tpl.lore, max, hp: max, defeated: false };
  if (prev && !prev.defeated && state.hero) events.push({ type: 'toast', text: `🌫️ ${prev.name} escapó… ¡Un nuevo enemigo acecha!` });
}

function hitBoss(n) {
  ensureBoss();
  const b = state.boss;
  if (b.defeated) return 0;
  const dmg = Math.min(n, b.hp);
  b.hp -= dmg;
  if (b.hp <= 0) {
    b.hp = 0;
    b.defeated = true;
    state.stats.bosses++;
    const xp = 100 + state.hero.lv * 10;
    const gold = 60 + state.hero.lv * 3;
    state.hero.gold += gold;
    state.stats.goldEarned += gold;
    events.push({ type: 'boss', boss: { ...b }, xp, gold });
    addHeroXp(xp);
  }
  return dmg;
}

function healBoss(n) {
  const b = state.boss;
  if (b && !b.defeated) b.hp = Math.min(b.max, b.hp + n);
}

function grantAward(h) {
  const d = DIFF[h.diff];
  let mult = 1 + classBonus(h.area);
  if (h.type === 'daily') mult += Math.min(h.streak, 25) * 0.02;
  let buff = false;
  if (state.buffs.xp > 0) { mult *= 2; state.buffs.xp--; buff = true; }
  const xp = Math.round(d.xp * mult);
  const crit = Math.random() < 0.12;
  const gold = Math.round(d.gold * (crit ? 2 : 1));
  state.hero.gold += gold;
  state.stats.goldEarned += gold;
  addHeroXp(xp);
  addAttrXp(h.area, xp);
  const boss = hitBoss(xp);
  logDay(1, xp);
  state.stats.completed++;
  return { xp, gold, area: h.area, boss, crit, buff };
}

function reverseAward(a) {
  const H = state.hero;
  H.xp = Math.max(0, H.xp - a.xp);
  const at = state.attrs[a.area];
  at.xp = Math.max(0, at.xp - a.xp);
  H.gold = Math.max(0, H.gold - a.gold);
  state.stats.goldEarned = Math.max(0, state.stats.goldEarned - a.gold);
  if (a.boss) healBoss(a.boss);
  logDay(-1, -a.xp);
  state.stats.completed = Math.max(0, state.stats.completed - 1);
}

function takeDamage(n) {
  const H = state.hero;
  H.hp -= n;
  if (H.hp <= 0) {
    const lost = Math.floor(H.gold * 0.25);
    H.gold -= lost;
    H.xp = 0;
    H.hp = maxHp();
    state.stats.deaths++;
    events.push({ type: 'faint', gold: lost });
  }
}

// Procesa los días transcurridos: diarias no cumplidas restan vida y rompen rachas.
function rollover() {
  const t = today();
  if (!state.lastDate) { state.lastDate = t; return; }
  if (state.lastDate >= t) return;
  let days = [];
  for (let d = state.lastDate; d < t; d = addDays(d, 1)) days.push(d);
  days = days.slice(-7);
  const report = { missed: [], dmg: 0, shielded: 0, perfect: 0 };
  for (const day of days) {
    const due = state.habits.filter((h) => h.type === 'daily' && h.days.includes(dow(day)) && h.created <= day);
    const missed = due.filter((h) => !h.done[day]);
    if (due.length && !missed.length) { state.stats.perfect++; report.perfect++; }
    if (!missed.length) continue;
    if (state.inv.shield > 0) { state.inv.shield--; report.shielded++; continue; }
    for (const h of missed) {
      const dmg = DIFF[h.diff].dmg;
      report.dmg += dmg;
      report.missed.push(h.title);
      h.streak = 0;
      takeDamage(dmg);
    }
  }
  // Limpia historial antiguo para no crecer sin límite
  const cutoff = addDays(t, -60);
  for (const h of state.habits) {
    for (const k of Object.keys(h.done || {})) if (k < cutoff) delete h.done[k];
    for (const k of Object.keys(h.hist || {})) if (k < cutoff) delete h.hist[k];
  }
  state.lastDate = t;
  ensureBoss();
  if (report.missed.length || report.shielded || report.perfect) events.unshift({ type: 'dawn', report });
}

function checkAchievements() {
  if (!state.hero) return;
  state.bestEver = bestStreak(state);
  for (const a of ACHIEVEMENTS) {
    if (!state.ach[a.id] && a.test(state)) {
      state.ach[a.id] = today();
      state.hero.gold += 15;
      events.push({ type: 'toast', text: `🏆 Logro: ${a.icon} ${a.name} (+15 🪙)` });
    }
  }
}

/* ---------- Acciones sobre tareas ---------- */
const byId = (id) => state.habits.find((h) => h.id === id);

function makeHabit(o) {
  return {
    id: uid(),
    title: o.t,
    notes: o.notes || '',
    icon: o.icon || '',
    area: o.area,
    type: o.type,
    diff: o.diff ?? 1,
    days: o.days ? [...o.days] : [0, 1, 2, 3, 4, 5, 6],
    pos: o.pos ?? !o.neg,
    neg: o.neg ?? false,
    due: o.due || '',
    streak: 0, best: 0,
    done: {}, hist: {},
    created: today(),
  };
}

function vibrate(ms) { if (state.settings.vibrate && navigator.vibrate) navigator.vibrate(ms); }

function feedback(e, a) {
  floatText(e, `+${a.xp} XP`, a.buff ? 'crit' : 'xp', 0);
  floatText(e, `+${a.gold} 🪙${a.crit ? ' ¡Crítico!' : ''}`, a.crit ? 'crit' : 'gold', 1);
  vibrate(a.crit ? [20, 40, 20] : 25);
}

function toggleDaily(id, e) {
  const h = byId(id); if (!h) return;
  const t = today();
  if (h.done[t]) {
    reverseAward(h.done[t]);
    delete h.done[t];
    h.streak = Math.max(0, h.streak - 1);
    toast('↩️ Tarea desmarcada');
  } else {
    const a = grantAward(h);
    h.done[t] = a;
    h.streak++;
    h.best = Math.max(h.best, h.streak);
    feedback(e, a);
    const due = state.habits.filter((x) => x.type === 'daily' && x.days.includes(dow(t)));
    if (due.length > 1 && due.every((x) => x.done[t])) events.push({ type: 'toast', text: '🌟 ¡Todas las diarias de hoy completadas!' });
  }
  afterAction();
}

function habitPlus(id, e) {
  const h = byId(id); if (!h) return;
  const t = today();
  const a = grantAward(h);
  const r = h.hist[t] || (h.hist[t] = { p: 0, n: 0 });
  r.p++;
  feedback(e, a);
  afterAction();
}

function habitMinus(id, e) {
  const h = byId(id); if (!h) return;
  const t = today();
  const dmg = DIFF[h.diff].dmg;
  const r = h.hist[t] || (h.hist[t] = { p: 0, n: 0 });
  r.n++;
  state.stats.bad++;
  takeDamage(dmg);
  healBoss(10);
  floatText(e, `−${dmg} PV`, 'dmg', 0);
  vibrate([60, 30, 60]);
  afterAction();
}

function questDone(id, e) {
  const h = byId(id); if (!h) return;
  const a = grantAward(h);
  state.stats.quests++;
  state.habits = state.habits.filter((x) => x.id !== id);
  state.archive.unshift({ title: h.title, area: h.area, date: today(), xp: a.xp });
  state.archive = state.archive.slice(0, 40);
  feedback(e, a);
  events.push({ type: 'toast', text: `📯 Misión cumplida: ${h.title}` });
  afterAction();
}

function afterAction() {
  checkAchievements();
  save();
  render();
  flushEvents();
}

/* ---------- Tienda ---------- */
function buyItem(id) {
  const it = SHOP_ITEMS.find((x) => x.id === id);
  const H = state.hero;
  if (H.gold < it.cost) return toast('🪙 No tienes suficiente oro');
  if ((id === 'potion' || id === 'bread') && H.hp >= maxHp()) return toast('❤️ Ya tienes la vida completa');
  H.gold -= it.cost;
  if (id === 'bread') { H.hp = Math.min(maxHp(), H.hp + 10); toast('🍞 Recuperaste 10 PV'); }
  if (id === 'potion') { H.hp = Math.min(maxHp(), H.hp + 25); toast('🧪 Recuperaste 25 PV'); }
  if (id === 'shield') { state.inv.shield++; toast('📜 Pergamino guardado en tu inventario'); }
  if (id === 'elixir') { state.buffs.xp += 5; toast('✨ ¡Doble XP en tus próximas 5 tareas!'); }
  vibrate(30);
  afterAction();
}

const wardrobeItem = (kind, id) => (kind === 'outfit' ? OUTFITS : ACCESSORIES)[id];
const owns = (id) => !!state.hero?.owned.includes(id);

function buyWear(kind, id) {
  const it = wardrobeItem(kind, id);
  if (!it || owns(id)) return false;
  if (state.hero.gold < it.cost) { toast(`🪙 Necesitas ${it.cost} de oro para ${it.name}`); return false; }
  state.hero.gold -= it.cost;
  state.hero.owned.push(id);
  toast(`${it.icon} ${it.name} ya es tuyo. Póntelo en tu apariencia.`);
  vibrate(30);
  checkAchievements();
  save();
  return true;
}

function buyReward(id) {
  const r = state.rewards.find((x) => x.id === id);
  if (!r) return;
  if (state.hero.gold < r.cost) return toast('🪙 Te falta oro para esta recompensa');
  state.hero.gold -= r.cost;
  state.stats.rewards++;
  events.push({ type: 'reward', reward: r });
  afterAction();
}

/* ---------- Render principal ---------- */
function applyTheme() {
  document.documentElement.dataset.theme = state.settings.theme;
  const bg = THEMES[state.settings.theme]?.sw[0] || '#121a2b';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg);
}

function render() {
  applyTheme();
  const app = $('#app');
  let fab = $('#fab');
  if (!state.hero) {
    app.classList.add('onboarding');
    fab?.remove();
    renderOnboarding();
    return;
  }
  app.classList.remove('onboarding');
  renderHud();
  document.querySelectorAll('#nav button').forEach((b) => b.classList.toggle('active', b.dataset.tab === ui.tab));
  const showFab = ui.tab === 'misiones';
  if (showFab && !fab) {
    fab = document.createElement('button');
    fab.id = 'fab'; fab.className = 'fab'; fab.dataset.action = 'add'; fab.setAttribute('aria-label', 'Nueva tarea');
    fab.textContent = '+';
    app.appendChild(fab);
  } else if (!showFab && fab) fab.remove();
  $('#view').innerHTML = VIEWS[ui.tab]();
}

function bar(kind, v, max, label, big) {
  const p = clamp((v / max) * 100, 0, 100);
  return `<div class="bar bar-${kind}${big ? ' big' : ''}"><span class="bar-fill" style="width:${p}%"></span><span class="bar-label">${label}</span></div>`;
}

function renderHud() {
  const h = state.hero;
  const c = CLASSES[h.cls];
  $('#hud').innerHTML = `
    <div class="hud-avatar" data-action="tab" data-tab="heroe"><div class="av-clip">${avatarSvg(h.avatar)}</div><span class="hud-lv">${h.lv}</span></div>
    <div class="hud-main">
      <div class="hud-name">${esc(h.name)}<span class="hud-rank">· ${c.icon} ${heroRank(h.lv)}</span></div>
      ${bar('hp', h.hp, maxHp(), `❤ ${Math.max(0, h.hp)} / ${maxHp()} PV`)}
      ${bar('xp', h.xp, xpToNext(h.lv), `✦ ${h.xp} / ${xpToNext(h.lv)} XP`)}
    </div>
    <div class="hud-gold">🪙<b>${h.gold}</b></div>`;
}

/* ---------- Vista: Misiones ---------- */
function taskCard(h) {
  const t = today();
  const A = AREAS[h.area];
  const title = `<div class="task-title"><span class="task-ic">${h.icon || A.icon}</span>${esc(h.title)}</div>`;
  const meta = `<span>${A.name}</span><span class="gems" title="${DIFF[h.diff].name}">${gems(h.diff)}</span>`;
  if (h.type === 'daily') {
    const done = !!h.done[t];
    const rest = !h.days.includes(dow(t));
    return `<div class="card task ${done ? 'done' : ''} ${rest && !done ? 'rest' : ''}">
      <button class="check" data-action="toggle-daily" data-id="${h.id}" aria-label="Completar">✓</button>
      <div class="task-body" data-action="edit" data-id="${h.id}">
        ${title}
        <div class="task-meta">${meta}${h.streak ? `<span class="streak">🔥 ${h.streak}</span>` : ''}${rest ? '<span>💤 Descanso hoy</span>' : ''}</div>
      </div></div>`;
  }
  if (h.type === 'habit') {
    const r = h.hist[t] || { p: 0, n: 0 };
    const counts = [h.pos ? `+${r.p}` : '', h.neg ? `−${r.n}` : ''].filter(Boolean).join(' / ');
    return `<div class="card task">
      <button class="habit-btn plus ${h.pos ? '' : 'off'}" data-action="habit-plus" data-id="${h.id}" aria-label="Hábito positivo">+</button>
      <div class="task-body" data-action="edit" data-id="${h.id}">
        ${title}
        <div class="task-meta">${meta}<span>Hoy: ${counts}</span></div>
      </div>
      <button class="habit-btn minus ${h.neg ? '' : 'off'}" data-action="habit-minus" data-id="${h.id}" aria-label="Hábito negativo">−</button>
    </div>`;
  }
  const overdue = h.due && h.due < t;
  return `<div class="card task">
    <button class="check" data-action="quest-done" data-id="${h.id}" aria-label="Completar misión">✓</button>
    <div class="task-body" data-action="edit" data-id="${h.id}">
      ${title}
      <div class="task-meta">${meta}${h.due ? `<span class="${overdue ? 'overdue' : ''}">📅 ${overdue ? 'Vencida · ' : ''}${prettyDate(h.due)}</span>` : ''}</div>
    </div></div>`;
}

function viewMisiones() {
  const t = today();
  const w = dow(t);
  const dueAll = state.habits.filter((h) => h.type === 'daily' && h.days.includes(w));
  const doneAll = dueAll.filter((h) => h.done[t]).length;
  const count = (type) => state.habits.filter((h) => h.type === type).length;

  let html = `
    <div class="card ornate day-summary">
      <div class="big-num">${doneAll}/${dueAll.length}</div>
      <div class="grow" style="flex:1">
        <div class="title-font small">Diarias de hoy · ${prettyDate(t)}</div>
        ${bar('day', doneAll, Math.max(1, dueAll.length), dueAll.length && doneAll === dueAll.length ? '¡Día perfecto!' : `${Math.round((doneAll / Math.max(1, dueAll.length)) * 100)}%`)}
      </div>
    </div>
    <div class="seg">
      <button class="${ui.filter === 'daily' ? 'on' : ''}" data-action="filter" data-v="daily">Diarias<small>${count('daily')}</small></button>
      <button class="${ui.filter === 'habit' ? 'on' : ''}" data-action="filter" data-v="habit">Hábitos<small>${count('habit')}</small></button>
      <button class="${ui.filter === 'quest' ? 'on' : ''}" data-action="filter" data-v="quest">Misiones<small>${count('quest')}</small></button>
    </div>
    <div class="chips">
      <button class="chip ${ui.area === 'all' ? 'on' : ''}" data-action="area" data-v="all">Todas</button>
      ${AREA_KEYS.map((k) => `<button class="chip ${ui.area === k ? 'on' : ''}" data-action="area" data-v="${k}">${AREAS[k].icon} ${AREAS[k].name}</button>`).join('')}
    </div>`;

  let list = state.habits.filter((h) => h.type === ui.filter && (ui.area === 'all' || h.area === ui.area));
  if (ui.filter === 'daily') {
    const rank = (h) => (h.days.includes(w) ? (h.done[t] ? 1 : 0) : 2);
    list.sort((a, b) => rank(a) - rank(b));
  } else if (ui.filter === 'quest') {
    list.sort((a, b) => (a.due || '9999') .localeCompare(b.due || '9999'));
  }

  if (!list.length) {
    const msg = {
      daily: ['🌄', 'Sin tareas diarias aquí', 'Las diarias se repiten ciertos días y construyen rachas.'],
      habit: ['⚖️', 'Sin hábitos aquí', 'Pulsa + cuando hagas algo bueno y − cuando caigas en un mal hábito.'],
      quest: ['📯', 'Sin misiones pendientes', 'Las misiones únicas son metas que se cumplen una sola vez.'],
    }[ui.filter];
    html += `<div class="empty"><div class="big">${msg[0]}</div><b>${msg[1]}</b><p class="small">${msg[2]}</p>
      <button class="btn" data-action="add">+ Añadir</button></div>`;
  } else {
    html += list.map(taskCard).join('');
  }
  if (ui.filter === 'quest' && state.archive.length) {
    html += `<div class="section-title">Misiones cumplidas</div><div class="card">${state.archive.slice(0, 8).map((q) =>
      `<div class="list-row small"><span>${AREAS[q.area]?.icon || ''} ${esc(q.title)}</span><span class="muted">${prettyDate(q.date)}</span></div>`).join('')}</div>`;
  }
  return html;
}

/* ---------- Vista: Héroe ---------- */
function radarSvg() {
  const size = 280, c = size / 2, R = 92;
  const lvs = AREA_KEYS.map((k) => state.attrs[k].lv);
  const scale = Math.max(5, ...lvs);
  const pt = (i, r) => {
    const ang = (-90 + i * (360 / AREA_KEYS.length)) * Math.PI / 180;
    return [c + Math.cos(ang) * r, c + Math.sin(ang) * r];
  };
  const poly = (r) => AREA_KEYS.map((_, i) => pt(i, r).map((v) => v.toFixed(1)).join(',')).join(' ');
  const grid = [0.25, 0.5, 0.75, 1].map((f) => `<polygon points="${poly(R * f)}" fill="none" stroke="var(--line)" stroke-width="1"/>`).join('');
  const axes = AREA_KEYS.map((_, i) => { const [x, y] = pt(i, R); return `<line x1="${c}" y1="${c}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="var(--line)" stroke-width="1"/>`; }).join('');
  const vals = AREA_KEYS.map((k, i) => pt(i, R * (lvs[i] / scale)).map((v) => v.toFixed(1)).join(',')).join(' ');
  const labels = AREA_KEYS.map((k, i) => {
    const [x, y] = pt(i, R + 26);
    return `<text x="${x.toFixed(1)}" y="${(y - 4).toFixed(1)}" text-anchor="middle" style="font-size:15px">${AREAS[k].icon}</text>
            <text x="${x.toFixed(1)}" y="${(y + 10).toFixed(1)}" text-anchor="middle">${AREAS[k].abbr} ${lvs[i]}</text>`;
  }).join('');
  return `<svg class="radar" viewBox="0 0 ${size} ${size}" role="img" aria-label="Atributos">
    ${grid}${axes}
    <polygon points="${vals}" fill="color-mix(in srgb, var(--accent) 35%, transparent)" stroke="var(--accent)" stroke-width="2"/>
    ${labels}</svg>`;
}

function viewHeroe() {
  const h = state.hero;
  const c = CLASSES[h.cls];
  const totalDone = state.stats.completed;
  return `
    <div class="card ornate hero-card">
      <div class="hero-portrait" data-action="avatar-edit"><div class="av-clip">${avatarSvg(h.avatar)}</div></div>
      <button class="btn ghost sm" data-action="avatar-edit" style="margin-bottom:10px">✏️ Cambiar apariencia</button>
      <div class="hero-name">${esc(h.name)}</div>
      <div class="hero-title">${className(h.cls, h.avatar)}${h.avatar.mode === 'emblem' ? '' : ` · ${RACES[normalizeAvatar(h.avatar).race].name}`}<br>Rango ${heroRank(h.lv)} · Nivel ${h.lv}</div>
      ${bar('hp', h.hp, maxHp(), `❤ Vida ${Math.max(0, h.hp)} / ${maxHp()}`, true)}
      ${bar('xp', h.xp, xpToNext(h.lv), `✦ Experiencia ${h.xp} / ${xpToNext(h.lv)}`, true)}
      <div class="stat-grid">
        <div class="stat"><b>${h.gold}</b><span>Oro</span></div>
        <div class="stat"><b>${totalDone}</b><span>Tareas</span></div>
        <div class="stat"><b>${bestStreak(state)}</b><span>Mejor racha</span></div>
      </div>
      <p class="small muted" style="margin:10px 0 0">Bono de clase: ${c.desc}</p>
    </div>

    <div class="section-title">Inventario</div>
    <div class="card">
      <div class="inv-row"><span class="shop-icon">📜</span><div class="grow"><b>Pergaminos protectores × ${state.inv.shield}</b>
        <div class="small muted">${SHOP_ITEMS.find((i) => i.id === 'shield').desc}</div></div></div>
      <div class="inv-row"><span class="shop-icon">✨</span><div class="grow"><b>Elixir activo: ${state.buffs.xp} tareas con doble XP</b>
        <div class="small muted">Cada tarea completada consume una carga.</div></div></div>
      ${h.owned.length ? `<div class="inv-row"><span class="shop-icon">🧵</span><div class="grow"><b>Guardarropa</b>
        <div class="small muted">${h.owned.map((id) => { const it = OUTFITS[id] || ACCESSORIES[id]; return it ? `${it.icon} ${it.name}` : ''; }).join(' · ')}</div></div></div>` : ''}
    </div>

    <div class="section-title">Atributos</div>
    <div class="card">${radarSvg()}</div>
    <div class="card">
      ${AREA_KEYS.map((k) => {
        const a = state.attrs[k];
        return `<div class="attr">
          <div class="attr-icon">${AREAS[k].icon}</div>
          <div class="attr-head"><b>${AREAS[k].attr} · Nv ${a.lv}</b><span class="attr-rank">${attrRank(a.lv)}</span></div>
          <div>${bar('attr', a.xp, attrXpToNext(a.lv), `${AREAS[k].name} · ${a.xp}/${attrXpToNext(a.lv)}`)}</div>
        </div>`;
      }).join('')}
    </div>

    <div class="section-title">Rangos del héroe</div>
    <div class="card small">
      ${RANKS.map((r, i) => `<div class="list-row"><span>${h.lv >= HERO_RANK_LV[i] ? '◆' : '◇'} ${r}</span><span class="muted">Nivel ${HERO_RANK_LV[i]}+</span></div>`).join('')}
    </div>`;
}

/* ---------- Vista: Jefe ---------- */
function viewJefe() {
  ensureBoss();
  const b = state.boss;
  const daysLeft = 7 - ((dow(today()) + 6) % 7);
  return `
    <div class="card ornate boss-card ${b.defeated ? 'defeated' : ''}">
      <div class="small muted title-font">Jefe de la semana</div>
      <div class="boss-sprite" id="boss-sprite">${b.icon}</div>
      <div class="boss-name">${esc(b.name)}</div>
      <div class="boss-vice">Encarnación de: ${esc(b.vice)}</div>
      <p class="boss-lore">“${esc(b.lore)}”</p>
      ${bar('boss', b.hp, b.max, `☠ ${b.hp} / ${b.max} PV`, true)}
      ${b.defeated
        ? '<div class="banner">DERROTADO</div><p class="small muted">Un nuevo enemigo aparecerá el lunes.</p>'
        : `<p class="small muted">⏳ Quedan ${daysLeft} ${daysLeft === 1 ? 'día' : 'días'} antes de que escape.</p>`}
    </div>
    <div class="section-title">Cómo combatir</div>
    <div class="card small stack">
      <div>⚔️ Cada tarea o hábito positivo inflige daño igual a la XP que ganas.</div>
      <div>🩸 Cada mal hábito lo cura 10 PV.</div>
      <div>🏆 Derrótalo antes del domingo para ganar <b>${100 + state.hero.lv * 10} XP</b> y <b>${60 + state.hero.lv * 3} 🪙</b>.</div>
      <div>📈 Los jefes se vuelven más fuertes según tu nivel.</div>
    </div>
    <div class="card"><div class="list-row"><span>🐲 Jefes derrotados</span><b>${state.stats.bosses}</b></div></div>`;
}

/* ---------- Vista: Tienda ---------- */
function viewTienda() {
  const g = state.hero.gold;
  return `
    <div class="card ornate center"><div class="title-font small muted">Tu bolsa</div><div style="font:900 2rem Cinzel,serif;color:var(--gold)">🪙 ${g}</div></div>
    <div class="section-title">Boticario del gremio</div>
    ${SHOP_ITEMS.map((it) => `<div class="card shop-item">
      <div class="shop-icon" data-action="item-info" data-kind="shop" data-id="${it.id}">${it.icon}</div>
      <div class="grow" style="flex:1" data-action="item-info" data-kind="shop" data-id="${it.id}"><b>${it.name}</b>
        <div class="small">${it.desc}</div><div class="lore">${it.lore}</div></div>
      <button class="btn sm" data-action="buy-item" data-id="${it.id}" ${g < it.cost ? 'disabled' : ''}><span class="price">${it.cost} 🪙</span></button>
    </div>`).join('')}

    <div class="section-title">Sastrería</div>
    <p class="small muted" style="margin-top:-4px">Prendas y accesorios para tu retrato. Una vez comprados, son tuyos para siempre.</p>
    ${[...Object.entries(OUTFITS).map(([id, it]) => ['outfit', id, it]), ...Object.entries(ACCESSORIES).map(([id, it]) => ['acc', id, it])]
      .filter(([, , it]) => it.cost > 0).map(([kind, id, it]) => `<div class="card shop-item">
      <div class="shop-icon" data-action="item-info" data-kind="${kind}" data-id="${id}">${it.icon}</div>
      <div class="grow" style="flex:1" data-action="item-info" data-kind="${kind}" data-id="${id}"><b>${it.name}</b><div class="lore">${it.desc}</div></div>
      ${owns(id) ? '<span class="owned-tag">✔ Tuyo</span>'
        : `<button class="btn sm" data-action="buy-wear" data-kind="${kind}" data-id="${id}" ${g < it.cost ? 'disabled' : ''}><span class="price">${it.cost} 🪙</span></button>`}
    </div>`).join('')}

    <div class="section-title">Mis recompensas</div>
    <p class="small muted" style="margin-top:-4px">Date un gusto real cuando lo hayas ganado. Tú decides el precio.</p>
    ${state.rewards.map((r) => `<div class="card shop-item">
      <div class="shop-icon">${r.icon}</div>
      <div class="grow" style="flex:1"><b>${esc(r.title)}</b>${r.desc ? `<div class="lore">${esc(r.desc)}</div>` : ''}
        <div><span class="edit-link" data-action="edit-reward" data-id="${r.id}">Editar</span></div></div>
      <button class="btn sm" data-action="buy-reward" data-id="${r.id}" ${g < r.cost ? 'disabled' : ''}><span class="price">${r.cost} 🪙</span></button>
    </div>`).join('')}
    <button class="btn ghost block" data-action="edit-reward">+ Nueva recompensa</button>`;
}

/* ---------- Vista: Gremio (logros, crónica, ajustes) ---------- */
function viewGremio() {
  const tabs = [['logros', 'Logros'], ['cronica', 'Crónica'], ['ajustes', 'Ajustes']];
  const head = `<div class="seg">${tabs.map(([k, n]) => `<button class="${ui.guild === k ? 'on' : ''}" data-action="guild" data-v="${k}">${n}</button>`).join('')}</div>`;
  return head + ({ logros: guildLogros, cronica: guildCronica, ajustes: guildAjustes }[ui.guild])();
}

function guildLogros() {
  const got = ACHIEVEMENTS.filter((a) => state.ach[a.id]).length;
  return `<p class="center muted small">${got} de ${ACHIEVEMENTS.length} logros desbloqueados</p>
    <div class="ach-grid">${ACHIEVEMENTS.map((a) => `<div class="ach ${state.ach[a.id] ? 'got' : 'locked'}">
      <div class="ic">${a.icon}</div><div class="nm">${a.name}</div><div class="ds">${a.desc}</div></div>`).join('')}</div>`;
}

function guildCronica() {
  const t = today();
  const start = addDays(weekKey(t), -77);
  let cells = '';
  for (let row = 0; row < 7; row++) {
    cells += `<div>${DAY_NAMES[DAY_ORDER[row]]}</div>`;
    for (let col = 0; col < 12; col++) {
      const d = addDays(start, col * 7 + row);
      if (d > t) { cells += '<div class="c future"></div>'; continue; }
      const n = state.log[d]?.c || 0;
      const lvl = n === 0 ? '' : n <= 2 ? 'l1' : n <= 4 ? 'l2' : n <= 7 ? 'l3' : 'l4';
      cells += `<div class="c ${lvl} ${d === t ? 'today' : ''}" title="${d}: ${n}"></div>`;
    }
  }
  const s = state.stats;
  const last7 = Array.from({ length: 7 }, (_, i) => state.log[addDays(t, -i)]?.c || 0).reduce((a, b) => a + b, 0);
  const top = [...state.habits].filter((h) => h.best > 0).sort((a, b) => b.best - a.best).slice(0, 5);
  return `
    <div class="card"><h3 class="title-font">Últimas 12 semanas</h3><div class="heat">${cells}</div></div>
    <div class="stat-grid">
      <div class="stat"><b>${s.completed}</b><span>Tareas</span></div>
      <div class="stat"><b>${last7}</b><span>Últimos 7 días</span></div>
      <div class="stat"><b>${s.perfect}</b><span>Días perfectos</span></div>
      <div class="stat"><b>${s.quests}</b><span>Misiones</span></div>
      <div class="stat"><b>${s.bosses}</b><span>Jefes</span></div>
      <div class="stat"><b>${s.goldEarned}</b><span>Oro ganado</span></div>
      <div class="stat"><b>${s.rewards}</b><span>Recompensas</span></div>
      <div class="stat"><b>${s.bad}</b><span>Tropiezos</span></div>
      <div class="stat"><b>${s.deaths}</b><span>Caídas</span></div>
    </div>
    <div class="section-title">Rachas legendarias</div>
    <div class="card">${top.length ? top.map((h) => `<div class="list-row"><span>${AREAS[h.area].icon} ${esc(h.title)}</span><span class="streak">🔥 ${h.streak} <span class="muted small">(máx ${h.best})</span></span></div>`).join('') : '<p class="muted small center">Aún no hay rachas. ¡Empieza hoy!</p>'}</div>`;
}

function guildAjustes() {
  const h = state.hero;
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  return `
    <div class="section-title">Tema de color</div>
    <div class="theme-grid">${themeOptions()}</div>

    <div class="section-title">Héroe</div>
    <div class="card">
      <label class="field"><span>Nombre</span>
        <div class="row"><input class="input grow" id="set-name" maxlength="24" value="${esc(h.name)}"><button class="btn sm" data-action="save-name">Guardar</button></div>
      </label>
      <div class="field-label">Clase</div>
      <div class="class-grid">${classOptions(h.cls, 'set-class')}</div>
    </div>

    <div class="section-title">Preferencias</div>
    <div class="card">
      <div class="toggle-row"><span>📳 Vibración al completar</span><button class="switch ${state.settings.vibrate ? 'on' : ''}" data-action="toggle-vibrate" aria-label="Vibración"></button></div>
    </div>

    ${standalone ? '' : `<div class="section-title">Instalar en el celular</div>
    <div class="card small stack">
      ${installPrompt ? '<button class="btn block" data-action="install">📲 Instalar app</button>' : ''}
      ${isIos
        ? '<div>En iPhone: abre esta página en <b>Safari</b>, toca <b>Compartir</b> ⬆️ y luego <b>“Agregar a inicio”</b>.</div>'
        : '<div>En Android: abre el menú ⋮ de Chrome y elige <b>“Instalar app”</b> o <b>“Agregar a pantalla principal”</b>.</div>'}
    </div>`}

    <div class="section-title">Respaldo</div>
    <div class="card stack">
      <p class="small muted" style="margin:0">Tu progreso vive solo en este dispositivo. Exporta un respaldo de vez en cuando.</p>
      <div class="row"><button class="btn ghost grow" data-action="export">⬇️ Exportar</button><button class="btn ghost grow" data-action="import">⬆️ Importar</button></div>
      <button class="btn danger block" data-action="reset">Borrar todo y empezar de nuevo</button>
    </div>
    <p class="center small muted">Crónicas del Aventurero · v1.0</p>`;
}

function themeOptions(selected = state.settings.theme, action = 'set-theme') {
  return Object.entries(THEMES).map(([k, t]) => `<button class="theme-opt ${selected === k ? 'on' : ''}" data-action="${action}" data-v="${k}">
    <div class="sw">${t.sw.map((c) => `<i style="background:${c}"></i>`).join('')}</div><b>${t.name}</b><span>${t.desc}</span></button>`).join('');
}

// Nombre de la clase en femenino o masculino según el retrato
const className = (cls, av) => (av?.sex === 'f' ? CLASSES[cls].fem : CLASSES[cls].name);
const heroAv = () => (state.hero ? state.hero.avatar : onboard?.avatar);

function classOptions(selected, action) {
  return Object.entries(CLASSES).map(([k, c]) => `<button class="class-opt ${selected === k ? 'on' : ''}" data-action="${action}" data-v="${k}">
    <div class="ic">${c.icon}</div><b>${className(k, heroAv())}</b><span>${c.desc}</span></button>`).join('');
}

const VIEWS = { misiones: viewMisiones, heroe: viewHeroe, jefe: viewJefe, tienda: viewTienda, gremio: viewGremio };

/* ---------- Bienvenida / creación de personaje ---------- */
function renderOnboarding() {
  if (!onboard) onboard = { name: '', cls: 'aventurero', picks: new Set(ONBOARD_DEFAULT_PICKS), avatar: { ...DEFAULT_AVATAR } };
  $('#hud').innerHTML = '';
  $('#view').innerHTML = `
    <div class="logo"><div class="crest">🏰</div><h1>Crónicas del Aventurero</h1><p>Tu vida es la aventura. Cada hábito, una hazaña.</p></div>
    <div class="card ornate">
      <h2>I · ¿Cómo te llamas, viajero?</h2>
      <input class="input" id="ob-name" maxlength="24" placeholder="Nombre de tu héroe" value="${esc(onboard.name)}">
    </div>
    <div class="card ornate center">
      <h2>II · Tu apariencia</h2>
      <div class="hero-portrait" data-action="avatar-edit"><div class="av-clip">${avatarSvg(onboard.avatar)}</div></div>
      <div class="row" style="justify-content:center">
        <button class="btn sm" data-action="avatar-edit" data-tab="personajes">🧙 Elegir personaje</button>
        <button class="btn ghost sm" data-action="avatar-edit" data-tab="retrato">✏️ Personalizar</button>
      </div>
    </div>
    <div class="card ornate">
      <h2>III · Elige tu clase</h2>
      <div class="class-grid">${classOptions(onboard.cls, 'ob-class')}</div>
    </div>
    <div class="card ornate">
      <h2>IV · Elige tu estandarte</h2>
      <div class="theme-grid">${themeOptions(state.settings.theme, 'ob-theme')}</div>
    </div>
    <div class="card ornate">
      <h2>V · Tus primeras misiones</h2>
      <p class="small muted" style="margin-top:0">Marca las que quieras. Podrás añadir, editar o borrar después.</p>
      ${AREA_KEYS.map((k) => `<div class="section-title" style="margin:12px 0 4px">${AREAS[k].icon} ${AREAS[k].name}</div>
        <div class="pick-list">${TEMPLATES[k].map((tp, i) => {
          const key = `${k}:${i}`;
          const type = { daily: 'Diaria', habit: tp.neg ? 'Mal hábito' : 'Hábito', quest: 'Misión' }[tp.type];
          return `<label><input type="checkbox" data-pick="${key}" ${onboard.picks.has(key) ? 'checked' : ''}><span class="grow" style="flex:1">${esc(tp.t)}</span><span class="small muted">${type}</span></label>`;
        }).join('')}</div>`).join('')}
    </div>
    <button class="btn block" data-action="ob-start" style="padding:16px;font-size:1rem">⚔️ Comenzar la aventura</button>`;
  $('#ob-name').addEventListener('input', (e) => { onboard.name = e.target.value; });
  document.querySelectorAll('[data-pick]').forEach((cb) => cb.addEventListener('change', () => {
    cb.checked ? onboard.picks.add(cb.dataset.pick) : onboard.picks.delete(cb.dataset.pick);
  }));
}

function startAdventure() {
  const name = onboard.name.trim();
  if (!name) { toast('✍️ Escribe el nombre de tu héroe'); $('#ob-name')?.focus(); return; }
  state.hero = { name, cls: onboard.cls, lv: 1, xp: 0, hp: 50, gold: 20, avatar: { ...onboard.avatar }, owned: [] };
  for (const key of onboard.picks) {
    const [area, i] = key.split(':');
    state.habits.push(makeHabit({ ...TEMPLATES[area][+i], area }));
  }
  state.lastDate = today();
  ensureBoss();
  onboard = null;
  ui.tab = 'misiones';
  events.push({ type: 'welcome' });
  afterAction();
  window.scrollTo(0, 0);
}

/* ---------- Editor de tareas ---------- */
function openHabitEditor(id) {
  const h = id ? byId(id) : null;
  editor = h
    ? { id: h.id, title: h.title, notes: h.notes, icon: h.icon || '', area: h.area, type: h.type, diff: h.diff, days: [...h.days], pos: h.pos, neg: h.neg, due: h.due }
    : { id: null, title: '', notes: '', icon: '', area: ui.area !== 'all' ? ui.area : 'salud', type: ui.filter, diff: 1, days: [0, 1, 2, 3, 4, 5, 6], pos: true, neg: false, due: '' };
  openModal('', { mount: renderEditor });
}

function renderEditor() {
  const e = editor;
  const sheet = $('#modal .sheet');
  const typeBtn = (v, n) => `<button class="${e.type === v ? 'on' : ''}" data-action="ed" data-k="type" data-v="${v}">${n}</button>`;
  const used = TEMPLATES[e.area].filter((tp) => tp.type === e.type);
  sheet.innerHTML = `
    <h2>${e.id ? 'Editar' : e.type === 'habit' ? 'Nuevo' : 'Nueva'} ${e.type === 'daily' ? 'tarea diaria' : e.type === 'habit' ? 'hábito' : 'misión'}</h2>
    <div class="seg">${typeBtn('daily', 'Diaria')}${typeBtn('habit', 'Hábito ±')}${typeBtn('quest', 'Misión única')}</div>
    <label class="field"><span>Nombre</span><input class="input" id="ed-title" maxlength="80" value="${esc(e.title)}" placeholder="Ej. Leer 20 páginas"></label>
    ${used.length ? `<details class="tpl"><summary>📜 Sugerencias de ${AREAS[e.area].name}</summary><div class="tpl-list">${used.map((tp) =>
      `<button data-action="ed-tpl" data-v="${TEMPLATES[e.area].indexOf(tp)}">${esc(tp.t)} <small>· ${DIFF[tp.diff].name}${tp.neg ? ' · malo' : ''}</small></button>`).join('')}</div></details>` : ''}
    <div class="field-label">Área de vida</div>
    <div class="opt-grid">${AREA_KEYS.map((k) => `<button class="opt ${e.area === k ? 'on' : ''}" data-action="ed" data-k="area" data-v="${k}"><span class="ic">${AREAS[k].icon}</span>${AREAS[k].short}</button>`).join('')}</div>
    <details class="tpl" ${e.icon ? 'open' : ''}><summary>🖼️ Ícono: ${e.icon || AREAS[e.area].icon + ' (el del área)'}</summary>
      <div class="icon-grid">
        <button class="${!e.icon ? 'on' : ''}" data-action="ed-icon" data-v="" title="Ícono del área">${AREAS[e.area].icon}</button>
        ${TASK_ICONS.map((ic) => `<button class="${e.icon === ic ? 'on' : ''}" data-action="ed-icon" data-v="${ic}">${ic}</button>`).join('')}
      </div></details>
    <div class="field-label">Dificultad</div>
    <div class="opt-grid">${DIFF.map((d, i) => `<button class="opt ${e.diff === i ? 'on' : ''}" data-action="ed" data-k="diff" data-v="${i}"><span class="ic" style="font-size:.8rem">${gems(i)}</span>${d.name}<br><small>${d.xp} XP</small></button>`).join('')}</div>
    ${e.type === 'daily' ? `<div class="field-label">Días</div><div class="days">${DAY_ORDER.map((d) => `<button class="${e.days.includes(d) ? 'on' : ''}" data-action="ed-day" data-v="${d}">${DAY_NAMES[d]}</button>`).join('')}</div>` : ''}
    ${e.type === 'habit' ? `<div class="field-label">Tipo de hábito</div>
      <div class="opt-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">
        <button class="opt ${e.pos ? 'on' : ''}" data-action="ed-flag" data-k="pos"><span class="ic">➕</span>Bueno (da XP)</button>
        <button class="opt ${e.neg ? 'on' : ''}" data-action="ed-flag" data-k="neg"><span class="ic">➖</span>Malo (quita PV)</button>
      </div>` : ''}
    ${e.type === 'quest' ? `<label class="field"><span>Fecha límite (opcional)</span><input class="input" type="date" id="ed-due" value="${esc(e.due)}"></label>` : ''}
    <label class="field"><span>Notas</span><textarea class="input" id="ed-notes" maxlength="300" placeholder="Opcional">${esc(e.notes)}</textarea></label>
    <div class="row"><button class="btn ghost grow" data-action="close-modal">Cancelar</button><button class="btn grow" data-action="ed-save">Guardar</button></div>
    ${e.id ? '<button class="btn danger block" style="margin-top:10px" data-action="ed-delete">Eliminar</button>' : ''}`;
  $('#ed-title').addEventListener('input', (ev) => { e.title = ev.target.value; });
  $('#ed-notes').addEventListener('input', (ev) => { e.notes = ev.target.value; });
  $('#ed-due')?.addEventListener('input', (ev) => { e.due = ev.target.value; });
}

function saveEditor() {
  const e = editor;
  e.title = e.title.trim();
  if (!e.title) return toast('✍️ Ponle un nombre');
  if (e.type === 'daily' && !e.days.length) return toast('📅 Elige al menos un día');
  if (e.type === 'habit' && !e.pos && !e.neg) return toast('Elige si el hábito es bueno, malo o ambos');
  const fields = { title: e.title, notes: e.notes, icon: e.icon, area: e.area, type: e.type, diff: e.diff, days: e.days, pos: e.pos, neg: e.neg, due: e.due };
  if (e.id) Object.assign(byId(e.id), fields);
  else state.habits.push({ ...makeHabit({ t: e.title, area: e.area, type: e.type }), ...fields });
  ui.filter = e.type;
  closeModal();
  toast(e.id ? '📝 Cambios guardados' : '📜 Nueva entrada en tu crónica');
  afterAction();
}

/* ---------- Editor de apariencia ---------- */
function openAvatarEditor(tab) {
  const target = state.hero ? 'hero' : 'onboard';
  const current = target === 'hero' ? state.hero.avatar : onboard.avatar;
  const draft = normalizeAvatar(current);
  avatarEdit = { target, draft, preset: -1, tab: tab || (draft.mode === 'emblem' ? 'emblema' : 'retrato') };
  openModal('', { mount: renderAvatarEditor });
}

const raceLabel = (k) => { const n = RACES[k].name.replace('Raza ', ''); return n[0].toUpperCase() + n.slice(1); };

function renderAvatarEditor() {
  const d = avatarEdit.draft;
  const tab = avatarEdit.tab;
  const opt = (k, v, label) => `<button class="opt ${d[k] === v ? 'on' : ''}" data-action="av" data-k="${k}" data-v="${v}">${label}</button>`;
  const swatch = (k, v, color, title) => `<button class="swatch ${d[k] === v ? 'on' : ''}" data-action="av" data-k="${k}" data-v="${v}" title="${title}" style="background:${color}"></button>`;
  const item = (k, id, it) => {
    const locked = it.cost > 0 && !owns(id);
    return `<button class="opt ${d[k] === id ? 'on' : ''} ${locked ? 'locked' : ''}" data-action="av-item" data-k="${k}" data-v="${id}">
      <span class="ic">${it.icon}</span>${it.short || it.name.split(' ')[0]}${locked ? `<br><small>🔒 ${it.cost} 🪙</small>` : ''}</button>`;
  };
  const chosen = PRESETS[avatarEdit.preset];
  const presets = `
    <p class="small muted center" style="margin-top:0">Elige un personaje y después ajústalo a tu gusto en “Retrato”.</p>
    ${chosen ? `<div class="item-desc"><b>${chosen.name} · ${RACES[chosen.av.race].name}</b><br>${chosen.desc}</div>` : ''}
    <div class="preset-grid">${PRESETS.map((p, i) => `<button class="preset ${avatarEdit.preset === i ? 'on' : ''}" data-action="av-preset" data-v="${i}">
      <div class="av-clip">${avatarSvg(p.av)}</div>
      <b>${p.name}</b><span>${p.role}</span><small>${RACES[p.av.race].icon} ${RACES[p.av.race].name} · ${p.av.sex === 'm' ? '♂' : '♀'}</small></button>`).join('')}</div>`;
  const race = RACES[d.race];
  const portrait = `
    <div class="field-label">Sexo</div>
    <div class="opt-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">${opt('sex', 'f', '♀ Femenino')}${opt('sex', 'm', '♂ Masculino')}</div>
    <div class="field-label">Raza</div>
    <div class="opt-grid">${Object.keys(RACES).map((k) => `<button class="opt ${d.race === k ? 'on' : ''}" data-action="av" data-k="race" data-v="${k}"><span class="ic">${RACES[k].icon}</span>${raceLabel(k)}</button>`).join('')}</div>
    <div class="item-desc"><b>${race.icon} ${race.name}</b><br>${race.desc}</div>
    ${d.race === 'bestia' ? `<div class="field-label">Linaje animal</div>
      <div class="opt-grid" style="grid-template-columns:repeat(3,minmax(0,1fr))">${Object.entries(BEASTS).map(([k, n]) => opt('beast', k, n)).join('')}</div>` : ''}
    <div class="field-label">Peinado</div>
    <div class="opt-grid" style="grid-template-columns:repeat(3,minmax(0,1fr))">${Object.entries(HAIR_STYLES).map(([k, n]) => opt('style', k, n)).join('')}</div>
    <div class="field-label">${d.race === 'bestia' ? 'Color de cabello y pelaje' : 'Color de cabello'}</div>
    <div class="swatches">${Object.entries(HAIR_COLORS).map(([k, c]) => swatch('hair', k, c.c, c.name)).join('')}</div>
    <div class="field-label">Ojos</div>
    <div class="swatches">${Object.entries(EYE_COLORS).map(([k, c]) => swatch('eyes', k, c.c, c.name)).join('')}</div>
    <div class="field-label">Piel</div>
    <div class="swatches">${SKINS.map((c, i) => swatch('skin', i, c, 'Tono ' + (i + 1))).join('')}</div>
    <div class="field-label">Expresión</div>
    <div class="opt-grid" style="grid-template-columns:repeat(5,minmax(0,1fr))">${Object.entries(EXPRESSIONS).map(([k, n]) => opt('expr', k, n)).join('')}</div>
    <div class="field-label">Rasgos</div>
    <div class="opt-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">
      <button class="opt ${d.ahoge ? 'on' : ''}" data-action="av-flag" data-k="ahoge"><span class="ic">〰️</span>Mechón rebelde</button>
      ${d.sex === 'm' ? `<button class="opt ${d.beard ? 'on' : ''}" data-action="av-flag" data-k="beard"><span class="ic">🧔</span>Barba</button>` : ''}
    </div>
    <div class="field-label">Atuendo</div>
    <div class="opt-grid">${Object.entries(OUTFITS).map(([id, it]) => item('outfit', id, it)).join('')}</div>
    <div class="item-desc"><b>${OUTFITS[d.outfit].icon} ${OUTFITS[d.outfit].name}</b><br>${OUTFITS[d.outfit].desc}</div>
    <div class="field-label">Color del atuendo</div>
    <div class="swatches">${OUTFIT_COLORS.map((c) => swatch('ocolor', c, c, c)).join('')}</div>
    <div class="field-label">Accesorio</div>
    <div class="opt-grid">${Object.entries(ACCESSORIES).map(([id, it]) => item('acc', id, it)).join('')}</div>
    <div class="item-desc"><b>${ACCESSORIES[d.acc].icon} ${ACCESSORIES[d.acc].name}</b><br>${ACCESSORIES[d.acc].desc}</div>`;
  const sel = EMBLEMS[d.emblem];
  const emblems = `
    <div class="opt-grid">${Object.entries(EMBLEMS).map(([k, e]) => `<button class="opt ${d.emblem === k ? 'on' : ''}" data-action="av" data-k="emblem" data-v="${k}"><span class="ic" style="font-size:1.6rem">${e.icon}</span>${e.name.split(' ')[0]}</button>`).join('')}</div>
    <div class="item-desc"><b>${sel.icon} ${sel.name}</b><br>${sel.desc}</div>`;
  const tabBtn = (k, n) => `<button class="${tab === k ? 'on' : ''}" data-action="av-tab" data-v="${k}">${n}</button>`;
  $('#modal .sheet').innerHTML = `
    <h2>Espejo del vestidor</h2>
    <div class="av-preview"><div class="av-clip">${avatarSvg(d)}</div></div>
    <div class="seg">${tabBtn('personajes', 'Personajes')}${tabBtn('retrato', 'Retrato')}${tabBtn('emblema', 'Emblema')}</div>
    ${{ personajes: presets, retrato: portrait, emblema: emblems }[tab]}
    <div class="row" style="margin-top:14px">
      ${tab === 'retrato' ? '<button class="btn ghost grow" data-action="av-random">🎲 Al azar</button>' : ''}
      <button class="btn grow" data-action="av-save">Guardar</button>
    </div>
    <button class="btn ghost block" style="margin-top:8px" data-action="close-modal">Cancelar</button>`;
}

function chooseWear(kind, id) {
  const it = wardrobeItem(kind, id);
  if (it.cost > 0 && !owns(id)) {
    if (!state.hero) return toast('🔒 Se desbloquea en la Sastrería de la Tienda cuando empieces tu aventura');
    if (state.hero.gold < it.cost) return toast(`🔒 ${it.name}: necesitas ${it.cost} 🪙 (tienes ${state.hero.gold})`);
    if (!confirm(`¿Comprar ${it.name} por ${it.cost} de oro?\n\n${it.desc}`)) return;
    if (!buyWear(kind, id)) return;
    renderHud();
  }
  avatarEdit.draft[kind] = id;
  renderAvatarEditor();
}

function saveAvatar() {
  const { target, draft } = avatarEdit;
  if (target === 'hero') {
    state.hero.avatar = draft;
    closeModal();
    toast('🪞 Apariencia actualizada');
    afterAction();
  } else {
    onboard.avatar = draft;
    closeModal();
    renderOnboarding();
  }
}

/* ---------- Ficha de objeto ---------- */
function openItemInfo(kind, id) {
  const it = kind === 'shop' ? SHOP_ITEMS.find((x) => x.id === id) : wardrobeItem(kind, id);
  if (!it) return;
  const isShop = kind === 'shop';
  const have = !isShop && owns(id);
  openModal(`
    <div class="reward-big">${it.icon}</div>
    <h2>${it.name}</h2>
    <p class="lore" style="font-size:1rem">“${isShop ? it.lore : it.desc}”</p>
    ${isShop ? `<p><b>Efecto:</b> ${it.desc}</p>` : `<p class="small muted">${kind === 'outfit' ? 'Atuendo' : 'Accesorio'} para tu retrato.</p>`}
    <p><b>Precio:</b> ${it.cost} 🪙 · <span class="muted">Tienes ${state.hero.gold} 🪙</span></p>
    <div class="row">
      <button class="btn ghost grow" data-action="close-modal">Cerrar</button>
      ${have ? '<button class="btn grow" data-action="avatar-edit">Ponérmelo</button>'
        : `<button class="btn grow" data-action="${isShop ? 'buy-item' : 'buy-wear'}" data-kind="${kind}" data-id="${id}" data-close="1" ${state.hero.gold < it.cost ? 'disabled' : ''}>Comprar</button>`}
    </div>`, { cls: 'center-sheet' });
}

/* ---------- Editor de recompensas ---------- */
function openRewardEditor(id) {
  const r = id ? state.rewards.find((x) => x.id === id) : null;
  rewardEditor = r ? { desc: '', ...r } : { id: null, title: '', icon: '🎁', cost: 50, desc: '' };
  openModal('', { mount: renderRewardEditor });
}

function renderRewardEditor() {
  const r = rewardEditor;
  $('#modal .sheet').innerHTML = `
    <h2>${r.id ? 'Editar' : 'Nueva'} recompensa</h2>
    <label class="field"><span>¿Con qué te premias?</span><input class="input" id="rw-title" maxlength="60" value="${esc(r.title)}" placeholder="Ej. Ver una película"></label>
    <div class="field-label">Ícono</div>
    <div class="opt-grid" style="grid-template-columns:repeat(6,minmax(0,1fr))">${REWARD_ICONS.map((ic) => `<button class="opt ${r.icon === ic ? 'on' : ''}" data-action="rw-icon" data-v="${ic}" style="font-size:1.4rem">${ic}</button>`).join('')}</div>
    <label class="field"><span>Descripción</span><textarea class="input" id="rw-desc" maxlength="160" placeholder="Ej. Una función de cine con palomitas grandes">${esc(r.desc)}</textarea></label>
    <label class="field"><span>Precio en oro</span><input class="input" id="rw-cost" type="number" min="1" max="99999" value="${r.cost}"></label>
    <div class="row"><button class="btn ghost grow" data-action="close-modal">Cancelar</button><button class="btn grow" data-action="rw-save">Guardar</button></div>
    ${r.id ? '<button class="btn danger block" style="margin-top:10px" data-action="rw-delete">Eliminar</button>' : ''}`;
  $('#rw-title').addEventListener('input', (ev) => { r.title = ev.target.value; });
  $('#rw-cost').addEventListener('input', (ev) => { r.cost = ev.target.value; });
  $('#rw-desc').addEventListener('input', (ev) => { r.desc = ev.target.value; });
}

function saveReward() {
  const r = rewardEditor;
  r.title = r.title.trim();
  r.desc = (r.desc || '').trim();
  r.cost = Math.round(Number(r.cost));
  if (!r.title) return toast('✍️ Ponle un nombre a la recompensa');
  if (!(r.cost > 0)) return toast('🪙 El precio debe ser mayor que 0');
  if (r.id) Object.assign(state.rewards.find((x) => x.id === r.id), r);
  else state.rewards.push({ ...r, id: uid() });
  closeModal();
  afterAction();
}

/* ---------- Modales, toasts y efectos ---------- */
function openModal(html, opts = {}) {
  const m = $('#modal');
  m.innerHTML = `<div class="sheet ${opts.cls || ''}" role="dialog" aria-modal="true">${html}</div>`;
  m.classList.add('open');
  m.onclick = (ev) => { if (ev.target === m) closeModal(); };
  opts.mount?.();
}

function closeModal() {
  const m = $('#modal');
  if (!m.classList.contains('open')) return;
  m.classList.remove('open');
  editor = null; rewardEditor = null; avatarEdit = null;
  setTimeout(() => { if (!m.classList.contains('open')) m.innerHTML = ''; flushEvents(); }, 220);
}

const modalOpen = () => $('#modal').classList.contains('open');

function flushEvents() {
  while (events.length && !modalOpen()) {
    const ev = events.shift();
    if (ev.type === 'toast') { toast(ev.text); continue; }
    showEventModal(ev);
  }
}

function showEventModal(ev) {
  const ok = '<button class="btn block" data-action="close-modal">Continuar</button>';
  let html = '';
  if (ev.type === 'level') {
    html = `<div class="reward-big">${ev.rank ? '👑' : '⭐'}</div><h2>¡Subiste a nivel ${ev.lv}!</h2>
      ${ev.rank ? `<p>Has ascendido al rango <b>${ev.rank}</b>. El gremio reconoce tu poder.</p>` : '<p>Tu vida se restauró por completo.</p>'}${ok}`;
    vibrate([30, 50, 30, 50, 80]);
  } else if (ev.type === 'attr-rank') {
    const A = AREAS[ev.area];
    html = `<div class="reward-big">${A.icon}</div><h2>${A.attr}: rango ${ev.rank}</h2>
      <p>Tu dominio de <b>${A.name}</b> alcanzó un nuevo rango.</p>${ok}`;
  } else if (ev.type === 'boss') {
    html = `<div class="reward-big">${ev.boss.icon}</div><h2>¡${esc(ev.boss.name)} derrotado!</h2>
      <p>Venciste a la ${esc(ev.boss.vice)} esta semana.</p><p><b>+${ev.xp} XP · +${ev.gold} 🪙</b></p>${ok}`;
    vibrate([50, 50, 50, 50, 150]);
  } else if (ev.type === 'faint') {
    html = `<div class="reward-big">🪦</div><h2>Has caído en batalla</h2>
      <p>Tus heridas fueron demasiadas. Despiertas en la posada del pueblo.</p>
      <p class="muted">Perdiste ${ev.gold} 🪙 y la experiencia de este nivel. Tu nivel se conserva.</p>
      <button class="btn block" data-action="close-modal">Levantarme de nuevo</button>`;
  } else if (ev.type === 'reward') {
    html = `<div class="reward-big">${ev.reward.icon}</div><h2>¡Recompensa canjeada!</h2>
      <p>Disfruta: <b>${esc(ev.reward.title)}</b>. Te lo ganaste, aventurero.</p>${ok}`;
  } else if (ev.type === 'dawn') {
    const r = ev.report;
    html = `<div class="reward-big">🌅</div><h2>Informe del amanecer</h2>
      ${r.perfect ? `<p>🌟 Lograste ${r.perfect} ${r.perfect === 1 ? 'día perfecto' : 'días perfectos'}.</p>` : ''}
      ${r.shielded ? `<p>🛡️ Tu pergamino protector salvó tus rachas ${r.shielded === 1 ? 'una vez' : r.shielded + ' veces'}.</p>` : ''}
      ${r.missed.length ? `<p>Las tareas olvidadas te hirieron: <b>−${r.dmg} PV</b></p>
        <div class="tpl-list">${[...new Set(r.missed)].slice(0, 8).map((t) => `<button disabled>✗ ${esc(t)}</button>`).join('')}</div>` : ''}
      <p class="muted small">Un nuevo día comienza. ¡A por ello!</p>${ok}`;
  } else if (ev.type === 'welcome') {
    html = `<div class="reward-big">📜</div><h2>${state.hero.avatar.sex === 'm' ? 'Bienvenido' : 'Bienvenida'}, ${esc(state.hero.name)}</h2>
      <p class="small">• <b>Diarias</b>: se repiten; cúmplelas para hacer rachas. Si las olvidas, pierdes vida.</p>
      <p class="small">• <b>Hábitos ±</b>: pulsa + al hacer algo bueno, − al caer en un mal hábito.</p>
      <p class="small">• <b>Misiones</b>: metas únicas con gran recompensa.</p>
      <p class="small">• Gana <b>XP</b> para subir de rango y <b>oro</b> para canjear recompensas reales.</p>
      <p class="small">• Cada semana un <b>jefe</b> te desafía. ¡Derrótalo con constancia!</p>
      <button class="btn block" data-action="close-modal">¡Que comience la aventura!</button>`;
  }
  openModal(html, { cls: 'center-sheet' });
}

function toast(text) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = text;
  $('#toasts').appendChild(el);
  setTimeout(() => el.remove(), 3300);
}

function floatText(e, text, cls, offset) {
  const x = e?.clientX || innerWidth / 2;
  const y = (e?.clientY || innerHeight / 2) - offset * 24;
  const el = document.createElement('div');
  el.className = 'float ' + cls;
  el.textContent = text;
  el.style.left = clamp(x, 70, innerWidth - 70) + 'px';
  el.style.top = y + 'px';
  el.style.animationDelay = offset * 0.12 + 's';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

/* ---------- Respaldo ---------- */
function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `cronicas-respaldo-${today()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast('⬇️ Respaldo descargado');
}

$('#import-file').addEventListener('change', (ev) => {
  const file = ev.target.files[0];
  ev.target.value = '';
  if (!file) return;
  file.text().then((txt) => {
    const data = JSON.parse(txt);
    if (!data || !data.hero || !Array.isArray(data.habits)) throw new Error('formato');
    if (!confirm('¿Reemplazar tu progreso actual con este respaldo?')) return;
    state = migrate(data);
    save();
    render();
    toast('⬆️ Respaldo restaurado');
  }).catch(() => toast('⚠️ Ese archivo no es un respaldo válido'));
});

/* ---------- Manejo de clics ---------- */
const ACTIONS = {
  tab: (el) => { ui.tab = el.dataset.tab; render(); window.scrollTo(0, 0); },
  filter: (el) => { ui.filter = el.dataset.v; render(); },
  area: (el) => { ui.area = el.dataset.v; render(); },
  guild: (el) => { ui.guild = el.dataset.v; render(); },
  'toggle-daily': (el, e) => toggleDaily(el.dataset.id, e),
  'habit-plus': (el, e) => habitPlus(el.dataset.id, e),
  'habit-minus': (el, e) => habitMinus(el.dataset.id, e),
  'quest-done': (el, e) => questDone(el.dataset.id, e),
  add: () => openHabitEditor(null),
  edit: (el) => openHabitEditor(el.dataset.id),
  'close-modal': () => closeModal(),

  ed: (el) => {
    const k = el.dataset.k;
    editor[k] = k === 'diff' ? Number(el.dataset.v) : el.dataset.v;
    renderEditor();
  },
  'ed-day': (el) => {
    const d = Number(el.dataset.v);
    editor.days = editor.days.includes(d) ? editor.days.filter((x) => x !== d) : [...editor.days, d];
    renderEditor();
  },
  'ed-flag': (el) => { editor[el.dataset.k] = !editor[el.dataset.k]; renderEditor(); },
  'ed-tpl': (el) => {
    const tp = TEMPLATES[editor.area][Number(el.dataset.v)];
    Object.assign(editor, { title: tp.t, type: tp.type, diff: tp.diff, days: tp.days ? [...tp.days] : [0, 1, 2, 3, 4, 5, 6], pos: !tp.neg, neg: !!tp.neg });
    renderEditor();
  },
  'ed-icon': (el) => { editor.icon = el.dataset.v; renderEditor(); },
  'ed-save': () => saveEditor(),
  'ed-delete': () => {
    if (!confirm('¿Eliminar esta tarea? Su racha se perderá.')) return;
    state.habits = state.habits.filter((h) => h.id !== editor.id);
    closeModal();
    toast('🗑️ Eliminada');
    afterAction();
  },

  'buy-item': (el) => buyItem(el.dataset.id),
  'buy-wear': (el) => { if (buyWear(el.dataset.kind, el.dataset.id)) render(); },
  'item-info': (el) => openItemInfo(el.dataset.kind, el.dataset.id),

  'avatar-edit': (el) => openAvatarEditor(el.dataset.tab),
  av: (el) => {
    const k = el.dataset.k;
    avatarEdit.draft[k] = k === 'skin' ? Number(el.dataset.v) : el.dataset.v;
    renderAvatarEditor();
  },
  'av-flag': (el) => { avatarEdit.draft[el.dataset.k] = !avatarEdit.draft[el.dataset.k]; renderAvatarEditor(); },
  'av-item': (el) => chooseWear(el.dataset.k, el.dataset.v),
  'av-tab': (el) => {
    avatarEdit.tab = el.dataset.v;
    avatarEdit.draft.mode = el.dataset.v === 'emblema' ? 'emblem' : 'portrait';
    renderAvatarEditor();
  },
  'av-preset': (el) => {
    const i = Number(el.dataset.v);
    avatarEdit.preset = i;
    avatarEdit.draft = normalizeAvatar({ ...PRESETS[i].av, emblem: avatarEdit.draft.emblem });
    renderAvatarEditor();
  },
  'av-random': () => { avatarEdit.draft = randomAvatar(state.hero?.owned); renderAvatarEditor(); },
  'av-save': () => saveAvatar(),
  'buy-reward': (el) => buyReward(el.dataset.id),
  'edit-reward': (el) => openRewardEditor(el.dataset.id),
  'rw-icon': (el) => { rewardEditor.icon = el.dataset.v; renderRewardEditor(); },
  'rw-save': () => saveReward(),
  'rw-delete': () => {
    state.rewards = state.rewards.filter((r) => r.id !== rewardEditor.id);
    closeModal();
    afterAction();
  },

  'set-theme': (el) => { state.settings.theme = el.dataset.v; save(); render(); },
  'set-class': (el) => { state.hero.cls = el.dataset.v; save(); render(); toast(`${CLASSES[el.dataset.v].icon} Ahora eres ${className(el.dataset.v, state.hero.avatar)}`); },
  'save-name': () => {
    const n = $('#set-name').value.trim();
    if (!n) return toast('✍️ El nombre no puede estar vacío');
    state.hero.name = n; save(); render(); toast('📝 Nombre actualizado');
  },
  'toggle-vibrate': () => { state.settings.vibrate = !state.settings.vibrate; save(); render(); },
  install: async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    render();
  },
  export: () => exportData(),
  import: () => $('#import-file').click(),
  reset: () => {
    if (!confirm('Esto borrará tu héroe y todo tu progreso. ¿Seguro?')) return;
    if (!confirm('Última advertencia: no se puede deshacer. ¿Borrar todo?')) return;
    const theme = state.settings.theme;
    state = newState();
    state.settings.theme = theme;
    save();
    ui.tab = 'misiones';
    render();
  },

  'ob-class': (el) => { onboard.cls = el.dataset.v; renderOnboarding(); },
  'ob-theme': (el) => { state.settings.theme = el.dataset.v; applyTheme(); renderOnboarding(); },
  'ob-start': () => startAdventure(),
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el || el.disabled) return;
  const fn = ACTIONS[el.dataset.action];
  if (!fn) return;
  if (el.classList.contains('check') || el.classList.contains('habit-btn')) {
    el.classList.remove('burst'); void el.offsetWidth; el.classList.add('burst');
  }
  fn(el, e);
  if (el.dataset.close) closeModal();
});

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

/* ---------- Ciclo de vida ---------- */
function tick() {
  if (!state.hero) return;
  if (state.lastDate !== today()) {
    rollover();
    afterAction();
  }
}

document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
setInterval(tick, 60 * 1000);

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  installPrompt = e;
  if (ui.tab === 'gremio' && state.hero) render();
});

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
navigator.storage?.persist?.();

// Motas de luz que flotan como polvo bajo el sol de la ventana
(function spawnMotes() {
  const box = document.createElement('div');
  box.className = 'motes';
  for (let i = 0; i < 14; i++) {
    const m = document.createElement('i');
    const size = 2 + Math.random() * 3;
    m.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;animation-duration:${14 + Math.random() * 16}s;animation-delay:-${Math.random() * 30}s`;
    box.appendChild(m);
  }
  document.body.prepend(box);
})();

// Arranque
if (state.hero) {
  rollover();
  ensureBoss();
  checkAchievements();
  save();
}
render();
flushEvents();
