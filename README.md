# Nazrani Heritage — Functional Prototype

Premium, single-origin Kerala produce. Static multi-page e-commerce prototype
ready for handover to an AI / full-stack engineer for productionisation.

## Stack

- **Frontend:** Vanilla HTML / CSS / JavaScript — no build step, no bundler
- **Data:** Single `assets/data.js` exposing `window.DATA` (catalogue, content, copy, config)
- **State:** In-memory + `localStorage` (cart, recent orders)
- **Fonts:** Google Fonts (Cormorant Garamond, Inter, JetBrains Mono) with `display=swap`
- **Images:** Unsplash CDN photographs + inline botanical SVG fallbacks

## Quick start

```bash
cd /path/to/Nazrani
python -m http.server 8000        # or:  npx serve .
```

Open <http://localhost:8000>. The site requires HTTP because the page chrome
is rendered through script execution; opening via `file://` will not initialise
correctly.

## File inventory

```
Nazrani/
├── index.html                  Homepage
├── shop.html                   Catalogue (filters, sort)
├── product.html                Product detail (?id=p01)
├── cart.html                   Cart review
├── checkout.html               Checkout (address + payment)
├── order-confirmation.html     Order confirmed (?id=NZR-XXXXXX)
├── journal.html                Journal listing
├── article.html                Single article (?slug=...)
├── standard.html               Sourcing Standard detail
├── origins.html                Provenance / origins detail
├── contact.html                Contact form
├── 404.html                    Branded not-found page
│
├── assets/
│   ├── styles.css              Design tokens + every component style
│   ├── data.js                 SINGLE SOURCE OF TRUTH (brand, copy, products, content, config)
│   ├── data-service.js         API façade consumed by every page
│   ├── app.js                  Header, footer, search, toast, product card, init()
│   └── illustrations.js        Botanical SVG fallbacks (4 illustrations)
│
├── design.md                   Design system reference
├── HANDOVER.md                 API contract + production checklist
├── README.md                   This file
├── test-runner.js              Node smoke test for data-service.js
└── .gitignore
```

## Architecture in one sentence

> Every page is a thin shell that calls `Nazrani.init({ active, pageId })`,
> then renders sections from `DATA.copy.pages[pageId]` via `DataService` calls
> — meaning all human-readable copy and all catalogue data live in **one file**
> (`assets/data.js`), and every page reads it through **one façade**
> (`assets/data-service.js`).

This means: no string is duplicated across pages, no API URL is duplicated,
and going to production means rewriting one file (`data-service.js`) — not
fifteen.

## Three rules every page follows

1. **Copy lives in `DATA.copy.pages.<id>`.** No hard-coded English strings in HTML.
2. **Data fetches go through `DataService`.** No direct localStorage or `fetch` from a page.
3. **Chrome is rendered by `app.js`.** Pages declare `<div id="app-chrome">`
   and `<div id="app-footer">` and call `Nazrani.init(...)`.

The full design language is documented in [`design.md`](./design.md). The
production handover plan is in [`HANDOVER.md`](./HANDOVER.md).

## Working features

- Cart persisted across page loads (`localStorage`)
- Cart badge in header updates live (custom event, all pages)
- Filter, sort, and category state reflected in the URL on `shop.html`
- Product search overlay (header icon — `Esc` to close)
- Quantity steppers on PDP and cart
- Mock checkout that creates an order ID, persists it, redirects to confirmation
- Newsletter & contact form submissions (mock; resolve immediately)
- Per-page `<title>`, `<meta description>`, OpenGraph, and Twitter cards
- Responsive layouts for mobile, tablet, and desktop
- Full keyboard accessibility (`Tab` order, focus rings, `Esc` closes overlays)
- Semantic HTML (`<main>`, `<nav>`, `<article>`, `<aside>`) + ARIA labels

## What is mocked vs. real

| Layer                 | Status                                                              |
|-----------------------|---------------------------------------------------------------------|
| Catalogue / content   | Inline in `assets/data.js`                                          |
| Cart                  | `localStorage` (`nazrani:cart:v1`)                                  |
| Checkout / orders     | `DataService.placeOrder()` simulates 600 ms latency, returns `NZR-…`|
| Newsletter / contact  | Resolve immediately with a mock ticket id                           |
| Authentication        | Not implemented (out of scope for this prototype)                   |
| Search                | Client-side substring match across name/subtitle/origin/category    |
| Image hosting         | Unsplash CDN; SVG fallbacks for products without photographs        |

See `HANDOVER.md` for the full API contract the engineer should implement.

## Verification

```bash
node test-runner.js     # 19 functional tests — runs in 2 s
```

The runner shims `localStorage`, loads `data.js` and `data-service.js`, and
exercises every public function. Use it as a regression baseline once you swap
to real APIs — same tests should still pass.

## Notes for the engineer

- All API calls go through `assets/data-service.js`. To productionise, replace
  each function body with a real `fetch(...)`. Keep the public surface
  (function names, signatures, return shapes) identical.
- `localStorage` keys: `nazrani:cart:v1`, `nazrani:orders:v1`. Once the backend
  has cart/orders endpoints, drop the writes from `data-service.js`.
- The cart-update event `nazrani:cart-updated` (CustomEvent on `window`) is
  the single source of truth that drives the badge. Keep firing it after any
  cart mutation.
- Header / footer are rendered into `<div id="app-chrome">` and `<div id="app-footer">`
  by `app.js`. Pages need only declare those two anchor divs.
- The `.gitignore` excludes `Homepage.html` (the original single-file source);
  it's left in the repo for reference but no longer linked from any page.
