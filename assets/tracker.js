/* Nazrani Heritage — Lightweight page tracker */
(function () {
  const KEY = 'nazrani:visitors:v1';
  const MAX = 3000;

  function sid() {
    let s = sessionStorage.getItem('nazrani:sid');
    if (!s) { s = Math.random().toString(36).slice(2, 12); sessionStorage.setItem('nazrani:sid', s); }
    return s;
  }

  function device() {
    return window.innerWidth < 768 ? 'Mobile' : window.innerWidth < 1024 ? 'Tablet' : 'Desktop';
  }

  function source() {
    const r = document.referrer;
    if (!r) return 'Direct';
    if (/google|bing|yahoo|duckduck/i.test(r)) return 'Search';
    if (/facebook|instagram|twitter|youtube|whatsapp|pinterest/i.test(r)) return 'Social';
    return 'Referral';
  }

  function pageName() {
    const f = location.pathname.split('/').pop() || 'index.html';
    return ({
      'index.html': 'Home',
      'product.html': 'Product Detail',
      'about.html': 'About',
      'faq.html': 'FAQ & Returns',
      'article.html': 'Journal',
      'account.html': 'My Orders',
      'login.html': 'Login',
    })[f] || f;
  }

  try {
    const ev = JSON.parse(localStorage.getItem(KEY) || '[]');
    ev.push({ sid: sid(), ts: new Date().toISOString(), page: pageName(), device: device(), source: source() });
    if (ev.length > MAX) ev.splice(0, ev.length - MAX);
    localStorage.setItem(KEY, JSON.stringify(ev));
  } catch (e) {}
})();
