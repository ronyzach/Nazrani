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
    if (opts.source && opts.source !== 'All') {
      list = list.filter((p) => p.sourcedFrom === opts.source);
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
    if (opts.sort === 'source')     list.sort((a, b) =>
      (a.sourcedFrom || '').localeCompare(b.sourcedFrom || '') ||
      a.name.localeCompare(b.name)
    );
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
  /**
   * Unique sourcing partners with product counts. Derived from products.
   * @endpoint  GET /api/sources
   * @returns {Promise<Array<{name:string, count:number}>>}
   */
  async function getSources() {
    const counts = {};
    DB().products.forEach((p) => {
      const s = p.sourcedFrom || 'Unknown';
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.keys(counts).sort().map((name) => ({ name: name, count: counts[name] }));
  }
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

  /** @endpoint  GET /api/orders */
  function getOrders() {
    try {
      return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    } catch (_) { return []; }
  }

  /** Overwrite localStorage orders with the curated demo set from DATA.demoOrders. */
  function seedDemoOrders() {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(DB().demoOrders || []));
    } catch (_) { /* noop */ }
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
  // REVIEWS
  // ============================================================
  const REVIEWS_KEY = 'nazrani:reviews:v1';

  /** @endpoint  GET /api/products/:id/reviews */
  function getReviews(productId) {
    const seed = (DB().seedReviews || {})[productId] || [];
    try {
      const store = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '{}');
      const local = (store[productId] || []);
      return local.concat(seed);
    } catch (_) { return seed; }
  }

  /** @endpoint  POST /api/products/:id/reviews { author, rating, body } */
  function addReview(productId, review) {
    try {
      const store = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '{}');
      if (!store[productId]) store[productId] = [];
      store[productId].unshift(Object.assign({}, review, {
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      }));
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(store));
    } catch (_) { /* noop */ }
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
  // DEMO SEEDS  (run once; only if localStorage keys are absent)
  // ============================================================
  (function seedDemoDefaults() {
    // Patch issue flags onto existing demo orders if not already present
    try {
      var stored = JSON.parse(localStorage.getItem('nazrani:orders:v1') || '[]');
      var patched = false;
      stored.forEach(function(o) {
        if (o.orderId === 'NZR-S1DEMO' && !o.issue) {
          o.issue = true; o.issueType = 'ADDRESS_ISSUE';
          o.issueNotes = 'Pincode 682001 flagged as unserviceable by courier partner. Awaiting alternate address from customer.';
          patched = true;
        }
        if (o.orderId === 'NZR-S2DEMO' && !o.issue) {
          o.issue = true; o.issueType = 'LOGISTICS_DELAY';
          o.issueNotes = 'Shipment EK491500004IN has not moved in 3 days. Escalation ticket raised with India Post.';
          patched = true;
        }
      });
      if (patched) localStorage.setItem('nazrani:orders:v1', JSON.stringify(stored));
    } catch(_) {}

    try {
      // 2 products below their re-order level
      if (!localStorage.getItem('nazrani:inventory:v1')) {
        var inv = { p01: 6, p02: 4 };   // p01=Tellicherry Pepper, p02=Green Cardamom
        localStorage.setItem('nazrani:inventory:v1', JSON.stringify(inv));
      }
      if (!localStorage.getItem('nazrani:reorder:v1')) {
        var rl = { p01: 15, p02: 12 };
        localStorage.setItem('nazrani:reorder:v1', JSON.stringify(rl));
      }
    } catch (_) {}

    try {
      // 3 demo return requests at different stages
      if (!localStorage.getItem('nazrani:returns:v1')) {
        var returns = [
          {
            returnId: 'RTN-0001', orderId: 'NZR-S3DEMO',
            customerName: 'Demo User', customerEmail: 'demo@gmail.com', customerPhone: '9884090151',
            items: [{ name: 'Chyawanprash', qty: 1, unitPrice: 890, lineTotal: 890, weight: '500g' }],
            reason: 'DAMAGED', reasonNote: 'Product arrived with broken seal. Contents partially spilled.',
            requestedOn: '2026-04-30T10:15:00.000Z',
            status: 'REFUND_COMPLETED',
            refundAmount: 890, refundMethod: 'ORIGINAL',
            resolvedOn: '2026-05-02T14:30:00.000Z', adminNotes: 'Verified damage via customer photo. Full refund approved.'
          },
          {
            returnId: 'RTN-0002', orderId: 'NZR-S4DEMO',
            customerName: 'Demo User', customerEmail: 'demo@gmail.com', customerPhone: '9884090151',
            items: [{ name: 'Wayanad Turmeric Powder', qty: 1, unitPrice: 260, lineTotal: 260, weight: '200g' }],
            reason: 'QUALITY_ISSUE', reasonNote: 'Colour and aroma not matching product description. Seems adulterated.',
            requestedOn: '2026-04-25T09:00:00.000Z',
            status: 'APPROVED',
            refundAmount: 260, refundMethod: 'ORIGINAL',
            resolvedOn: '2026-04-26T11:00:00.000Z', adminNotes: 'Return approved. Awaiting item pickup before initiating refund.'
          },
          {
            returnId: 'RTN-0003', orderId: 'NZR-S5DEMO',
            customerName: 'Demo User', customerEmail: 'demo@gmail.com', customerPhone: '9884090151',
            items: [{ name: 'Tellicherry Black Pepper', qty: 1, unitPrice: 480, lineTotal: 480, weight: '250g' }],
            reason: 'CHANGED_MIND', reasonNote: 'Ordered by mistake. Package unopened.',
            requestedOn: '2026-04-17T16:45:00.000Z',
            status: 'REQUESTED',
            refundAmount: 480, refundMethod: null,
            resolvedOn: null, adminNotes: ''
          },
        ];
        localStorage.setItem('nazrani:returns:v1', JSON.stringify(returns));
      }
    } catch(_) {}

    try {
      // Ensure at least one pending (YET TO SHIP) order exists for fulfillment demo
      var allOrders = JSON.parse(localStorage.getItem('nazrani:orders:v1') || '[]');
      var hasPending = allOrders.some(function(o) {
        return o.status === 'YET TO SHIP' || o.status === 'CONFIRMED' || !o.status;
      });
      if (!hasPending) {
        var pendingDemo = {
          orderId: 'NZR-PEND-DEMO',
          placed: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          customer: { name: 'Arun Mathew', email: 'arun.mathew@gmail.com', phone: '9847012345' },
          address: { line1: '14 MG Road', line2: 'Near Central Park', city: 'Kottayam', state: 'Kerala', pincode: '686001' },
          payment: { method: 'UPI' },
          items: [
            { id: 'p01', name: 'Tellicherry Black Pepper', qty: 2, unitPrice: 480, lineTotal: 960, weight: '250g' },
            { id: 'p12', name: 'Chyawanprash', qty: 1, unitPrice: 890, lineTotal: 890, weight: '500g' },
          ],
          subtotal: 1850, shipping: 0, total: 1850,
          status: 'YET TO SHIP',
          estimatedDispatch: '07 May 2026',
        };
        allOrders.unshift(pendingDemo);
        localStorage.setItem('nazrani:orders:v1', JSON.stringify(allOrders));
      }
    } catch(_) {}

    try {
      // 4 invoices for the 4 shipped demo orders (IN TRANSIT + 3 DELIVERED)
      if (!localStorage.getItem('nazrani:invoices:v1')) {
        var invoices = [
          { invNo: 'INV-S2DEMO-2026', orderId: 'NZR-S2DEMO', customerName: 'Demo User', total: 1800, date: '2026-05-01T14:30:00.000Z', orderStatus: 'IN TRANSIT'  },
          { invNo: 'INV-S3DEMO-2026', orderId: 'NZR-S3DEMO', customerName: 'Demo User', total: 1170, date: '2026-04-28T11:05:00.000Z', orderStatus: 'DELIVERED'   },
          { invNo: 'INV-S4DEMO-2026', orderId: 'NZR-S4DEMO', customerName: 'Demo User', total:  920, date: '2026-04-22T08:45:00.000Z', orderStatus: 'DELIVERED'   },
          { invNo: 'INV-S5DEMO-2026', orderId: 'NZR-S5DEMO', customerName: 'Demo User', total: 1680, date: '2026-04-15T16:20:00.000Z', orderStatus: 'DELIVERED'   },
        ];
        localStorage.setItem('nazrani:invoices:v1', JSON.stringify(invoices));
      }
    } catch (_) {}
  })();

  // ============================================================
  // EXPORT
  // ============================================================
  global.DataService = {
    // Catalogue
    getProducts, getProduct, getRelated, getCategories, getSources,
    // Content
    getStandard, getProvenance, getJournal, getArticle,
    // Cart
    getCart, getCartCount, addToCart, updateCartQty, removeFromCart, clearCart, getHydratedCart,
    resolveZone, computeShipping,
    // Orders
    placeOrder, getOrders, getOrder, seedDemoOrders,
    // Reviews
    getReviews, addReview,
    // Forms
    subscribeNewsletter, sendContact
  };
})(window);
