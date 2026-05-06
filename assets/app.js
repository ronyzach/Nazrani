/* ==========================================================================
   Nazrani Heritage — Shared UI module
   ==========================================================================
   - Renders the announcement bar, sticky header, search overlay, footer, toast.
   - Wires search, newsletter form, cart-badge sync.
   - Provides helpers: productCardHTML(p), wireAddToCart(grid), setMeta(opts),
     showToast(msg), tpl(text, vars), rupee(n), esc(s).
   - Reads ALL human-readable strings from window.DATA (assets/data.js).

   Pages are expected to call:
     Nazrani.init({ active: '<navId>', pageId: '<pageId>' });
   …after DOM-ready. The pageId drives <title>, <meta description>, and
   any per-page chrome customisation.
   ========================================================================== */

(function (global) {
  'use strict';

  // ---------------------------------------------------------------- helpers
  function DB() {
    if (!global.DATA) throw new Error('Nazrani DATA not loaded — include assets/data.js before app.js');
    return global.DATA;
  }
  function rupee(n) {
    const sym = (DB().config && DB().config.currencySymbol) || '₹';
    return sym + (n || 0).toLocaleString('en-IN');
  }
  function pad2(n) { return String(n).padStart(2, '0'); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  /** Replace {token} placeholders in `text` with values from `vars`. */
  function tpl(text, vars) {
    return String(text || '').replace(/\{(\w+)\}/g, (_, k) => (vars && vars[k] != null) ? vars[k] : '');
  }

  // -------------------------------------------------------------------- meta
  /** Update <title> and <meta name="description"> + OpenGraph from DATA. */
  function setMeta(pageId) {
    const data = DB();
    const meta = (data.copy.pages[pageId] && data.copy.pages[pageId].meta) || data.copy.pages.home.meta;
    if (meta && meta.title) document.title = meta.title;

    const ensure = (selector, attrs) => {
      let el = document.head.querySelector(selector);
      if (!el) { el = document.createElement('meta'); document.head.appendChild(el); }
      Object.keys(attrs).forEach((k) => el.setAttribute(k, attrs[k]));
      return el;
    };
    if (meta && meta.description) {
      ensure('meta[name="description"]', { name: 'description', content: meta.description });
      ensure('meta[property="og:description"]', { property: 'og:description', content: meta.description });
      ensure('meta[name="twitter:description"]', { name: 'twitter:description', content: meta.description });
    }
    if (meta && meta.title) {
      ensure('meta[property="og:title"]', { property: 'og:title', content: meta.title });
      ensure('meta[name="twitter:title"]', { name: 'twitter:title', content: meta.title });
    }
    if (data.brand && data.brand.ogImage) {
      ensure('meta[property="og:image"]', { property: 'og:image', content: data.brand.ogImage });
      ensure('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    }
    ensure('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    ensure('meta[property="og:site_name"]', { property: 'og:site_name', content: data.brand.name + ' ' + data.brand.qualifier });
  }

  // -------------------------------------------------------------- chrome HTML
  function renderAnnouncement() {
    return '<div class="announce">'
      +   '<div class="container announce-row">'
      +     '<div class="announce-left"></div>'
      +     '<div class="announce-right">'
      +       '<button class="announce-iconbtn" aria-label="Open search" data-action="open-search">'
      +         '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">'
      +           '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'
      +         '</svg>'
      +       '</button>'
      +       renderUserNav()
      +       '<a href="cart.html" class="announce-cart" aria-label="Cart">'
      +         'Cart <span class="announce-cart-pill" id="cart-count" aria-live="polite">00</span>'
      +       '</a>'
      +     '</div>'
      +   '</div>'
      + '</div>';
  }

  function readUser() {
    try { return JSON.parse(localStorage.getItem('nazrani:user:v1')); } catch(_) { return null; }
  }

  function renderUserNav() {
    var user = readUser();
    if (!user || user.guest) {
      return '<a href="login.html" class="navlink user-signin-link">Sign in</a>';
    }
    var first  = (user.name || 'A').split(' ')[0] || 'A';
    var initial = esc(first.charAt(0).toUpperCase());
    var name    = esc(first);
    return '<div class="user-nav" id="user-nav">'
      + '<button class="user-avatar-btn" id="user-avatar-btn" aria-label="Account menu" aria-expanded="false">'
      + initial
      + '</button>'
      + '<div class="user-dropdown" id="user-dropdown" hidden>'
      + '<div class="user-dropdown-name">' + name + '</div>'
      + '<a class="user-dropdown-link" href="account.html">My Orders</a>'
      + '<button class="user-dropdown-so" data-action="sign-out">Sign out</button>'
      + '</div>'
      + '</div>';
  }

  function renderHeader(active) {
    const data = DB();
    const navHtml = (data.nav || []).map(function (n) {
      return '<a href="' + n.href + '" class="navlink' + (n.id === active ? ' active' : '') + '">' + esc(n.label) + '</a>';
    }).join('');
    return ''
      + '<header class="site-header" role="banner">'
      +   '<div class="container row">'
      +     '<nav aria-label="Main">' + navHtml + '</nav>'
      +     '<a href="index.html" class="wordmark" aria-label="' + esc(data.brand.name + ' — home') + '">'
      +       '<div class="name">' + esc(data.brand.name) + '</div>'
      +       '<div class="sub">' + esc(data.brand.tagline) + '</div>'
      +     '</a>'
      +     '<div class="utility">'
      +       '<a href="contact.html">Contact</a>'
      +     '</div>'
      +   '</div>'
      + '</header>';
  }

  function renderSearchOverlay() {
    const placeholder = (DB().copy.ui && DB().copy.ui.searchPlaceholder) || 'Search...';
    return ''
      + '<div class="search-overlay" id="search-overlay" role="dialog" aria-modal="true" aria-label="Search">'
      +   '<div class="search-box">'
      +     '<input id="search-input" type="text" placeholder="' + esc(placeholder) + '" autocomplete="off" aria-label="Search query"/>'
      +     '<div class="search-results" id="search-results" role="listbox" aria-label="Search results"></div>'
      +   '</div>'
      + '</div>';
  }

  function renderToast() {
    return '<div class="toast" id="toast" role="status" aria-live="polite"><span class="check">✓</span><div class="toast-body"><span id="toast-msg"></span><a id="toast-action" class="toast-action" href="cart.html">View cart →</a></div></div>';
  }

  function renderFooter() {
    const data = DB();
    const cols = (data.footer.columns || []).map(function (col) {
      const links = (col.links || []).map(function (l) {
        return '<li><a href="' + l.href + '">' + esc(l.label) + '</a></li>';
      }).join('');
      return '<div class="col"><h4>' + esc(col.title) + '</h4><ul>' + links + '</ul></div>';
    }).join('');

    return ''
      + '<footer class="site-footer" role="contentinfo">'
      +   '<div class="container">'
      +     '<div class="grid">'
      +       '<div class="brand">'
      +         '<div class="name">' + esc(data.brand.name) + '</div>'
      +         '<div class="sub">' + esc(data.brand.tagline) + '</div>'
      +         '<p>' + esc(data.footer.tagline) + '</p>'
      +       '</div>'
      +       cols
      +     '</div>'
      +     '<div class="bottom">'
      +       '<span>' + esc(data.brand.copyright) + '</span>'
      +       '<span>' + esc(data.brand.paymentsLine) + '</span>'
      +       '<span>' + esc(data.brand.address) + '</span>'
      +     '</div>'
      +   '</div>'
      + '</footer>';
  }

  // ----------------------------------------------------------------- runtime
  function updateCartBadge() {
    const el = document.getElementById('cart-count');
    if (!el) return;
    const count = global.DataService ? DataService.getCartCount() : 0;
    el.textContent = pad2(Math.min(count, 99));
  }

  let toastTimer = 0;
  function showToast(msg, opts) {
    const el  = document.getElementById('toast');
    const txt = document.getElementById('toast-msg');
    const act = document.getElementById('toast-action');
    if (!el || !txt) return;
    txt.textContent = msg;
    if (act) act.style.display = (opts && opts.action === false) ? 'none' : '';
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3500);
  }

  function wireSearch() {
    const overlay = document.getElementById('search-overlay');
    const input   = document.getElementById('search-input');
    const results = document.getElementById('search-results');
    if (!overlay || !input || !results) return;

    let lastFocused = null;

    function open() {
      lastFocused = document.activeElement;
      overlay.classList.add('show');
      setTimeout(function () { input.focus(); }, 30);
    }
    function close() {
      overlay.classList.remove('show');
      input.value = '';
      results.innerHTML = '';
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }
    document.body.addEventListener('click', function (e) {
      const t = e.target.closest('[data-action="open-search"]');
      if (t) { e.preventDefault(); open(); }
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('show')) close();
    });

    let searchTimer;
    input.addEventListener('input', function () {
      clearTimeout(searchTimer);
      const q = input.value.trim();
      if (!q) { results.innerHTML = ''; return; }
      searchTimer = setTimeout(function () { runSearch(q, results); }, 120);
    });
  }

  async function runSearch(q, container) {
    if (!global.DataService) return;
    const list = await DataService.getProducts({ search: q, limit: 6 });
    if (!list.length) {
      const empty = (DB().copy.ui && DB().copy.ui.searchEmpty) || 'No matches';
      container.innerHTML = '<div class="empty">' + esc(empty) + '</div>';
      return;
    }
    container.innerHTML = list.map(function (p) {
      return '<a class="res" role="option" href="product.html?id=' + p.id + '">' +
        '<span class="nm">' + esc(p.name) + '</span>' +
        '<span class="ct">' + esc(p.category) + ' · ' + esc(p.origin) + '</span>' +
      '</a>';
    }).join('');
  }

  function wireNewsletter() {
    const form = document.getElementById('newsletter');
    if (!form || !global.DataService) return;
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const email = (document.getElementById('news-email') || {}).value;
      const btn = document.getElementById('news-btn');
      if (!email) return;
      const res = await DataService.subscribeNewsletter(email);
      if (res.ok && btn) btn.textContent = '✓ Subscribed';
      const msg = (DB().copy.ui && DB().copy.ui.toast && DB().copy.ui.toast.subscribed) || 'Subscribed';
      showToast(msg, { action: false });
    });
  }

  // -------------------------------------------------------- product card UI
  /**
   * Two-word descriptor shown on product cards in place of the raw lot code.
   */
  function lotLabel(p) {
    const map = {
      'Spices':       'Fresh harvest',
      'Staples':      'New crop',
      'Ayurveda':     'Slow-made',
      'Health Foods': 'Stone-ground'
    };
    return map[p.category] || 'Fresh batch';
  }

  /**
   * HTML for a single product card. Used by featured (home) + shop grid + related.
   */
  function productCardHTML(p) {
    const ui = (DB().copy.ui) || {};
    const hasImg = !!p.image;
    const media = hasImg
      ? '<img class="cover" src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async"/>' +
        '<div aria-hidden="true" data-overlay class="img-overlay"></div>'
      : (typeof productIllustration === 'function' ? productIllustration(p.id) : '');
    const giBadge = p.gi
      ? '<div class="badge-tl"><span class="tag tag-gold">GI · ' + esc(p.origin) + '</span></div>' : '';
    return ''
      + '<a href="product.html?id=' + p.id + '" class="product-card" data-pid="' + p.id + '">'
      +   '<div class="lot-strip">'
      +     '<span>' + esc(lotLabel(p)) + '</span>'
      +     '<span class="stock">● in stock</span>'
      +   '</div>'
      +   '<div class="img-wrap">'
      +     '<div class="placeholder' + (hasImg ? ' has-image' : '') + '" style="aspect-ratio:1/1;">'
      +       media + giBadge
      +       '<div class="badge-tr"><span class="tag">' + esc(p.organic) + '</span></div>'
      +     '</div>'
      +   '</div>'
      +   '<div class="info">'
      +     '<div class="meta">' + esc(p.category) + ' · ' + esc(p.weight) + '</div>'
      +     '<div class="name">' + esc(p.name) + '</div>'
      +     '<div class="sub">' + esc(p.subtitle) + '</div>'
      +     '<div style="flex:1"></div>'
      +     '<div class="footer">'
      +       '<div class="row">'
      +         '<div class="price">' + rupee(p.price) + '</div>'
      +         '<div class="wt">' + esc(p.weight) + '</div>'
      +       '</div>'
      +       '<button class="add-btn" data-add="' + p.id + '" type="button">' + esc(ui.addToCart || 'Add to cart →') + '</button>'
      +     '</div>'
      +   '</div>'
      + '</a>';
  }

  function wireAddToCart(container) {
    if (!container || !global.DataService) return;
    const ui = DB().copy.ui || {};
    container.addEventListener('click', async function (e) {
      const btn = e.target.closest('.add-btn');
      if (!btn) return;
      e.preventDefault();
      const pid = btn.dataset.add;
      const product = await DataService.getProduct(pid);
      if (!product) return;
      DataService.addToCart(pid, 1);
      btn.classList.add('added');
      btn.textContent = ui.added || '✓ Added';
      showToast(product.name + (ui.toast && ui.toast.addedSuffix || ' added'));
      setTimeout(function () {
        btn.classList.remove('added');
        btn.textContent = ui.addToCart || 'Add to cart →';
      }, 1600);
    });
  }

  // ------------------------------------------------------------- public init
  /**
   * @param {{active?:string, pageId?:string}} [opts]
   *  - active: nav link id to underline (e.g. 'shop')
   *  - pageId: key into DATA.copy.pages for meta tags
   */
  function init(opts) {
    opts = opts || {};
    const root = document.getElementById('app-chrome');
    if (root) {
      root.innerHTML =
        renderAnnouncement() +
        renderHeader(opts.active || '') +
        renderSearchOverlay();
    }
    const footRoot = document.getElementById('app-footer');
    if (footRoot) {
      footRoot.innerHTML = renderFooter() + renderToast();
    }

    if (opts.pageId) setMeta(opts.pageId);

    updateCartBadge();
    wireSearch();
    wireNewsletter();

    global.addEventListener('nazrani:cart-updated', updateCartBadge);

    // Avatar dropdown toggle
    document.addEventListener('click', function (e) {
      var btn = document.getElementById('user-avatar-btn');
      var dd  = document.getElementById('user-dropdown');
      if (btn && e.target === btn) {
        var open = !dd.hidden;
        dd.hidden = open;
        btn.setAttribute('aria-expanded', String(!open));
        return;
      }
      // Close on outside click
      if (dd && !dd.hidden && !dd.contains(e.target)) {
        dd.hidden = true;
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
      // Sign-out
      if (e.target.dataset.action === 'sign-out') {
        localStorage.removeItem('nazrani:user:v1');
        location.reload();
      }
    });
  }

  // ----------------------------------------------------------------- export
  global.Nazrani = {
    init: init,
    setMeta: setMeta,
    showToast: showToast,
    rupee: rupee,
    pad2: pad2,
    esc: esc,
    tpl: tpl,
    productCardHTML: productCardHTML,
    wireAddToCart: wireAddToCart,
    updateCartBadge: updateCartBadge,
    DB: DB
  };
})(window);
