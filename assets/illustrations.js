/* ==========================================================================
   Nazrani Heritage — botanical SVG illustrations
   ==========================================================================
   Used as a fallback when a product has no photographic image. Hand-drawn
   marks for jaggery (p04), chyawanprash (p05), red matta rice (p06), and
   wild forest honey (p08). Other products fall through to a labelled placeholder.

   Exposes:  window.productIllustration(id) → string of SVG markup
   ========================================================================== */

(function (global) {
  'use strict';

  const ink  = 'var(--green-deep)';
  const tint = 'var(--green-tint)';
  const gold = 'var(--gold)';

  function frame(children, bg) {
    bg = bg || tint;
    return `<svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" style="display:block;background:${bg}">
       <rect x="6" y="6" width="188" height="188" fill="none" stroke="${ink}" stroke-opacity="0.15" stroke-width="0.6"/>
       ${children}
     </svg>`;
  }

  function jaggery() {
    const stalks = `
      <g stroke="${ink}" stroke-opacity="0.4" stroke-width="1.1" fill="none">
        <line x1="30" y1="60" x2="35" y2="95"/>
        <line x1="30" y1="68" x2="40" y2="68" stroke-opacity="0.3"/>
        <line x1="30" y1="78" x2="40" y2="78" stroke-opacity="0.3"/>
        <path d="M30 60 Q 22 45 28 30"/>
        <line x1="170" y1="60" x2="165" y2="95"/>
        <line x1="160" y1="68" x2="170" y2="68" stroke-opacity="0.3"/>
        <line x1="160" y1="78" x2="170" y2="78" stroke-opacity="0.3"/>
        <path d="M170 60 Q 178 45 172 30"/>
      </g>`;
    return frame(`
      <path d="M30 130 Q 100 90 170 130 Q 175 145 170 160 Q 100 175 30 160 Q 25 145 30 130 Z" fill="${ink}" fill-opacity="0.05"/>
      <line x1="50" y1="145" x2="160" y2="145" stroke="${ink}" stroke-opacity="0.15" stroke-width="0.4"/>
      <path d="M58 100 L 142 100 L 152 90 L 68 90 Z" fill="${ink}" fill-opacity="0.32" stroke="${ink}" stroke-width="0.7"/>
      <rect x="58" y="100" width="84" height="42" fill="${ink}" fill-opacity="0.42" stroke="${ink}" stroke-width="0.7"/>
      <path d="M142 100 L 142 142 L 152 132 L 152 90 Z" fill="${ink}" fill-opacity="0.55" stroke="${ink}" stroke-width="0.7"/>
      <line x1="72" y1="108" x2="128" y2="108" stroke="${ink}" stroke-opacity="0.3"  stroke-width="0.4"/>
      <line x1="66" y1="118" x2="134" y2="118" stroke="${ink}" stroke-opacity="0.25" stroke-width="0.4"/>
      <line x1="70" y1="128" x2="130" y2="128" stroke="${ink}" stroke-opacity="0.25" stroke-width="0.4"/>
      ${stalks}
    `);
  }

  function chyawanprash() {
    let herbs = `<g stroke="${ink}" stroke-opacity="0.25" fill="none" stroke-width="0.7">
      <path d="M30 50 Q 40 70 38 95"/>
      <path d="M170 50 Q 162 70 165 95"/>`;
    [60, 75, 90].forEach(function (y, i) {
      herbs += `<ellipse cx="${32 + (i % 2) * 4}" cy="${y}" rx="4" ry="2.5" transform="rotate(${-30 - i * 10} 32 ${y})"/>`;
      herbs += `<ellipse cx="${166 - (i % 2) * 4}" cy="${y}" rx="4" ry="2.5" transform="rotate(${30 + i * 10} 166 ${y})"/>`;
    });
    herbs += `</g>`;
    return frame(`
      ${herbs}
      <rect x="72" y="46" width="56" height="12" fill="${ink}" fill-opacity="0.55" stroke="${ink}" stroke-width="0.8"/>
      <line x1="72" y1="52" x2="128" y2="52" stroke="var(--paper)" stroke-opacity="0.4" stroke-width="0.5"/>
      <rect x="78" y="58" width="44" height="8" fill="${ink}" fill-opacity="0.35" stroke="${ink}" stroke-width="0.7"/>
      <path d="M70 66 L 130 66 L 136 80 L 136 154 Q 136 162 128 162 L 72 162 Q 64 162 64 154 L 64 80 Z"
            fill="${ink}" fill-opacity="0.18" stroke="${ink}" stroke-width="0.9"/>
      <path d="M75 75 L 75 150" stroke="var(--paper)" stroke-opacity="0.35" stroke-width="2"/>
      <rect x="74" y="96" width="52" height="38" fill="var(--paper)" fill-opacity="0.85" stroke="${ink}" stroke-opacity="0.4" stroke-width="0.5"/>
      <line x1="82" y1="104" x2="118" y2="104" stroke="${ink}" stroke-opacity="0.6" stroke-width="0.6"/>
      <line x1="86" y1="112" x2="114" y2="112" stroke="${ink}" stroke-opacity="0.4" stroke-width="0.4"/>
      <line x1="82" y1="120" x2="118" y2="120" stroke="${ink}" stroke-opacity="0.3" stroke-width="0.4"/>
      <line x1="86" y1="126" x2="114" y2="126" stroke="${ink}" stroke-opacity="0.3" stroke-width="0.4"/>
      <circle cx="100" cy="148" r="5" fill="${gold}" fill-opacity="0.5" stroke="${gold}" stroke-width="0.4"/>
    `);
  }

  function rice() {
    let grains = '';
    const cols = 10;
    for (let i = 0; i < 60; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const rowWidth = cols - row * 1.2;
      const xStart = 100 - (rowWidth * 14) / 2;
      const x = xStart + col * 14 + ((row % 2) * 7);
      const y = 168 - row * 11 - ((i * 13) % 4);
      const r = (i * 47) % 60 - 30;
      const opacity = 0.35 + ((i * 7) % 5) * 0.1;
      grains += `<ellipse cx="${x}" cy="${y}" rx="6" ry="2.4" fill="${ink}" fill-opacity="${opacity}" transform="rotate(${r} ${x} ${y})"/>`;
    }
    return frame(`
      <ellipse cx="100" cy="170" rx="75" ry="6" fill="${ink}" fill-opacity="0.08"/>
      <path d="M28 168 Q 100 140 172 168" fill="none" stroke="${ink}" stroke-opacity="0.25" stroke-width="0.6"/>
      ${grains}
      <g fill="${ink}" fill-opacity="0.5">
        <ellipse cx="40"  cy="172" rx="5" ry="2" transform="rotate(20 40 172)"/>
        <ellipse cx="55"  cy="176" rx="5" ry="2" transform="rotate(-10 55 176)"/>
        <ellipse cx="160" cy="172" rx="5" ry="2" transform="rotate(-15 160 172)"/>
        <ellipse cx="148" cy="178" rx="5" ry="2" transform="rotate(8 148 178)"/>
      </g>
    `);
  }

  function honey() {
    let cells = '';
    const cols = 6;
    for (let i = 0; i < 30; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = 25 + col * 30 + (row % 2) * 15;
      const y = 35 + row * 26;
      if (x < 15 || x > 185 || y > 175) continue;
      let pts = '';
      for (let k = 0; k < 6; k++) {
        const a = (Math.PI / 3) * k - Math.PI / 2;
        pts += `${x + 15 * Math.cos(a)},${y + 15 * Math.sin(a)} `;
      }
      const dx = Math.abs(x - 100), dy = Math.abs(y - 100);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const opacity = Math.max(0.15, 0.55 - dist / 200);
      cells += `<polygon points="${pts.trim()}" fill="${gold}" fill-opacity="${opacity}"/>`;
    }
    return frame(`
      <g stroke="${ink}" stroke-width="0.6">${cells}</g>
      <path d="M96 30 Q 92 60 100 90 Q 108 60 104 30 Z" fill="${gold}" fill-opacity="0.85" stroke="${ink}" stroke-opacity="0.4" stroke-width="0.6"/>
      <ellipse cx="100" cy="95" rx="6" ry="9" fill="${gold}" fill-opacity="0.85" stroke="${ink}" stroke-opacity="0.4" stroke-width="0.6"/>
      <ellipse cx="98" cy="90" rx="1.5" ry="3" fill="var(--paper)" fill-opacity="0.7"/>
    `);
  }

  function fallback(id) {
    return frame(`<text x="100" y="105" text-anchor="middle" font-family="monospace" font-size="9" fill="${ink}" fill-opacity="0.5">${id}</text>`);
  }

  global.productIllustration = function (id) {
    switch (id) {
      case 'p04': return rice();         // Gandhakasala Rice
      case 'p05': return rice();         // Jeerakasala Rice
      case 'p06': return rice();         // Palakkad Red Rice
      case 'p12': return chyawanprash(); // Classical Chyavanaprasam
      default:    return fallback(id);
    }
  };
})(window);
