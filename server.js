const http = require('http');
const { WebSocketServer } = require('ws');

const RK = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const CATN = ['High card','Pair','Color','Sequence','Pure sequence','Trail'];
function deck() {
  const d = [];
  for (let s = 0; s < 4; s++) for (let r = 0; r < 13; r++) d.push({ r, s });
  for (let i = 51; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; }
  return d;
}
function score(h) {
  const v = h.map(c => c.r + 2).sort((a, b) => b - a);
  const flush = h.every(c => c.s === h[0].s);
  const a23 = v[0] === 14 && v[1] === 3 && v[2] === 2;
  const seq = a23 || (v[0] - v[1] === 1 && v[1] - v[2] === 1);
  const trail = v[0] === v[2];
  const pair = !trail && (v[0] === v[1] || v[1] === v[2]);
  let cat, t;
  if (trail) { cat = 5; t = [v[0]]; }
  else if (seq && flush) { cat = 4; t = [a23 ? 13.5 : v[0]]; }
  else if (seq) { cat = 3; t = [a23 ? 13.5 : v[0]]; }
  else if (flush) { cat = 2; t = v; }
  else if (pair) { cat = 1; const p = v[0] === v[1] ? v[0] : v[2]; t = [p, v.find(x => x !== p)]; }
  else { cat = 0; t = v; }
  return cat * 1e6 + t[0] * 1e4 + (t[1] || 0) * 100 + (
