'use strict';
/* =========================================================
   Retratos del héroe: ilustración estilo anime en SVG,
   emblemas medievales y prendas de la sastrería.
   ========================================================= */

const HAIR_COLORS = {
  azul:     { name: 'Azul celeste', c: '#4aa8e0' },
  turquesa: { name: 'Turquesa',     c: '#36bfb2' },
  rojo:     { name: 'Rojo fuego',   c: '#d9443a' },
  plata:    { name: 'Plata',        c: '#e6e8f0' },
  verde:    { name: 'Verde bosque', c: '#7cc44c' },
  rubio:    { name: 'Rubio',        c: '#f2d47e' },
  castano:  { name: 'Castaño',      c: '#9c6a42' },
  cobre:    { name: 'Cobre',        c: '#e57a3a' },
  rosa:     { name: 'Rosa',         c: '#e783a8' },
  negro:    { name: 'Negro',        c: '#2f2c3c' },
};
const EYE_COLORS = {
  verde:   { name: 'Verde',   c: '#4fb648' },
  azul:    { name: 'Azul',    c: '#3a86de' },
  celeste: { name: 'Celeste', c: '#5fcbef' },
  ambar:   { name: 'Ámbar',   c: '#e0a02e' },
  rojo:    { name: 'Rojo',    c: '#d63c3c' },
  violeta: { name: 'Violeta', c: '#9566d6' },
  dorado:  { name: 'Dorado',  c: '#f2c230' },
};
// Los tres últimos tonos son para razas no humanas (demonios, raza marina…), pero cualquiera puede usarlos.
const SKINS = ['#ffe9db', '#f9d6bf', '#e4b592', '#b27c57', '#cdb8ea', '#aab8cc', '#bfe6dc'];
const HAIR_STYLES = { largo: 'Largo', media: 'Melena', corto: 'Corto', puntas: 'Puntas', trenzas: 'Trenzas', coleta: 'Coleta' };
const SEXES = { f: 'Femenino', m: 'Masculino' };

// Razas del mundo de las Seis Tierras (inspiradas en Mushoku Tensei).
const RACES = {
  humano:    { name: 'Humano', icon: '🧑',
               desc: 'La raza más numerosa del mundo. Viven poco comparados con otros pueblos, por eso aprenden rápido y no se rinden fácilmente.' },
  elfo:      { name: 'Elfo', icon: '🧝',
               desc: 'Orejas largas y vidas de siglos. Habitan los grandes bosques, dominan el arco y la magia de viento.' },
  medioelfo: { name: 'Medio elfo', icon: '🌿',
               desc: 'Sangre humana y élfica. Orejas apenas puntiagudas, oído finísimo y un talento natural para la magia.' },
  enano:     { name: 'Enano', icon: '⚒️',
               desc: 'Bajos, robustos y tercos como la roca. Herreros legendarios de las montañas; sus barbas son su orgullo.' },
  mediano:   { name: 'Mediano', icon: '🍀',
               desc: 'Pequeños, ágiles y alegres. Parecen niños toda la vida y son expertos en pasar desapercibidos.' },
  bestia:    { name: 'Raza bestia', icon: '🐺',
               desc: 'Pueblos del Gran Bosque con orejas y cola animales. Olfato agudo, instinto de cazador y lealtad feroz a su clan.' },
  migurd:    { name: 'Migurd', icon: '💧',
               desc: 'Pueblo demonio de cabello azul que conserva un aspecto juvenil toda su vida. Se comunican entre ellos casi sin palabras.' },
  superd:    { name: 'Superd', icon: '🔱',
               desc: 'Guerreros de cabello verde con una gema roja en la frente que lo ve todo. Temidos por leyendas injustas; nobles de corazón.' },
  demonio:   { name: 'Raza demoníaca', icon: '😈',
               desc: 'Pueblos del Continente Demoníaco de formas muy variadas: cuernos, piel de colores y una vitalidad asombrosa.' },
  celestial: { name: 'Raza celestial', icon: '🪽',
               desc: 'Seres alados de las islas del cielo. Orgullosos y disciplinados, rara vez descienden al mundo de abajo.' },
  marina:    { name: 'Raza marina', icon: '🐚',
               desc: 'Habitantes del océano con aletas por orejas y escamas en las mejillas. En tierra se mueven con cautela; en el agua, nadie los alcanza.' },
  dragon:    { name: 'Raza dragón', icon: '🐲',
               desc: 'Linaje antiguo descendiente de los dragones. Pupilas rasgadas, cuernos y un poder que los demás pueblos temen.' },
};
const BEASTS = { lobo: 'Lobo', gato: 'Gato', conejo: 'Conejo' };
const EXPRESSIONS = { sonrisa: 'Sonrisa', alegre: 'Alegre', serena: 'Serena', decidida: 'Decidida', sorpresa: 'Sorpresa' };
const OUTFIT_COLORS = ['#2f4a7a', '#7a1f2b', '#2f6a4a', '#efe6d2', '#5a3a8a', '#3a3a46', '#b8862f', '#3a7f9a'];

// Prendas: las que tienen precio se compran con oro en la sastrería.
const OUTFITS = {
  tunica:   { name: 'Túnica de aventurero', icon: '🧥', cost: 0,
              desc: 'Lino resistente y un lazo carmesí al cuello. La prenda de quien acaba de inscribirse en el gremio y tiene todo el camino por delante.' },
  manto:    { name: 'Manto de mago', icon: '🪄', cost: 0,
              desc: 'Tejido con hilos que guardan el calor del maná. Su broche dorado distingue a los estudiantes de las academias de magia.' },
  vestido:  { name: 'Vestido de pueblo', icon: '👗', cost: 0,
              desc: 'Sencillo y elegante, con volantes blancos. Perfecto para los festivales de la cosecha y las tardes junto al fuego de la taberna.' },
  armadura: { name: 'Armadura de caballero', icon: '🛡️', cost: 200,
              desc: 'Placas de acero pulido con ribetes de oro. Pesa como una promesa: solo quien ha templado su voluntad puede cargarla.' },
};
const ACCESSORIES = {
  ninguno:  { name: 'Sin accesorio', icon: '✖️', cost: 0, desc: 'A cara descubierta, como llegaste al mundo.' },
  sombrero: { name: 'Sombrero de maga', icon: '🎩', cost: 0,
              desc: 'Ala ancha y punta caída. Protege del sol del desierto y de las miradas curiosas. Quien lo usa parece saber más de lo que dice.' },
  lentes:   { name: 'Anteojos de erudito', icon: '👓', cost: 0,
              desc: 'Cristales pulidos por un artesano enano. Ninguna letra pequeña de un grimorio escapa a tu vista.' },
  lazo:     { name: 'Lazo de seda', icon: '🎀', cost: 0,
              desc: 'El regalo de alguien querido. Un recordatorio de por qué sigues adelante cada mañana.' },
  flores:   { name: 'Corona de flores', short: 'Flores', icon: '🌸', cost: 80,
              desc: 'Trenzada con flores del bosque élfico. Dicen que nunca se marchita mientras su portador sea constante.' },
  diadema:  { name: 'Diadema de zafiro', icon: '💠', cost: 150,
              desc: 'Una gema azul que brilla con el maná de quien la porta. Insignia de los magos de rango Avanzado.' },
  corona:   { name: 'Corona real', icon: '👑', cost: 400,
              desc: 'Oro macizo y rubíes del sur. Reservada para quienes gobiernan su propia vida con disciplina de rey.' },
};

// Emblemas medievales para quien prefiera un escudo de armas en vez de retrato.
const EMBLEMS = {
  espadas:  { icon: '⚔️', name: 'Espadas cruzadas', desc: 'Emblema de los duelistas. Dos filos: la disciplina y la constancia.' },
  escudo:   { icon: '🛡️', name: 'Escudo del guardián', desc: 'Para quien protege su salud y a los suyos antes que nada.' },
  dragon:   { icon: '🐉', name: 'Dragón ancestral', desc: 'Símbolo de poder que crece con los años. Los dragones no tienen prisa.' },
  castillo: { icon: '🏰', name: 'Fortaleza', desc: 'Una vida construida piedra a piedra, hábito a hábito.' },
  corona:   { icon: '👑', name: 'Corona', desc: 'El estandarte de quien se gobierna a sí mismo.' },
  orbe:     { icon: '🔮', name: 'Orbe arcano', desc: 'Para estudiosos de la magia y de la mente.' },
  varita:   { icon: '🪄', name: 'Báculo de maná', desc: 'Pequeños hechizos diarios que cambian el mundo.' },
  pergamino:{ icon: '📜', name: 'Pergamino antiguo', desc: 'El sello de los eruditos y cronistas del reino.' },
  llave:    { icon: '🗝️', name: 'Llave del tesoro', desc: 'Toda puerta se abre con paciencia y la llave correcta.' },
  arco:     { icon: '🏹', name: 'Arco del explorador', desc: 'Apunta lejos, respira y suelta. Los objetivos claros se alcanzan.' },
  lobo:     { icon: '🐺', name: 'Lobo de la manada', desc: 'Fuerte en soledad, invencible junto a los suyos.' },
  buho:     { icon: '🦉', name: 'Búho sabio', desc: 'Vigila en la noche y aprende de todo lo que ve.' },
  rosa:     { icon: '🌹', name: 'Rosa espinada', desc: 'Belleza que se defiende. Gentileza con límites firmes.' },
  flor:     { icon: '⚜️', name: 'Flor de lis', desc: 'Antiguo símbolo de nobleza, honor y lealtad.' },
  jarra:    { icon: '🍺', name: 'Jarra de taberna', desc: 'Para quien sabe que el descanso también es parte de la aventura.' },
  llama:    { icon: '🔥', name: 'Llama eterna', desc: 'La racha que nunca se apaga.' },
};

const DEFAULT_AVATAR = {
  mode: 'portrait', sex: 'f', race: 'humano', beast: 'lobo', style: 'largo', hair: 'azul', eyes: 'verde', skin: 0, expr: 'sonrisa',
  outfit: 'tunica', ocolor: '#2f4a7a', acc: 'ninguno', ahoge: false, beard: false, emblem: 'espadas',
};

// Personajes listos para elegir; después se pueden ajustar en "Retrato". Solo usan prendas gratuitas.
const PRESETS = [
  { name: 'Lysara',   role: 'Maga del agua',        desc: 'Pequeña maga migurd que viajó lejos de su aldea para aprender todos los hechizos del mundo.',
    av: { sex: 'f', race: 'migurd', hair: 'azul', eyes: 'celeste', style: 'trenzas', acc: 'sombrero', outfit: 'manto', ocolor: '#2f4a7a', expr: 'serena' } },
  { name: 'Kael',     role: 'Espadachín errante',    desc: 'Joven humano que sueña con ser el mejor espadachín del continente. Entrena antes del amanecer.',
    av: { sex: 'm', race: 'humano', hair: 'castano', eyes: 'verde', style: 'puntas', outfit: 'tunica', ocolor: '#3a3a46', ahoge: true, expr: 'sonrisa' } },
  { name: 'Irene',    role: 'Espadachina feroz',     desc: 'Humana de carácter ardiente que resuelve todo con la espada… y está aprendiendo a usar también la cabeza.',
    av: { sex: 'f', race: 'humano', hair: 'rojo', eyes: 'rojo', style: 'largo', outfit: 'tunica', ocolor: '#7a1f2b', expr: 'decidida' } },
  { name: 'Taelin',   role: 'Arquera del bosque',    desc: 'Medio elfa de cabello plateado, tímida pero valiente. Su puntería nunca falla.',
    av: { sex: 'f', race: 'medioelfo', hair: 'plata', eyes: 'verde', style: 'media', outfit: 'tunica', ocolor: '#2f6a4a', acc: 'lazo', expr: 'sonrisa' } },
  { name: 'Aerendil', role: 'Mago de los vientos',   desc: 'Elfo de trescientos años que aún se considera un aprendiz. Paciente como un roble.',
    av: { sex: 'm', race: 'elfo', hair: 'rubio', eyes: 'azul', style: 'largo', outfit: 'manto', ocolor: '#2f6a4a', expr: 'serena' } },
  { name: 'Borin',    role: 'Herrero de la montaña', desc: 'Enano que forja armas y hábitos con el mismo cuidado. Cada golpe del martillo cuenta.',
    av: { sex: 'm', race: 'enano', hair: 'cobre', eyes: 'ambar', style: 'corto', beard: true, outfit: 'tunica', ocolor: '#b8862f', expr: 'alegre', skin: 1 } },
  { name: 'Pippa',    role: 'Exploradora mediana',   desc: 'Mediana curiosa que conoce cada atajo y cada taberna del reino.',
    av: { sex: 'f', race: 'mediano', hair: 'castano', eyes: 'verde', style: 'coleta', outfit: 'vestido', ocolor: '#2f6a4a', expr: 'alegre' } },
  { name: 'Garrok',   role: 'Guerrero del clan lobo', desc: 'Hombre bestia del Gran Bosque. Protege a su manada con colmillo y honor.',
    av: { sex: 'm', race: 'bestia', beast: 'lobo', hair: 'negro', eyes: 'ambar', style: 'puntas', outfit: 'tunica', ocolor: '#7a1f2b', expr: 'decidida', skin: 2 } },
  { name: 'Nyra',     role: 'Cazadora felina',       desc: 'Mujer bestia de orejas de gato. Ágil, orgullosa y con un apetito legendario.',
    av: { sex: 'f', race: 'bestia', beast: 'gato', hair: 'cobre', eyes: 'dorado', style: 'media', outfit: 'tunica', ocolor: '#3a3a46', expr: 'sonrisa' } },
  { name: 'Zerav',    role: 'Guardián de la gema',   desc: 'Guerrero superd de tres siglos. Su gema roja ve el peligro antes de que llegue.',
    av: { sex: 'm', race: 'superd', hair: 'verde', eyes: 'rojo', style: 'corto', outfit: 'manto', ocolor: '#3a3a46', expr: 'decidida', skin: 1 } },
  { name: 'Velka',    role: 'Princesa demonio',      desc: 'Heredera de un reino del Continente Demoníaco. Risa escandalosa, corazón generoso.',
    av: { sex: 'f', race: 'demonio', hair: 'rosa', eyes: 'violeta', style: 'largo', outfit: 'vestido', ocolor: '#5a3a8a', expr: 'alegre', skin: 4 } },
  { name: 'Seraphiel', role: 'Sanadora celestial',   desc: 'Descendió de las islas del cielo para aprender a curar a los de abajo.',
    av: { sex: 'f', race: 'celestial', hair: 'rubio', eyes: 'celeste', style: 'largo', outfit: 'vestido', ocolor: '#efe6d2', expr: 'serena' } },
  { name: 'Coralyn',  role: 'Bardo de las mareas',   desc: 'Miembro de la raza marina que canta historias de naufragios en los puertos.',
    av: { sex: 'm', race: 'marina', hair: 'turquesa', eyes: 'azul', style: 'media', outfit: 'tunica', ocolor: '#3a7f9a', expr: 'sonrisa', skin: 6 } },
  { name: 'Orvald',   role: 'Heredero dragón',       desc: 'Del antiguo linaje dragón. Callado y temible, pero siempre cumple su palabra.',
    av: { sex: 'm', race: 'dragon', hair: 'plata', eyes: 'dorado', style: 'media', outfit: 'manto', ocolor: '#3a3a46', expr: 'decidida' } },
];

const LASH = '#3a2420';
let avatarSeq = 0;

// amt < 0 oscurece, amt > 0 aclara (−1…1)
function mix(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  const ch = (v) => Math.round(v + (t - v) * p);
  return '#' + ((1 << 24) | (ch(n >> 16) << 16) | (ch((n >> 8) & 255) << 8) | ch(n & 255)).toString(16).slice(1);
}

/* ---------- Fondo: taberna iluminada por ventana y chimenea ---------- */
function sceneSvg(u) {
  return `<defs>
      <radialGradient id="${u}bg" cx="22%" cy="18%" r="100%">
        <stop offset="0" stop-color="#ffe4ad"/><stop offset=".42" stop-color="#b9763d"/><stop offset="1" stop-color="#341c12"/>
      </radialGradient>
      <radialGradient id="${u}fire" cx="100%" cy="100%" r="60%">
        <stop offset="0" stop-color="#ff9640" stop-opacity=".85"/><stop offset="1" stop-color="#ff9640" stop-opacity="0"/>
      </radialGradient>
      <pattern id="${u}lat" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M0,0V9M0,0H9" stroke="#7a4a24" stroke-width="1.4"/>
      </pattern>
    </defs>
    <rect width="200" height="200" fill="url(#${u}bg)"/>
    <g opacity=".55"><rect x="6" y="14" width="50" height="84" rx="3" fill="#fff4d6"/><rect x="6" y="14" width="50" height="84" rx="3" fill="url(#${u}lat)"/>
      <rect x="6" y="14" width="50" height="84" rx="3" fill="none" stroke="#6b3e1e" stroke-width="3"/></g>
    <rect width="200" height="200" fill="url(#${u}fire)"/>
    <g fill="#fff6d8"><circle cx="70" cy="18" r="2.2" opacity=".7"/><circle cx="150" cy="30" r="1.6" opacity=".6"/><circle cx="34" cy="120" r="1.8" opacity=".5"/><circle cx="176" cy="96" r="2.4" opacity=".45"/></g>`;
}

/* ---------- Partes del retrato ---------- */
// Proporciones según sexo y raza
function bodyType(a) {
  const young = a.race === 'migurd' || a.race === 'mediano';
  return {
    male: a.sex === 'm',
    young,
    stout: a.race === 'enano',
    // escala horizontal del torso: hombros más anchos o más estrechos
    torso: a.race === 'enano' ? 1.14 : young ? 0.9 : a.sex === 'm' ? 1.08 : 1,
  };
}

function eyeOpen(u, cx, m, eye, bt, slit) {
  const cy = 108;
  const X = (dx) => (cx + dx * m).toFixed(1);
  const white = `M${X(-12)},${cy - 3} Q${X(-2)},${cy - 14} ${X(11)},${cy - 5} Q${X(11)},${cy + 8} ${X(1)},${cy + 11} Q${X(-10)},${cy + 9} ${X(-12)},${cy - 3} Z`;
  const id = `${u}e${m > 0 ? 'l' : 'r'}`;
  // Ojos masculinos más rasgados; razas de aspecto juvenil, más grandes.
  const sy = bt.male ? 0.84 : bt.young ? 1.1 : 1;
  const sx = bt.young ? 1.06 : 1;
  const lashW = bt.male ? 2.8 : 3.4;
  return `<g transform="translate(${cx} ${cy}) scale(${sx} ${sy}) translate(${-cx} ${-cy})">
    <clipPath id="${id}"><path d="${white}"/></clipPath>
    <path d="${white}" fill="#fff"/>
    <g clip-path="url(#${id})">
      <ellipse cx="${X(0.5)}" cy="${cy + 1.5}" rx="7.8" ry="10.5" fill="url(#${u}iris)"/>
      ${slit
        ? `<ellipse cx="${X(0.5)}" cy="${cy + 2}" rx="1.6" ry="7" fill="${mix(eye, -0.75)}"/>`
        : `<ellipse cx="${X(0.5)}" cy="${cy + 2.5}" rx="3.6" ry="5.2" fill="${mix(eye, -0.7)}"/>`}
      <path d="M${X(-13)},${cy - 9} H${X(13)} V${cy - 1} Q${X(0)},${cy - 5} ${X(-13)},${cy - 1} Z" fill="rgba(40,20,20,.22)"/>
      <circle cx="${cx - 3}" cy="${cy - 2.5}" r="3.1" fill="#fff"/>
      <circle cx="${cx + 3.5}" cy="${cy + 6}" r="1.5" fill="#fff" opacity=".9"/>
    </g>
    <path d="M${X(-13.5)},${cy - 1} Q${X(-3)},${cy - 16} ${X(12.5)},${cy - 5}" stroke="${LASH}" stroke-width="${lashW}" fill="none" stroke-linecap="round"/>
    ${bt.male ? '' : `<path d="M${X(-13.5)},${cy - 1} L${X(-17)},${cy + 2}" stroke="${LASH}" stroke-width="2.3" stroke-linecap="round"/>`}
    <path d="M${X(-6)},${cy + 11} Q${X(1)},${cy + 12.5} ${X(7)},${cy + 9.5}" stroke="${LASH}" stroke-width="1" fill="none" opacity=".55"/>
  </g>`;
}

function eyes(u, a, eye, bt) {
  const cy = 108;
  if (a.expr === 'alegre') {
    return [83, 117].map((cx) => `<path d="M${cx - 9},${cy + 3} Q${cx},${cy - 7} ${cx + 9},${cy + 3}" stroke="${LASH}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('');
  }
  if (a.expr === 'serena') {
    return [[83, 1], [117, -1]].map(([cx, m]) => `<path d="M${cx - 10},${cy} Q${cx},${cy + 7} ${cx + 10},${cy}" stroke="${LASH}" stroke-width="2.8" fill="none" stroke-linecap="round"/>
      ${bt.male ? '' : `<path d="M${cx - 10 * m},${cy} L${cx - 13 * m},${cy - 2}" stroke="${LASH}" stroke-width="2" stroke-linecap="round"/>`}`).join('');
  }
  const slit = a.race === 'dragon';
  return eyeOpen(u, 83, 1, eye, bt, slit) + eyeOpen(u, 117, -1, eye, bt, slit);
}

function brows(a, color, bt) {
  const s = `stroke="${color}" stroke-width="${bt.male ? 3.2 : 2.2}" fill="none" stroke-linecap="round"`;
  if (a.expr === 'decidida') return `<path d="M74,90 Q84,92 93,96" ${s}/><path d="M126,90 Q116,92 107,96" ${s}/>`;
  if (a.expr === 'sorpresa') return `<path d="M74,90 Q83,84 92,87" ${s}/><path d="M126,90 Q117,84 108,87" ${s}/>`;
  if (bt.male) return `<path d="M73,93 Q83,89 93,91" ${s}/><path d="M127,93 Q117,89 107,91" ${s}/>`;
  return `<path d="M74,94 Q83,89 92,92" ${s}/><path d="M126,94 Q117,89 108,92" ${s}/>`;
}

function mouth(a) {
  const line = 'stroke="#8a3a32" stroke-width="2" fill="none" stroke-linecap="round"';
  switch (a.expr) {
    case 'alegre':
      return `<path d="M90,131 Q100,133 110,131 Q106,146 100,146 Q94,146 90,131 Z" fill="#8f2f2a"/>
        <path d="M94.5,141.5 Q100,138 105.5,141.5 Q100,146 94.5,141.5 Z" fill="#ec7a82"/>`;
    case 'serena': return `<path d="M95,134 Q100,137 105,134" ${line}/>`;
    case 'decidida': return `<path d="M93,135 Q102,137 108,132" ${line}/>`;
    case 'sorpresa': return '<ellipse cx="100" cy="136" rx="3.6" ry="4.6" fill="#8f2f2a"/>';
    default: return `<path d="M92,132 Q100,140 108,132" ${line}/>`;
  }
}

function facePath(bt) {
  if (bt.stout) return 'M58,96 C58,68 80,58 100,58 C120,58 142,68 142,96 C142,124 124,146 100,150 C76,146 58,124 58,96 Z';
  if (bt.young) return 'M62,98 C62,70 80,60 100,60 C120,60 138,70 138,98 C138,124 120,144 100,147 C80,144 62,124 62,98 Z';
  if (bt.male) return 'M60,94 C60,68 80,56 100,56 C120,56 140,68 140,94 C140,120 124,144 100,152 C76,144 60,120 60,94 Z';
  return 'M62,96 C62,70 80,58 100,58 C120,58 138,70 138,96 C138,120 118,146 100,152 C82,146 62,120 62,96 Z';
}

function backHair(a, hair, line) {
  const s = `fill="${mix(hair, -0.12)}" stroke="${line}" stroke-width="1.3"`;
  switch (a.style) {
    case 'largo': return `<path d="M56,90 C48,36 152,36 144,90 C150,130 156,168 164,200 L36,200 C44,168 50,130 56,90 Z" ${s}/>`;
    case 'media': return `<path d="M56,92 C48,38 152,38 144,92 C148,118 148,140 142,152 Q100,160 58,152 C52,140 52,118 56,92 Z" ${s}/>`;
    case 'coleta':
      return `<path d="M126,60 C180,54 190,132 164,186 C164,150 158,108 130,82 Z" ${s}/>
        <path d="M58,96 C52,40 148,40 142,96 C142,110 140,120 136,126 L64,126 C60,120 58,110 58,96 Z" ${s}/>`;
    case 'puntas': return `<path d="M58,96 C52,42 148,42 142,96 C142,106 140,114 136,118 L64,118 C60,114 58,106 58,96 Z" ${s}/>`;
    default: return `<path d="M58,96 C52,40 148,40 142,96 C142,110 140,120 136,128 L64,128 C60,120 58,110 58,96 Z" ${s}/>`;
  }
}

function sideLocks(a, hair, line) {
  const len = { corto: 126, puntas: 116, media: 146, largo: 176, trenzas: 122, coleta: 136 }[a.style] || 140;
  const lock = (k) => {
    const x = (v) => (k ? 200 - v : v);
    return `<path d="M${x(60)},84 C${x(53)},110 ${x(52)},${len - 22} ${x(58)},${len} C${x(61)},${len - 26} ${x(66)},112 ${x(73)},96 Z" fill="${hair}" stroke="${line}" stroke-width="1.3"/>`;
  };
  return lock(false) + lock(true);
}

function braids(hair, line) {
  const braid = (x0, x1) => {
    let out = '';
    for (let i = 0; i < 7; i++) {
      const t = i / 6;
      const x = x0 + (x1 - x0) * t, y = 126 + 60 * t;
      out += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${7.5 - t * 1.5}" ry="6" fill="${hair}" stroke="${line}" stroke-width="1.2"/>`;
    }
    return out + `<circle cx="${x1}" cy="190" r="3.4" fill="#d8384a"/><path d="M${x1 - 3},193 L${x1},200 L${x1 + 3},193 Z" fill="${hair}"/>`;
  };
  return braid(63, 56) + braid(137, 144);
}

function bangs(a, hair, line) {
  if (a.style === 'puntas') {
    return `<path d="M58,98 L50,70 L60,64 L55,44 L74,46 L78,26 L94,38 L104,18 L114,38 L130,28 L130,48 L148,46 L140,66 L150,74 L142,98
      L136,80 L130,92 L122,70 L112,88 L102,66 L92,88 L84,70 L76,90 L68,76 Z" fill="${hair}" stroke="${line}" stroke-width="1.3" stroke-linejoin="round"/>`;
  }
  return `<path d="M58,96 C52,44 78,34 100,34 C122,34 148,44 142,96
      Q138,80 130,74 Q131,84 124,90 Q120,78 112,70 Q112,82 104,88 Q102,76 96,68 Q92,80 84,88
      Q84,78 78,72 Q72,82 66,88 Q63,86 58,96 Z" fill="${hair}" stroke="${line}" stroke-width="1.3" stroke-linejoin="round"/>`;
}

function outfit(a) {
  const oc = a.ocolor, d = mix(oc, -0.35), l = mix(oc, 0.25);
  const body = (fill) => `<path d="M28,200 C32,172 58,160 86,157 L114,157 C142,160 168,172 172,200 Z" fill="${fill}" stroke="${mix(fill, -0.35)}" stroke-width="1.3"/>`;
  switch (a.outfit) {
    case 'manto':
      return `<path d="M80,158 L100,192 L120,158 Z" fill="#f4efe2"/>
        <path d="M28,200 C30,172 56,158 84,155 L100,190 L96,200 Z" fill="${oc}" stroke="${d}" stroke-width="1.3"/>
        <path d="M172,200 C170,172 144,158 116,155 L100,190 L104,200 Z" fill="${oc}" stroke="${d}" stroke-width="1.3"/>
        <path d="M80,148 Q72,160 84,166 L92,159 Z" fill="${l}" stroke="${d}"/><path d="M120,148 Q128,160 116,166 L108,159 Z" fill="${l}" stroke="${d}"/>
        <circle cx="100" cy="186" r="5" fill="#ecc461" stroke="#94701e" stroke-width="1.2"/>`;
    case 'vestido':
      return `<path d="M40,200 C44,178 66,164 86,160 L114,160 C134,164 156,178 160,200 Z" fill="${oc}" stroke="${d}" stroke-width="1.3"/>
        <ellipse cx="46" cy="188" rx="20" ry="16" fill="#f8f3e8" stroke="#cfc4ab"/><ellipse cx="154" cy="188" rx="20" ry="16" fill="#f8f3e8" stroke="#cfc4ab"/>
        <path d="M80,157 Q86,167 92,160 Q96,169 100,162 Q104,169 108,160 Q114,167 120,157 L114,155 L86,155 Z" fill="#fff" stroke="#cfc4ab"/>
        <path d="M100,176 L92,172 L93,181 Z M100,176 L108,172 L107,181 Z" fill="#d8384a"/>`;
    case 'armadura':
      return `<defs><linearGradient id="steel${avatarSeq}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef2f6"/><stop offset=".5" stop-color="#9aa4b2"/><stop offset="1" stop-color="#5c6573"/></linearGradient></defs>
        <path d="M22,200 C24,170 50,156 80,154 L120,154 C150,156 176,170 178,200 Z" fill="${oc}" stroke="${d}"/>
        ${body('#3a3f4a')}
        <path d="M70,170 Q100,160 130,170 L126,200 L74,200 Z" fill="url(#steel${avatarSeq})" stroke="#5a6170"/>
        <path d="M100,166 V200" stroke="#d8b050" stroke-width="2"/>
        <ellipse cx="50" cy="178" rx="26" ry="15" transform="rotate(-18 50 178)" fill="url(#steel${avatarSeq})" stroke="#5a6170"/>
        <ellipse cx="150" cy="178" rx="26" ry="15" transform="rotate(18 150 178)" fill="url(#steel${avatarSeq})" stroke="#5a6170"/>
        <path d="M84,156 Q100,166 116,156 L116,162 Q100,172 84,162 Z" fill="url(#steel${avatarSeq})" stroke="#5a6170"/>`;
    default:
      return `${body(oc)}
        <path d="M84,157 L100,182 L116,157 L111,155 L100,171 L89,155 Z" fill="#f8f3e8" stroke="#cfc4ab"/>
        ${a.sex === 'm'
          ? '<path d="M97,170 L103,170 L105,190 L100,196 L95,190 Z" fill="#8a2a34" stroke="#5a1520" stroke-width=".8"/>'
          : `<path d="M100,177 L88,171 L90,185 Z M100,177 L112,171 L110,185 Z" fill="#d8384a" stroke="#9a2030" stroke-width=".8"/>
        <circle cx="100" cy="177" r="3" fill="#b82a3a"/>`}`;
  }
}

/* ---------- Rasgos de raza ---------- */
function raceEars(race, skin, skinLine, hair) {
  const pair = (left, inner) => {
    const mirror = (d) => d.replace(/(-?\d+(?:\.\d+)?),/g, (_, x) => `${200 - Number(x)},`);
    return `<path d="${left}" fill="${skin}" stroke="${skinLine}" stroke-width="1.2"/>${inner ? `<path d="${inner}" fill="none" stroke="${skinLine}" stroke-width="1"/>` : ''}
      <path d="${mirror(left)}" fill="${skin}" stroke="${skinLine}" stroke-width="1.2"/>${inner ? `<path d="${mirror(inner)}" fill="none" stroke="${skinLine}" stroke-width="1"/>` : ''}`;
  };
  switch (race) {
    case 'elfo': return pair('M64,98 Q44,86 28,74 Q42,102 62,118 Z', 'M60,100 Q46,92 38,86 Q48,102 60,110');
    case 'medioelfo':
    case 'demonio': return pair('M64,100 Q52,93 42,86 Q50,104 62,114 Z', 'M60,101 Q52,96 47,92 Q53,103 60,109');
    case 'mediano': return pair('M64,100 Q56,95 52,90 Q55,106 62,113 Z');
    case 'marina': {
      const fin = '#5fbfb8';
      return `<g fill="${fin}" stroke="${mix(fin, -0.35)}" stroke-width="1.1">
        <path d="M64,94 L40,82 L46,94 L34,100 L46,106 L38,116 L62,116 Z"/>
        <path d="M136,94 L160,82 L154,94 L166,100 L154,106 L162,116 L138,116 Z"/></g>
        <path d="M60,96 L46,92 M60,104 L42,101 M60,111 L46,112 M140,96 L154,92 M140,104 L158,101 M140,111 L154,112" stroke="${mix(fin, -0.35)}" stroke-width=".9"/>`;
    }
    case 'bestia': return ''; // las orejas van sobre la cabeza
    case 'enano': return pair('M63,98 Q55,98 55,106 Q55,116 63,116 Z');
    default: return pair('M63,99 Q57,99 57,106 Q57,114 63,114 Z');
  }
}

function raceTop(a, hair, line) {
  const fur = hair, inner = mix(hair, 0.45);
  const mirror = (d) => d.replace(/(-?\d+(?:\.\d+)?),/g, (_, x) => `${200 - Number(x)},`);
  const twin = (outer, inn, rot) => `<path d="${outer}" fill="${fur}" stroke="${line}" stroke-width="1.3" stroke-linejoin="round"/>
    <path d="${inn}" fill="${inner}"/>
    <path d="${mirror(outer)}" fill="${fur}" stroke="${line}" stroke-width="1.3" stroke-linejoin="round"/>
    <path d="${mirror(inn)}" fill="${inner}"/>`;
  switch (a.race) {
    case 'bestia':
      if (a.beast === 'gato') return twin('M62,58 L64,20 L90,42 Z', 'M66,52 L67,30 L83,43 Z');
      if (a.beast === 'conejo') return twin('M72,48 C58,20 64,-4 76,-6 C88,-4 90,22 86,44 Z', 'M76,42 C68,22 70,4 76,2 C82,4 84,22 82,40 Z');
      return twin('M60,60 L56,22 L88,42 Z', 'M64,53 L62,32 L81,43 Z');
    case 'superd':
      return `<circle cx="98" cy="79" r="7" fill="#ff4050" opacity=".25"/>
        <path d="M98,71 L103.5,79 L98,87 L92.5,79 Z" fill="#e0283a" stroke="#7a1020" stroke-width="1.2"/>
        <path d="M96.5,75 L98,73 L99.5,76 Z" fill="#fff" opacity=".85"/>`;
    case 'demonio':
      return `<defs><linearGradient id="horn${avatarSeq}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#3b2a36"/><stop offset="1" stop-color="#8a6a80"/></linearGradient></defs>
        <path d="M72,54 C58,44 54,26 62,10 C64,26 72,38 86,46 Z" fill="url(#horn${avatarSeq})" stroke="#24161f" stroke-width="1.2"/>
        <path d="M128,54 C142,44 146,26 138,10 C136,26 128,38 114,46 Z" fill="url(#horn${avatarSeq})" stroke="#24161f" stroke-width="1.2"/>`;
    case 'dragon':
      return `<path d="M68,62 C54,58 44,46 40,32 C52,42 64,46 78,52 Z" fill="#efe3c6" stroke="#9a8a62" stroke-width="1.2"/>
        <path d="M132,62 C146,58 156,46 160,32 C148,42 136,46 122,52 Z" fill="#efe3c6" stroke="#9a8a62" stroke-width="1.2"/>`;
    default: return '';
  }
}

function raceFace(a, skin) {
  const sc = (color, pts) => pts.map(([x, y]) => `<path d="M${x - 3},${y} Q${x},${y - 3.5} ${x + 3},${y}" stroke="${color}" stroke-width="1.1" fill="none" opacity=".75"/>`).join('');
  switch (a.race) {
    case 'marina': return sc('#3f9f99', [[69, 118], [73, 123], [131, 118], [127, 123]]);
    case 'dragon': return sc(mix(skin, -0.35), [[67, 96], [70, 101], [133, 96], [130, 101]]);
    case 'mediano': return [[72, 121], [76, 124], [79, 120], [128, 121], [124, 124], [121, 120]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1" fill="#b0704a" opacity=".6"/>`).join('');
    default: return '';
  }
}

function wings() {
  const left = 'M74,162 C34,162 6,124 8,76 C18,96 28,104 42,110 C26,114 20,126 20,132 C32,130 42,132 52,136 C40,142 38,150 38,156 C50,152 62,154 74,162 Z';
  const right = left.replace(/(-?\d+(?:\.\d+)?),/g, (_, x) => `${200 - Number(x)},`);
  return `<g fill="#fbf8f0" stroke="#c9c3b2" stroke-width="1.3">
    <path d="${left}"/><path d="${right}"/></g>
    <path d="M20,96 Q34,110 52,118 M24,124 Q40,128 58,134 M180,96 Q166,110 148,118 M176,124 Q160,128 142,134" stroke="#d8d2c2" stroke-width="1" fill="none"/>`;
}

function beard(hair, line) {
  return `<path d="M64,116 C64,150 84,178 100,182 C116,178 136,150 136,116 C128,134 116,142 100,142 C84,142 72,134 64,116 Z" fill="${hair}" stroke="${line}" stroke-width="1.3"/>
    <path d="M84,131 Q100,123 116,131 Q107,136 100,132 Q93,136 84,131 Z" fill="${mix(hair, -0.1)}" stroke="${line}" stroke-width="1"/>
    <path d="M92,156 Q100,166 108,156" stroke="${line}" stroke-width="1" fill="none" opacity=".6"/>`;
}

function accessory(a) {
  switch (a.acc) {
    case 'sombrero':
      return `<ellipse cx="100" cy="60" rx="80" ry="15" fill="#2c3262" stroke="#171a38" stroke-width="1.3"/>
        <path d="M64,58 Q82,24 108,6 Q124,-3 140,8 Q121,10 121,27 Q123,44 136,58 Z" fill="#2c3262" stroke="#171a38" stroke-width="1.3"/>
        <path d="M65,50 Q100,61 135,50 L136,57 Q100,68 64,57 Z" fill="#efe2bd" stroke="#b7a679" stroke-width="1"/>`;
    case 'lentes':
      return `<g fill="rgba(255,255,255,.14)" stroke="#7a5230" stroke-width="2">
        <circle cx="83" cy="109" r="12.5"/><circle cx="117" cy="109" r="12.5"/></g>
        <path d="M95.5,107 Q100,104 104.5,107 M70.5,106 L62,102 M129.5,106 L138,102" stroke="#7a5230" stroke-width="2" fill="none"/>`;
    case 'lazo':
      return `<path d="M136,56 L120,44 L123,66 Z M136,56 L152,46 L151,68 Z" fill="#d8384a" stroke="#9a2030" stroke-width="1"/>
        <circle cx="136" cy="56" r="4.2" fill="#b82a3a"/>`;
    case 'diadema':
      return `<path d="M62,76 Q100,48 138,76" stroke="#ecc461" stroke-width="3.2" fill="none"/>
        <path d="M100,51 L107,60 L100,69 L93,60 Z" fill="#3a8fe0" stroke="#ecc461" stroke-width="1.6"/><circle cx="98" cy="58" r="1.4" fill="#fff"/>`;
    case 'flores': {
      const cols = ['#f4a3c4', '#ffffff', '#f6d860', '#c4a6f2'];
      let out = '';
      for (let i = 0; i < 7; i++) {
        const t = i / 6, x = (1 - t) ** 2 * 60 + 2 * (1 - t) * t * 100 + t * t * 140, y = (1 - t) ** 2 * 76 + 2 * (1 - t) * t * 40 + t * t * 76;
        out += `<ellipse cx="${(x + 4).toFixed(1)}" cy="${(y + 3).toFixed(1)}" rx="4" ry="2" fill="#5fae4a"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="${cols[i % 4]}" stroke="rgba(0,0,0,.15)"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.8" fill="#f2b43c"/>`;
      }
      return out;
    }
    case 'corona':
      return `<path d="M72,54 L76,26 L89,40 L100,18 L111,40 L124,26 L128,54 Z" fill="#f0c850" stroke="#9a7418" stroke-width="1.4" stroke-linejoin="round"/>
        <rect x="72" y="48" width="56" height="7" rx="2" fill="#e2b33c" stroke="#9a7418"/>
        <circle cx="100" cy="51.5" r="3" fill="#d23a4a"/><circle cx="84" cy="51.5" r="2.2" fill="#3a8fe0"/><circle cx="116" cy="51.5" r="2.2" fill="#3a8fe0"/>`;
    default: return '';
  }
}

/* ---------- Retrato completo ---------- */
function normalizeAvatar(av) {
  const a = { ...DEFAULT_AVATAR, ...av };
  // Retratos antiguos usaban "elf: true" en lugar de una raza.
  if (av && av.elf && !av.race) a.race = 'elfo';
  if (!RACES[a.race]) a.race = 'humano';
  return a;
}

function avatarSvg(av) {
  const a = normalizeAvatar(av);
  const u = 'av' + (++avatarSeq);
  if (a.mode === 'emblem') {
    const e = EMBLEMS[a.emblem] || EMBLEMS.espadas;
    return `<svg viewBox="0 0 200 200" class="avatar-svg" aria-hidden="true">${sceneSvg(u)}
      <circle cx="100" cy="100" r="64" fill="rgba(40,22,12,.55)" stroke="#e8c070" stroke-width="3"/>
      <circle cx="100" cy="100" r="56" fill="none" stroke="#e8c070" stroke-width="1" opacity=".6"/>
      <text x="100" y="102" text-anchor="middle" dominant-baseline="central" font-size="70">${e.icon}</text></svg>`;
  }
  const bt = bodyType(a);
  const hair = HAIR_COLORS[a.hair]?.c || '#4aa8e0';
  const line = mix(hair, -0.45);
  const skin = SKINS[a.skin] || SKINS[0];
  const skinLine = mix(skin, -0.28);
  const eye = EYE_COLORS[a.eyes]?.c || '#4fb648';
  const neckW = bt.male || bt.stout ? 12 : 10;
  const torso = bt.torso === 1 ? '' : `transform="translate(100 0) scale(${bt.torso} 1) translate(-100 0)"`;
  const hasBeard = bt.male && a.beard;

  return `<svg viewBox="0 0 200 200" class="avatar-svg" aria-hidden="true">
    ${sceneSvg(u)}
    <defs><linearGradient id="${u}iris" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${mix(eye, -0.5)}"/><stop offset=".55" stop-color="${eye}"/><stop offset="1" stop-color="${mix(eye, 0.5)}"/>
    </linearGradient></defs>
    ${a.race === 'celestial' ? wings() : ''}
    ${backHair(a, hair, line)}
    <g ${torso}>${outfit(a)}</g>
    <path d="M${100 - neckW},134 L${100 - neckW},160 Q100,166 ${100 + neckW},160 L${100 + neckW},134 Z" fill="${skin}"/>
    <path d="M${100 - neckW},140 Q100,154 ${100 + neckW},140 L${100 + neckW},147 Q100,158 ${100 - neckW},147 Z" fill="${mix(skin, -0.14)}"/>
    ${raceEars(a.race, skin, skinLine, hair)}
    <path d="${facePath(bt)}" fill="${skin}" stroke="${skinLine}" stroke-width="1.2"/>
    <ellipse cx="100" cy="88" rx="36" ry="7" fill="${mix(skin, -0.12)}" opacity=".7"/>
    <ellipse cx="75" cy="124" rx="7" ry="3.4" fill="#ff8a8a" opacity="${bt.male ? 0.16 : 0.35}"/><ellipse cx="125" cy="124" rx="7" ry="3.4" fill="#ff8a8a" opacity="${bt.male ? 0.16 : 0.35}"/>
    ${raceFace(a, skin)}
    <path d="M100.5,120 L99.5,124.5" stroke="${skinLine}" stroke-width="1.3" stroke-linecap="round"/>
    ${eyes(u, a, eye, bt)}
    ${hasBeard ? beard(hair, line) : ''}
    ${mouth(a)}
    ${hasBeard ? `<path d="M84,131 Q100,123 116,131 Q107,136 100,132 Q93,136 84,131 Z" fill="${mix(hair, -0.1)}" stroke="${line}" stroke-width="1"/>` : ''}
    ${a.style === 'trenzas' ? braids(hair, line) : ''}
    ${sideLocks(a, hair, line)}
    ${bangs(a, hair, line)}
    ${brows(a, line, bt)}
    ${a.style === 'puntas' ? '' : `<path d="M70,56 Q100,42 130,56" stroke="${mix(hair, 0.5)}" stroke-width="3.5" fill="none" opacity=".55" stroke-linecap="round"/>`}
    ${a.ahoge ? `<path d="M100,36 C95,20 104,12 114,8 C105,17 103,25 107,36 Z" fill="${hair}" stroke="${line}" stroke-width="1.2"/>` : ''}
    ${raceTop(a, hair, line)}
    ${accessory(a)}
  </svg>`;
}

function randomAvatar(owned = []) {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const free = (obj) => Object.keys(obj).filter((k) => !obj[k].cost || owned.includes(k));
  const sex = pick(Object.keys(SEXES));
  return {
    ...DEFAULT_AVATAR,
    sex,
    race: pick(Object.keys(RACES)),
    beast: pick(Object.keys(BEASTS)),
    style: pick(Object.keys(HAIR_STYLES)),
    hair: pick(Object.keys(HAIR_COLORS)),
    eyes: pick(Object.keys(EYE_COLORS)),
    skin: Math.floor(Math.random() * 4),
    expr: pick(Object.keys(EXPRESSIONS)),
    outfit: pick(free(OUTFITS)),
    ocolor: pick(OUTFIT_COLORS),
    acc: pick(free(ACCESSORIES)),
    ahoge: Math.random() < 0.3,
    beard: sex === 'm' && Math.random() < 0.25,
  };
}
