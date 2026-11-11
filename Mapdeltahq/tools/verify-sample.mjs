// Checks that the illustrative Friday report on index.html is internally consistent.
// Usage: node tools/verify-sample.mjs [path/to/index.html]
import { readFileSync } from 'node:fs';
const html = readFileSync(process.argv[2] || new URL('../index.html', import.meta.url), 'utf8');
const fail = [];
const eq = (what, got, want) => { if (got !== want) fail.push(`${what}: page ${got}, recomputed ${want}`); };
const nums = (re) => [...html.matchAll(re)].map((m) => +m[1]);
const money = (s) => +s.replace(/[^\d]/g, '');

const stats = nums(/<dd data-v="(\d+)">/g);               // delivered, invoiced, missing POD, AR>45, carrier pay
const [delivered, invoiced, missing, over45, pay] = stats;
eq('stat count', stats.length, 5);
eq('delivered - invoiced = missing POD', delivered - invoiced, missing);

const ar = nums(/data-ar="(\d+)"/g);
eq('AR bucket count', ar.length, 4);
eq('AR total', ar.reduce((a, b) => a + b, 0), +html.match(/data-ar-total="(\d+)"/)[1]);
const over = [...html.matchAll(/data-ar="(\d+)" data-over45/g)].map((m) => +m[1]).reduce((a, b) => a + b, 0);
eq('AR over 45 days (46-60 + 60+) matches summary', over, over45);

const pods = nums(/data-pod="(\d+)"/g);
eq('missing PODs by carrier sum to summary', pods.reduce((a, b) => a + b, 0), missing);
eq('missing POD total shown', +html.match(/data-pod-total="(\d+)"/)[1], missing);

const pays = nums(/data-pay="(\d+)"/g);
eq('carrier pay by day sums to summary', pays.reduce((a, b) => a + b, 0), pay);
eq('carrier pay total shown', +html.match(/data-pay-total="(\d+)"/)[1], pay);

// Displayed text must match the data attributes
for (const [, v, text] of html.matchAll(/data-(?:ar|pay|ar-total|pay-total)="(\d+)"[^>]*>([^<]*)</g)) eq(`displayed ${text}`, money(text), +v);
for (const [, v, text] of html.matchAll(/<dd data-v="(\d+)">([^<]*)</g)) eq(`displayed stat ${text}`, money(text), +v);

// Pricing arithmetic quoted on the page
eq('Desk 150 per load', 1200 / 150, 8); eq('Desk 400 per load', 2400 / 400, 6); eq('Pilot per load (about)', Math.round(400 / 75), 5);

if (fail.length) { console.error('Friday sample FAILED:\n- ' + fail.join('\n- ')); process.exit(1); }
console.log('Friday sample OK: summary, AR aging, missing PODs and carrier pay all reconcile.');
