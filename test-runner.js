/* ==========================================================================
   Nazrani Heritage — smoke test runner
   ==========================================================================
   Quick-and-dirty Node-based regression test for the data service. Runs the
   real assets/data-service.js under a tiny browser shim (localStorage + fetch).

   Usage:
     node test-runner.js

   Useful before any change to assets/data-service.js, or as a baseline against
   the real backend once endpoints are swapped in.
   ========================================================================== */
const fs = require('fs');
const path = require('path');

// ------- Browser shim ------------------------------------------------------
const _store = {};
global.localStorage = {
  getItem: (k) => k in _store ? _store[k] : null,
  setItem: (k, v) => { _store[k] = String(v); },
  removeItem: (k) => { delete _store[k]; },
  clear: () => { for (const k of Object.keys(_store)) delete _store[k]; }
};
global.window = global;
global.document = { dispatchEvent: () => {} };
global.CustomEvent = class { constructor(name, opts){ this.name = name; this.detail = (opts || {}).detail; } };
global.dispatchEvent = () => {};
global.addEventListener = () => {};

global.fetch = async (url) => {
  const cleaned = url.replace(/^\.\//, '');
  const filePath = path.join(__dirname, cleaned);
  if (!fs.existsSync(filePath)) return { ok: false, status: 404 };
  const text = fs.readFileSync(filePath, 'utf8');
  return { ok: true, status: 200, json: async () => JSON.parse(text), text: async () => text };
};

// ------- Tests -------------------------------------------------------------
let passed = 0, failed = 0;
function check(label, ok, extra) {
  if (ok) { passed++; console.log('  PASS', label, extra ? '(' + extra + ')' : ''); }
  else    { failed++; console.log('  FAIL', label, extra ? '(' + extra + ')' : ''); }
}

(async () => {
  require('./assets/data.js');         // single source of truth — must load first
  require('./assets/data-service.js'); // façade that reads from window.DATA

  console.log('\n--- Catalogue ---');
  const products = await DataService.getProducts({});
  check('getProducts() returns 14', products.length === 14, products.length);
  const spices = await DataService.getProducts({ category: 'Spices' });
  check('filter category=Spices', spices.length === 6, spices.length);
  const cardamom = await DataService.getProducts({ search: 'cardamom' });
  check('search "cardamom"', cardamom.length === 1 && cardamom[0].id === 'p02');
  const cheap = await DataService.getProducts({ sort: 'price-asc' });
  check('sort price-asc', cheap[0].price === 220, cheap[0].price);
  const p = await DataService.getProduct('p04');
  check('getProduct(p04)', p && p.name === 'Gandhakasala Rice');
  const rel = await DataService.getRelated('p01', 4);
  check('getRelated(p01)', rel.length === 4, rel.length);

  console.log('\n--- Cart ---');
  DataService.addToCart('p01', 2);   // 250g × 2 = 500g
  DataService.addToCart('p04', 1);   // 1000g
  check('cart count after 2x p01 + 1x p04', DataService.getCartCount() === 3);
  const cart = await DataService.getHydratedCart();
  check('subtotal = 480*2 + 420',         cart.subtotal === 1380, cart.subtotal);
  check('totalGrams = 500 + 1000',        cart.totalGrams === 1500, cart.totalGrams);
  check('shipping = 129 (1-2kg, TN zone)', cart.shipping === 129, cart.shipping);

  // Zone multiplier check — Bangalore PIN 560001 → south zone, 1.2× → 129 × 1.2 = 155
  const cartBlr = await DataService.getHydratedCart('560001');
  check('shipping = 155 (1-2kg, south zone)', cartBlr.shipping === 155, cartBlr.shipping);
  // J&K PIN 190001 → ne_jk zone, 1.8× → 129 × 1.8 = 232
  const cartJk = await DataService.getHydratedCart('190001');
  check('shipping = 232 (1-2kg, NE/J&K zone)', cartJk.shipping === 232, cartJk.shipping);

  DataService.addToCart('p05', 1);   // pushes subtotal to 1760 (≥ 1499)
  const cart2 = await DataService.getHydratedCart();
  check('shipping = 0 (over 1499)', cart2.shipping === 0);

  console.log('\n--- Orders ---');
  const order = await DataService.placeOrder({
    customer: { name: 'Rony', email: 'r@x.in', phone: '9999999999' },
    address: { line1: 'a', city: 'Chennai', state: 'TN', pincode: '600040', country: 'India' },
    payment: { method: 'upi' }
  });
  check('orderId starts NZR-', /^NZR-/.test(order.orderId), order.orderId);
  check('order persisted', DataService.getOrder(order.orderId) !== null);
  check('cart cleared on order', DataService.getCartCount() === 0);

  console.log('\n--- Content ---');
  const art = await DataService.getArticle('morning-at-vanamoolika');
  check('article fetch', art && art.body && art.body.length >= 5);
  const none = await DataService.getArticle('does-not-exist');
  check('missing article returns null', none === null);
  const prov = await DataService.getProvenance();
  check('provenance returns 6', prov.length === 6);
  const std = await DataService.getStandard();
  check('standard returns 5', std.length === 5);

  console.log('\n--- Forms ---');
  const sub = await DataService.subscribeNewsletter('test@x.in');
  check('newsletter ok', sub.ok === true);
  const ct  = await DataService.sendContact({ name: 'a', email: 'a@b.c', subject: 's', message: 'm' });
  check('contact returns ticket', /^NZR-CX-/.test(ct.ticketId), ct.ticketId);

  console.log('\n--- Result ---');
  console.log('  ' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed > 0 ? 1 : 0);
})().catch((e) => { console.error('Runner crashed:', e); process.exit(2); });
