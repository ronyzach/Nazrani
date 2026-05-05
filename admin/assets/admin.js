/* ==========================================================================
   Nazrani Heritage — Admin Shared JS
   ========================================================================== */
(function (global) {
  'use strict';

  const ADMIN_KEY  = 'nazrani:admin:v1';
  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'demo';

  // ── Auth ────────────────────────────────────────────────────────────────
  function isAuthed() {
    try { return !!JSON.parse(localStorage.getItem(ADMIN_KEY)); } catch (_) { return false; }
  }
  function login(user, pass) {
    if (user === ADMIN_USER && pass === ADMIN_PASS) { localStorage.setItem(ADMIN_KEY, JSON.stringify({ authed: true })); return true; }
    return false;
  }
  function logout() { localStorage.removeItem(ADMIN_KEY); location.href = 'login.html'; }
  function requireAuth() { if (!isAuthed()) { location.replace('login.html'); } }

  // ── Sidebar nav groups ───────────────────────────────────────────────────
  const NAV_GROUPS = [
    { id: 'operations', label: 'Operations', items: [
      { id: 'dashboard',   label: 'Dashboard',    icon: '▤', href: 'dashboard.html' },
      { id: 'orders',      label: 'Orders',        icon: '◫', href: 'orders.html' },
      { id: 'fulfillment', label: 'Fulfillment',   icon: '↑', href: 'fulfillment.html' },
      { id: 'returns',     label: 'Returns',       icon: '↩', href: 'returns.html' },
    ]},
    { id: 'catalogue', label: 'Catalogue & Stock', items: [
      { id: 'products',  label: 'Products',  icon: '⊞', href: 'products.html' },
      { id: 'inventory', label: 'Inventory', icon: '▦', href: 'inventory.html' },
    ]},
    { id: 'finance', label: 'Customers & Finance', items: [
      { id: 'customers', label: 'Customers', icon: '◎', href: 'customers.html' },
      { id: 'invoices',  label: 'Invoices',  icon: '◈', href: 'invoices.html' },
    ]},
    { id: 'insights', label: 'Insights', items: [
      { id: 'analytics', label: 'Analytics', icon: '▲', href: 'analytics.html' },
      { id: 'traffic',   label: 'Traffic',   icon: '◐', href: 'traffic.html' },
    ]},
    { id: 'admin', label: 'Admin', items: [
      { id: 'company',  label: 'Company & KYC', icon: '◉', href: 'company.html' },
      { id: 'settings', label: 'Settings',      icon: '⚙', href: 'settings.html' },
    ]},
  ];

  // Flat NAV kept for backward compat
  const NAV = NAV_GROUPS.reduce(function(acc, g){ return acc.concat(g.items); }, []);

  const NAV_STATE_KEY = 'nazrani:admin:nav:v1';
  function readNavState() {
    try { return JSON.parse(localStorage.getItem(NAV_STATE_KEY) || '{}'); } catch(_) { return {}; }
  }
  function writeNavState(s) { localStorage.setItem(NAV_STATE_KEY, JSON.stringify(s)); }

  function renderSidebar(active) {
    const pendingOrders = (function() {
      try {
        const orders = JSON.parse(localStorage.getItem('nazrani:orders:v1') || '[]');
        return orders.filter(function(o){ return o.status === 'YET TO SHIP'; }).length;
      } catch(_) { return 0; }
    })();

    // Find which group the active page belongs to — always keep it open
    const activeGroup = (function() {
      for (var i = 0; i < NAV_GROUPS.length; i++) {
        if (NAV_GROUPS[i].items.some(function(n){ return n.id === active; }))
          return NAV_GROUPS[i].id;
      }
      return null;
    })();

    const state = readNavState();
    if (activeGroup) state[activeGroup] = false; // active group always expanded

    const groupsHtml = NAV_GROUPS.map(function(g) {
      const collapsed = !!state[g.id];
      const items = g.items.map(function(n) {
        const badge = ((n.id === 'orders' || n.id === 'fulfillment') && pendingOrders > 0)
          ? '<span class="badge">' + pendingOrders + '</span>' : '';
        return '<a href="' + n.href + '" class="nav-item' + (n.id === active ? ' active' : '') + '">'
          + '<span class="icon">' + n.icon + '</span>'
          + n.label + badge + '</a>';
      }).join('');

      return '<div class="nav-group-wrap" data-group="' + g.id + '">'
        + '<div class="nav-group-header">'
        +   '<span>' + g.label + '</span>'
        +   '<span class="nav-toggle">' + (collapsed ? '+' : '−') + '</span>'
        + '</div>'
        + '<div class="nav-group-items' + (collapsed ? ' collapsed' : '') + '">'
        + items
        + '</div>'
        + '</div>';
    }).join('');

    const html = '<div class="sidebar">'
      + '<div class="sidebar-brand">'
      +   '<div style="display:flex;align-items:center;gap:10px;">'
      +     '<img src="../assets/images/logo.png" alt="Nazrani Heritage" style="width:42px;height:42px;border-radius:50%;object-fit:cover;flex-shrink:0;border:1px solid rgba(255,255,255,0.15);"/>'
      +     '<div>'
      +       '<div class="name">Nazrani Heritage</div>'
      +       '<div class="sub">Admin Panel</div>'
      +     '</div>'
      +   '</div>'
      + '</div>'
      + '<nav class="sidebar-nav" aria-label="Admin navigation">'
      + groupsHtml
      + '</nav>'
      + '<div class="sidebar-footer">'
      +   '<a href="../index.html" target="_blank"><span class="icon">↗</span> View store</a>'
      +   '<button onclick="Admin.logout()"><span class="icon">⊘</span> Sign out</button>'
      + '</div>'
      + '</div>';

    const el = document.getElementById('admin-sidebar');
    if (el) el.outerHTML = html;

    // Wire accordion toggles after render
    document.querySelectorAll('.nav-group-header').forEach(function(header) {
      header.addEventListener('click', function() {
        const wrap = header.closest('.nav-group-wrap');
        const gId  = wrap.dataset.group;
        const items = wrap.querySelector('.nav-group-items');
        const toggle = header.querySelector('.nav-toggle');
        const isCollapsed = items.classList.toggle('collapsed');
        toggle.textContent = isCollapsed ? '+' : '−';
        const s = readNavState();
        s[gId] = isCollapsed;
        writeNavState(s);
      });
    });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  function rupee(n) {
    return '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function fmtDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  function statusBadge(status) {
    const map = {
      'DELIVERED':    'badge-green',
      'IN TRANSIT':   'badge-amber',
      'YET TO SHIP':  'badge-muted',
      'CONFIRMED':    'badge-muted',
      'CANCELLED':    'badge-red',
    };
    return '<span class="badge ' + (map[status] || 'badge-muted') + '">' + esc(status || 'CONFIRMED') + '</span>';
  }
  function stockBadge(qty) {
    if (qty === 0)  return '<span class="badge badge-red">Out of stock</span>';
    if (qty <= 10)  return '<span class="badge badge-amber">Low — ' + qty + ' left</span>';
    return '<span class="badge badge-green">' + qty + ' in stock</span>';
  }

  // ── Return reasons & statuses ────────────────────────────────────────────
  const RETURN_REASONS = {
    'DAMAGED':         'Arrived Damaged',
    'WRONG_ITEM':      'Wrong Item Sent',
    'QUALITY_ISSUE':   'Quality Not as Described',
    'CHANGED_MIND':    'Changed Mind',
    'COURIER_DAMAGE':  'Damaged in Transit',
    'MISSING_ITEM':    'Item Missing from Order',
    'EXPIRED':         'Near Expiry / Expired',
    'OTHER':           'Other',
  };
  const RETURN_STATUSES = {
    'REQUESTED':         { label: 'Requested',         cls: 'badge-muted'  },
    'APPROVED':          { label: 'Approved',           cls: 'badge-amber'  },
    'REJECTED':          { label: 'Rejected',           cls: 'badge-red'    },
    'REFUND_INITIATED':  { label: 'Refund Initiated',   cls: 'badge-amber'  },
    'REFUND_COMPLETED':  { label: 'Refund Completed',   cls: 'badge-green'  },
  };
  function returnStatusBadge(status) {
    const s = RETURN_STATUSES[status] || { label: status, cls: 'badge-muted' };
    return '<span class="badge ' + s.cls + '">' + s.label + '</span>';
  }

  // ── Issue types ──────────────────────────────────────────────────────────
  const ISSUE_TYPES = {
    'ADDRESS_ISSUE':     'Address Issue',
    'LOGISTICS_DELAY':   'Logistics Delay',
    'RTO_INITIATED':     'RTO Initiated',
    'CUSTOMER_REJECTED': 'Customer Rejected',
    'LOST_IN_TRANSIT':   'Lost in Transit',
    'PAYMENT_FAILED':    'Payment Failed',
    'OTHER':             'Other',
  };
  function issueBadge(issueType) {
    return '<span class="badge badge-red">⚠ ' + (ISSUE_TYPES[issueType] || issueType || 'Issue') + '</span>';
  }

  // ── Company KYC (localStorage) ───────────────────────────────────────────
  const COMPANY_KEY = 'nazrani:company:v1';
  function getCompany() {
    try { return JSON.parse(localStorage.getItem(COMPANY_KEY)) || {}; } catch (_) { return {}; }
  }
  function saveCompany(data) { localStorage.setItem(COMPANY_KEY, JSON.stringify(data)); }

  // ── Inventory (localStorage) ─────────────────────────────────────────────
  const INV_KEY = 'nazrani:inventory:v1';
  function getInventory() {
    try { return JSON.parse(localStorage.getItem(INV_KEY)) || {}; } catch (_) { return {}; }
  }
  function saveInventory(data) { localStorage.setItem(INV_KEY, JSON.stringify(data)); }
  function getStock(productId) { return getInventory()[productId] || 0; }
  function setStock(productId, qty) {
    const inv = getInventory(); inv[productId] = qty; saveInventory(inv);
  }

  // ── Re-order levels (localStorage) ──────────────────────────────────────
  const REORDER_KEY = 'nazrani:reorder:v1';
  function getReorderLevels() {
    try { return JSON.parse(localStorage.getItem(REORDER_KEY)) || {}; } catch (_) { return {}; }
  }
  function saveReorderLevels(data) { localStorage.setItem(REORDER_KEY, JSON.stringify(data)); }

  global.Admin = {
    isAuthed, login, logout, requireAuth,
    renderSidebar,
    rupee, esc, fmtDate, statusBadge, stockBadge,
    getCompany, saveCompany,
    getInventory, saveInventory, getStock, setStock,
    getReorderLevels, saveReorderLevels,
    RETURN_REASONS, RETURN_STATUSES, returnStatusBadge,
    ISSUE_TYPES, issueBadge,
    NAV
  };
})(window);
