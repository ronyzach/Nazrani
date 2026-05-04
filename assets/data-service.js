/* ==========================================================================
   Nazrani Heritage — Data Service Layer
   ==========================================================================
   This is the SINGLE point of swap when moving from the prototype to a real
   backend. Every page consumes data through this façade. To productionise,
   replace each function body with a real `fetch(...)` call to your backend
   and keep the public surface (function names, signatures, return shapes)
   identical so no consumer page needs to change.

   The prototype reads from `window.DATA` (assets/data.js).
   See HANDOVER.md for the suggested REST endpoint per function and
   for full request / response schemas.
   ========================================================================== */

(function (global) {
  'use strict';

  /** @returns {object} The in-memory DATA object loaded by data.js. */
  function DB() {
    if (!global.DATA) throw new Error('Nazrani DATA not loaded — include assets/data.js before data-service.js');
    return global.DATA;
  }

  // ============================================================
  // PRODUCTS
  // ============================================================

  /**
   * List products with optional filtering / sorting.
   * @endpoint  GET /api/products?category=&search=&sort=&limit=
   * @param {{category?:string, search?:string, sort?:string, limit?:number}} [opts]
   * @returns {Promise<Array<object>>}
   */
  async function getProducts(opts) {
    opts = opts || {};
    let list = DB().products.slice();

    if (opts.category && opts.category !== 'All') {
      list = list.filter((p) => p.category === opts.category);
    }
    if (opts.search) {
      const q = opts.search.toLowerCase().trim();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (opts.sort === 'price-asc')  list.sort((a, b) => a.price - b.price);
    if (opts.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (opts.sort === 'name')       list.sort((a, b) => a.name.localeCompare(b.name));
    if (opts.limit)                 list = list.slice(0, opts.limit);
    return list;
  }

  /**
   * Fetch a single product by id.
   * @endpoint  GET /api/products/:id
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async function getProduct(id) {
    return DB().products.find((p) => p.id === id) || null;
  }

  /**
   * Related products in the same category.
   * @endpoint  GET /api/products/:id/related?limit=
   */
  async function getRelated(productId, limit) {
    const all = DB().products;
    const subject = all.find((p) => p.id === productId);
    if (!subject) return [];
    return all
      .filter((p) => p.id !== productId && p.category === subject.category)
      .slice(0, limit || 4);
  }

  // ============================================================
  // TAXONOMY & CONTENT
  // ============================================================

  /** @endpoint  GET /api/categories */
  async function getCategories() { return DB().categories.slice(); }
  /** @endpoint  GET /api/standard */
  async function getStandard()   { return DB().standard.slice(); }
  /** @endpoint  GET /api/provenance */
  async function getProvenance() { return DB().provenance.slice(); }
  /** @endpoint  GET /api/journal?limit= */
  async function getJournal(opts) {
    opts = opts || {};
    const all = DB().journal.slice();
    return opts.limit ? all.slice(0, opts.limit) : all;
  }
  /** @endpoint  GET /api/journal/:slug */
  async function getArticle(slug) {
    return DB().articles[slug] || null;
  }

  // ============================================================
  // CART  (client-only persistence; backend will bind to session/user)
  // ============================================================
  const CART_KEY = 'nazrani:cart:v1';

  function readCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return { items: [] };
      const parsed = JSON.parse(raw);
      return parsed && Array.isArray(parsed.items) ? parsed : { items: [] };
    } catch (_) { return { items: [] }; }
  }

  function writeCart(cart) {
    cart.updated = Date.now();
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    global.dispatchEvent(new CustomEvent('nazrani:cart-updated', { detail: cart }));
  }

  /** @endpoint  GET /api/cart */
  function getCart() { return readCart(); }

  function getCartCount() {
    return readCart().items.reduce((sum, it) => sum + (it.qty || 0), 0);
  }

  /** @endpoint  POST /api/cart/items  { productId, qty } */
  function addToCart(productId, qty) {
    qty = qty || 1;
    const cart = readCart();
    const existing = cart.items.find((it) => it.id === productId);
    if (existing) existing.qty += qty;
    else cart.items.push({ id: productId, qty: qty });
    writeCart(cart);
    return cart;
  }

  /** @endpoint  PATCH /api/cart/items/:id  { qty } */
  function updateCartQty(productId, qty) {
    const cart = readCart();
    const line = cart.items.find((it) => it.id === productId);
    if (!line) return cart;
    if (qty <= 0) cart.items = cart.items.filter((it) => it.id !== productId);
    else          line.qty = qty;
    writeCart(cart);
    return cart;
  }

  /** @endpoint  DELETE /api/cart/items/:id */
  function removeFromCart(productId) { return updateCartQty(productId, 0); }

  /** @endpoint  DELETE /api/cart */
  function clearCart() { writeCart({ items: [] }); }

  /**
   * Cart with per-line product info and totals.
   * @endpoint  GET /api/cart?hydrate=true
   * @returns {Promise<{items: Array, subtotal:number, shipping:number, total:number}>}
   */
  /**
   * Resolve a pincode to a configured shipping zone.
   * First-match wins on the 2-digit prefix; falls through to lastResortZoneId.
   * Empty / unknown pincode → defaultZoneId (used on the cart page before checkout).
   */
  function resolveZone(pincode) {
    const cfg = DB().config.shipping;
    const pin = String(pincode || '').replace(/\D/g, '');
    if (pin.length < 6) {
      return cfg.zones.find((z) => z.id === cfg.defaultZoneId) || cfg.zones[0];
    }
    const p2 = pin.slice(0, 2);
    const hit = cfg.zones.find((z) => (z.pincodePrefixes || []).indexOf(p2) !== -1);
    if (hit) return hit;
    return cfg.zones.find((z) => z.id === cfg.lastResortZoneId) || cfg.zones[cfg.zones.length - 1];
  }

  /**
   * Compute shipping for a given total weight (grams), subtotal, and pincode.
   * shipping = baseByWeight × zoneMultiplier, rounded; 0 if subtotal ≥ freeAbove.
   */
  function computeShipping(totalGrams, subtotal, pincode) {
    const cfg = DB().config.shipping;
    if (subtotal === 0) return { rate: 0, zone: null, slab: null };
    if (subtotal >= cfg.freeAbove) {
      return { rate: 0, zone: resolveZone(pincode), slab: null, freed: true };
    }
    const slab = cfg.weightSlabs.find((s) => totalGrams <= s.maxGrams) || cfg.weightSlabs[cfg.weightSlabs.length - 1];
    const zone = resolveZone(pincode);
    const rate = Math.round(slab.rate * zone.multiplier);
    return { rate: rate, zone: zone, slab: slab, freed: false };
  }

  /**
   * Cart with per-line product info and totals.
   * @param {string} [pincode] — optional 6-digit destination PIN. Defaults to defaultZoneId.
   * @endpoint  GET /api/cart?hydrate=true&pin=560001
   * @returns {Promise<{items: Array, subtotal:number, shipping:number, total:number, totalGrams:number, zone:object|null, slab:object|null}>}
   */
  async function getHydratedCart(pincode) {
    const cart = readCart();
    if (!cart.items.length) return { items: [], subtotal: 0, shipping: 0, total: 0, totalGrams: 0, zone: null, slab: null };
    const products = DB().products;
    const items = cart.items.map((line) => {
      const p = products.find((x) => x.id === line.id);
      return p ? {
        id: p.id, name: p.name, subtitle: p.subtitle, category: p.category,
        weight: p.weight, weightGrams: p.weightGrams || 0, origin: p.origin, image: p.image || null,
        unitPrice: p.price, qty: line.qty, lineTotal: p.price * line.qty
      } : null;
    }).filter(Boolean);

    const subtotal   = items.reduce((s, it) => s + it.lineTotal, 0);
    const totalGrams = items.reduce((s, it) => s + (it.weightGrams * it.qty), 0);
    const ship       = computeShipping(totalGrams, subtotal, pincode);
    return {
      items:      items,
      subtotal:   subtotal,
      shipping:   ship.rate,
      total:      subtotal + ship.rate,
      totalGrams: totalGrams,
      zone:       ship.zone,
      slab:       ship.slab
    };
  }

  // ============================================================
  // ORDERS
  // ============================================================
  const ORDERS_KEY = 'nazrani:orders:v1';

  /**
   * Place an order.
   * @endpoint  POST /api/orders { customer, address, payment }
   * @returns {Promise<object>} the created order with orderId
   */
  async function placeOrder(payload) {
    await new Promise((r) => setTimeout(r, 600)); // simulate latency
    const pincode = (payload && payload.address && payload.address.pincode) || '';
    const cart = await getHydratedCart(pincode);
    const cfg  = DB().config;
    const orderId = cfg.orderIdPrefix + Date.now().toString(36).toUpperCase().slice(-6);

    // India Post EMS-style airway bill: prefix EK + 9 digits + suffix IN.
    // Real AWB will be issued by IndiaShipments at booking; this is the demo placeholder.
    const awbDigits = String(Date.now()).slice(-9).padStart(9, '0');
    const airwayBillNo = 'EK' + awbDigits + 'IN';

    const order = {
      orderId: orderId,
      airwayBillNo: airwayBillNo,
      placed:  new Date().toISOString(),
      customer: payload.customer,
      address:  payload.address,
      payment:  payload.payment,
      items:    cart.items,
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      total:    cart.total,
      status:   'CONFIRMED',
      estimatedDispatch: estimateDispatch(cfg.dispatchInDays || 2)
    };
    try {
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      orders.unshift(order);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.slice(0, 20)));
    } catch (_) { /* noop */ }

    // Persist customer + address so checkout pre-fills on next visit
    try {
      const USER_KEY = 'nazrani:user:v1';
      const existing = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
      localStorage.setItem(USER_KEY, JSON.stringify(Object.assign({}, existing, {
        name:    payload.customer.name  || existing.name,
        email:   payload.customer.email || existing.email,
        phone:   payload.customer.phone || existing.phone,
        address: payload.address
      })));
    } catch (_) { /* noop */ }

    clearCart();
    return order;
  }

  /** @endpoint  GET /api/orders/:orderId */
  function getOrder(orderId) {
    try {
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      const o = orders.find((o) => o.orderId === orderId) || null;
      if (o && !o.airwayBillNo) {
        // Backfill AWB for legacy orders (placed before AWB generation existed).
        const seed = (o.orderId || '').replace(/\D/g, '').padStart(9, '0').slice(-9) || '000000001';
        o.airwayBillNo = 'EK' + seed + 'IN';
      }
      return o;
    } catch (_) { return null; }
  }

  function estimateDispatch(daysAhead) {
    const d = new Date();
    d.setDate(d.getDate() + (daysAhead || 2));
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // ============================================================
  // FORMS
  // ============================================================

  /** @endpoint  POST /api/newsletter { email } */
  async function subscribeNewsletter(email) {
    await new Promise((r) => setTimeout(r, 300));
    return { ok: true, email: email };
  }

  /** @endpoint  POST /api/contact { name, email, subject, message } */
  async function sendContact(payload) {
    await new Promise((r) => setTimeout(r, 500));
    const prefix = DB().config.contactRefPrefix || 'NZR-CX-';
    return { ok: true, ticketId: prefix + Date.now().toString(36).toUpperCase().slice(-5) };
  }

  // ============================================================
  // EXPORT
  // ============================================================
  global.DataService = {
    // Catalogue
    getProducts, getProduct, getRelated, getCategories,
    // Content
    getStandard, getProvenance, getJournal, getArticle,
    // Cart
    getCart, getCartCount, addToCart, updateCartQty, removeFromCart, clearCart, getHydratedCart,
    resolveZone, computeShipping,
    // Orders
    placeOrder, getOrder,
    // Forms
    subscribeNewsletter, sendContact
  };
})(window);
