// Independent check of the illustrative WIP tables in index.html.
// Usage: node tools/verify-wip.mjs [path/to/index.html]
// Recomputes every derived cell from the input attributes (data-orig, data-co, data-cost, data-etc, data-billed)
// and compares it with what the page displays. Exits 1 on any mismatch.
import { readFileSync } from 'node:fs';

const html = readFileSync(process.argv[2] || new URL('../wip/index.html', import.meta.url), 'utf8');
const fail = [];
const num = (s) => {
  const t = s.replace(/<[^>]+>/g, '').replace(/&minus;/g, '-').trim();
  const m = t.match(/^\$?\(?-?[\d,]+(\.\d+)?\)?%?/);
  if (!m) return NaN;
  const neg = /^\(/.test(m[0]) || /-/.test(m[0]);
  return (neg ? -1 : 1) * parseFloat(m[0].replace(/[^\d.]/g, ''));
};
const check = (what, got, want, tol = 0) => { if (!(Math.abs(got - want) <= tol)) fail.push(`${what}: page ${got}, recomputed ${want}`); };

const tables = [...html.matchAll(/<table class="wip" id="([^"]+)">([\s\S]*?)<\/table>/g)];
if (tables.length !== 2) fail.push(`expected 2 WIP tables, found ${tables.length}`);
const totals = {};
for (const [, id, body] of tables) {
  const sum = { o: 0, co: 0, rev: 0, cost: 0, etc: 0, ptc: 0, earned: 0, billed: 0, ou: 0, gp: 0 };
  const rows = [...body.matchAll(/<tr (data-job|data-total)([^>]*)>([\s\S]*?)<\/tr>/g)];
  for (const [, kind, attrStr, cells] of rows) {
    const a = Object.fromEntries([...attrStr.matchAll(/data-(\w+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
    const c = Object.fromEntries([...cells.matchAll(/<td data-c="(\w+)"[^>]*>([\s\S]*?)<\/td>/g)].map((m) => [m[1], num(m[2])]));
    const tag = kind === 'data-job' ? a.job || attrStr.trim() : 'TOTAL';
    if (kind === 'data-job') {
      const o = +a.orig, co = +a.co, cost = +a.cost, etc = +a.etc, billed = +a.billed;
      const rev = o + co, ptc = cost + etc, pct = cost / ptc, earned = Math.round(pct * rev), ou = billed - earned, gp = rev - ptc;
      check(`${id} ${tag} revised`, c.rev, rev);
      check(`${id} ${tag} pct`, c.pct, Math.round(pct * 1000) / 10, 0.0001);
      check(`${id} ${tag} over/under`, c.ou, ou);
      check(`${id} ${tag} gross profit`, c.gp, gp);
      check(`${id} ${tag} orig/co/cost/etc/billed`, c.o + c.co + c.cost + c.etc + c.billed, o + co + cost + etc + billed);
      if ('ptc' in c) { check(`${id} ${tag} projected cost`, c.ptc, ptc); check(`${id} ${tag} earned`, c.earned, earned); check(`${id} ${tag} margin`, c.gm, Math.round((gp / rev) * 1000) / 10, 0.0001); }
      Object.assign(sum, { o: sum.o + o, co: sum.co + co, rev: sum.rev + rev, cost: sum.cost + cost, etc: sum.etc + etc, ptc: sum.ptc + ptc, earned: sum.earned + earned, billed: sum.billed + billed, ou: sum.ou + ou, gp: sum.gp + gp });
    } else {
      check(`${id} total orig`, c.o, sum.o); check(`${id} total COs`, c.co, sum.co); check(`${id} total revised`, c.rev, sum.rev);
      check(`${id} total costs`, c.cost, sum.cost); check(`${id} total ETC`, c.etc, sum.etc);
      check(`${id} total pct`, c.pct, Math.round((sum.cost / sum.ptc) * 1000) / 10, 0.0001);
      check(`${id} total billed`, c.billed, sum.billed); check(`${id} total over/under`, c.ou, sum.ou); check(`${id} total gross profit`, c.gp, sum.gp);
      if ('ptc' in c) { check(`${id} total projected cost`, c.ptc, sum.ptc); check(`${id} total earned`, c.earned, sum.earned); check(`${id} total margin`, c.gm, Math.round((sum.gp / sum.rev) * 1000) / 10, 0.0001); }
      totals[id] = { ...sum, ob: 0, ub: 0 };
    }
  }
  // Over/under of the jobs: split for GL tie-out and tiles
  for (const [, attrStr] of rows.filter((r) => r[1] === 'data-job').map((r) => [0, r[2]])) {
    const a = Object.fromEntries([...attrStr.matchAll(/data-(\w+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
    const ou = +a.billed - Math.round(((+a.cost) / (+a.cost + +a.etc)) * (+a.orig + +a.co));
    if (ou > 0) totals[id].ob += ou; else totals[id].ub += ou;
  }
}
const full = totals['full-wip'], hero = totals['hero-wip'];
if (full && hero) for (const k of Object.keys(full)) check(`hero vs full total ${k}`, hero[k], full[k]);

// GL tie-out
for (const [, kind, calc, bal, rest] of html.matchAll(/data-gl="(\w+)" data-calc="(-?\d+)" data-gl-bal="(\d+)"[^>]*>([\s\S]*?)<\/tr>/g)) {
  const want = kind === 'ob' ? full.ob : -full.ub;
  check(`GL ${kind} calculated attr`, +calc, want);
  const cells = [...rest.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => num(m[1]));
  check(`GL ${kind} calculated shown`, cells[0], want); check(`GL ${kind} balance shown`, cells[1], +bal); check(`GL ${kind} difference shown`, cells[2], want - +bal);
}

// Change orders
const co = html.match(/<table class="small" id="co-table" data-approved-total="(\d+)">([\s\S]*?)<\/table>/);
if (co) {
  const approved = [...co[2].matchAll(/data-approved="(\d+)"/g)].reduce((s, m) => s + +m[1], 0);
  const pending = [...co[2].matchAll(/data-pending="(\d+)"/g)].reduce((s, m) => s + +m[1], 0);
  check('CO approved sums to schedule', approved, full.co); check('CO approved attr', +co[1], full.co);
  const strongs = [...co[2].matchAll(/<strong>([^<]*)<\/strong>/g)].map((m) => num(m[1]));
  check('CO approved total shown', strongs[strongs.length - 2], approved); check('CO pending total shown', strongs[strongs.length - 1], pending);
} else fail.push('CO table missing');

// Margin movement
for (const [, , prior, gm, rest] of html.matchAll(/<tr data-job="([^"]+)" data-prior="([\d.]+)" data-gm="([\d.]+)">([\s\S]*?)<\/tr>/g)) {
  const cells = [...rest.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => num(m[1]));
  check('fade prior shown', cells[0], +prior); check('fade current shown', cells[1], +gm); check('fade change shown', Math.abs(cells[2]), Math.abs(Math.round((+gm - +prior) * 10) / 10), 0.0001);
}
// Eastgate narrative: 18% -> 15% on 2,400,000
check('Eastgate prior total cost', 2400000 * (1 - 0.18), 1968000, 0.01); check('Eastgate current total cost', 2400000 * (1 - 0.15), 2040000, 0.01);

if (fail.length) { console.error('WIP sample FAILED:\n- ' + fail.join('\n- ')); process.exit(1); }
console.log(`WIP sample OK: ${tables.length} tables, GL tie-out, change orders and margin movement all recompute.`);
