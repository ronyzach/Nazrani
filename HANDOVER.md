# Handover Notes — Nazrani Heritage

For the AI / full-stack engineer taking the prototype to production.

## TL;DR

1. **All data and copy** live in `assets/data.js` (`window.DATA`).
2. **All API calls** go through `assets/data-service.js` — the single point of swap.
3. **Replace each function body** in `data-service.js` with a real `fetch(...)`.
   Keep the public surface unchanged so no consumer page needs editing.
4. **Smoke test**: `node test-runner.js` runs 19 tests against the data service.
   Re-run after every swap to catch regressions.

---

## 1. API contract

Each function in `data-service.js` maps to a single REST endpoint. To productionise,
replace `DB().products` (etc.) with a real `fetch()` call. Add `Authorization`
headers where appropriate.

### Catalogue

| Function                                    | Suggested endpoint                          |
|---------------------------------------------|---------------------------------------------|
| `getProducts({category, search, sort, limit})` | `GET /api/products?…`                    |
| `getProduct(id)`                            | `GET /api/products/:id`                     |
| `getRelated(id, limit)`                     | `GET /api/products/:id/related?limit=4`     |
| `getCategories()`                           | `GET /api/categories`                       |

### Content

| Function                                    | Suggested endpoint                          |
|---------------------------------------------|---------------------------------------------|
| `getStandard()`                             | `GET /api/standard`                         |
| `getProvenance()`                           | `GET /api/provenance`                       |
| `getJournal({limit})`                       | `GET /api/journal?limit=3`                  |
| `getArticle(slug)`                          | `GET /api/journal/:slug`                    |

### Cart

The prototype uses `localStorage`. In production, bind to a session or user.

| Function                                    | Suggested endpoint                          |
|---------------------------------------------|---------------------------------------------|
| `getCart()` / `getHydratedCart()`           | `GET /api/cart` (with `?hydrate=true`)      |
| `addToCart(productId, qty)`                 | `POST /api/cart/items`                      |
| `updateCartQty(productId, qty)`             | `PATCH /api/cart/items/:id`                 |
| `removeFromCart(productId)`                 | `DELETE /api/cart/items/:id`                |
| `clearCart()`                               | `DELETE /api/cart`                          |

### Orders

| Function                                    | Suggested endpoint                          |
|---------------------------------------------|---------------------------------------------|
| `placeOrder({customer, address, payment})`  | `POST /api/orders`                          |
| `getOrder(orderId)`                         | `GET /api/orders/:orderId`                  |

### Forms

| Function                                    | Suggested endpoint                          |
|---------------------------------------------|---------------------------------------------|
| `subscribeNewsletter(email)`                | `POST /api/newsletter`                      |
| `sendContact(payload)`                      | `POST /api/contact`                         |

---

## 2. Data models

### Product

```jsonc
{
  "id":        "p01",
  "name":      "Tellicherry Black Pepper",
  "subtitle":  "Whole, sun-dried",
  "origin":    "Wayanad",
  "lot":       "WYD-PPR-26-04",
  "price":     480,                   // INR; integer rupees
  "weight":    "250g",
  "gi":        true,
  "organic":   "India Organic",
  "category":  "Spices",
  "image":     "https://.../photo.jpg",  // optional; SVG fallback if absent
  "stock":     84,
  "harvested": "March 2026",
  "story":     "Hand-picked from smallholder vines...",
  "notes":     ["Bold heat with woody depth", "..."],
  "spec":      { "Bulk Density": "560–580 g/L", "...": "..." }
}
```

### Hydrated cart line

```jsonc
{
  "id": "p01", "name": "Tellicherry Black Pepper",
  "subtitle": "...", "category": "Spices",
  "weight": "250g", "origin": "Wayanad",
  "image": "https://...",
  "unitPrice": 480, "qty": 2, "lineTotal": 960
}
```

### Order

```jsonc
{
  "orderId":  "NZR-3F7D0K",
  "placed":   "2026-05-04T08:14:22.000Z",
  "customer": { "name": "...", "email": "...", "phone": "..." },
  "address":  { "line1": "...", "line2": "...", "city": "...",
                "state": "...", "pincode": "...", "country": "India" },
  "payment":  { "method": "upi" },
  "items":    [/* hydrated cart lines */],
  "subtotal": 1240, "shipping": 0, "total": 1240,
  "status":   "CONFIRMED",
  "estimatedDispatch": "06 May 2026"
}
```

---

## 3. Editorial / non-engineering changes

Most copy edits should NOT require an engineer. Open `assets/data.js` and edit:

- **Brand info, contact details, footer columns** → `DATA.brand`, `DATA.footer`
- **Page copy (titles, ledes, marketing text)** → `DATA.copy.pages.<id>`
- **Buttons, microcopy, toasts** → `DATA.copy.ui`
- **Catalogue (products, prices, lots, stories)** → `DATA.products`
- **Sourcing standard, origins, journal teasers** → `DATA.standard`, `DATA.provenance`, `DATA.journal`
- **Article bodies** → `DATA.articles[slug]`
- **Shipping rules, payment methods, sort modes** → `DATA.config`

The shape of `DATA` is documented inline at the top of `data.js`. Keep it
backward-compatible: existing keys must continue to work, even when adding
new ones.

---

## 4. Production checklist

### Must-haves before launch

- [ ] **Authentication** — sign up, login, password reset, email verification
- [ ] **Real cart / session binding** — replace `localStorage` cart with
      server-side cart tied to user or guest session
- [ ] **Payment integration** — Razorpay or Cashfree for UPI / cards / net
      banking; PayU as backup
- [ ] **Order management** — admin panel to view, fulfill, ship, refund
- [ ] **Inventory** — real-time stock tracking; soft holds during checkout;
      over-sell guards
- [ ] **Pincode serviceability** — Shiprocket / Delhivery API; gate COD by pincode
- [ ] **Email transactions** — order confirmation, shipping update, delivery
      confirmation (Postmark / SES / Mailgun)
- [ ] **Address validation** — pincode-to-city/state autofill (India Post API
      or commercial)
- [ ] **GSTIN compliance** — invoices with HSN codes, GST line items, GSTIN
      field for B2B buyers
- [ ] **FSSAI label** — display licence number on every product page
      (regulatory)
- [ ] **Image hosting** — move from Unsplash placeholders to CDN-hosted
      product photography
- [ ] **Search backend** — replace client-side substring filter with proper
      search (Meilisearch / Typesense / Algolia) when SKU count grows
- [ ] **Analytics** — GA4 + ecommerce events (view_item, add_to_cart,
      begin_checkout, purchase)
- [ ] **Error monitoring** — Sentry or Bugsnag

### Operational

- [ ] **SEO** — sitemap.xml, robots.txt, structured data (Product, Article,
      Organisation). Per-page meta tags and OG tags are already wired through
      `Nazrani.setMeta()`.
- [ ] **Performance** — preload critical fonts, image lazy-loading (already
      in place), CDN for `/assets/`
- [ ] **Accessibility** — full WCAG 2.1 AA pass. The prototype has the
      groundwork (`<main>`, `<nav>`, ARIA labels, focus management, keyboard
      reachability). A formal audit before launch is recommended.
- [ ] **Privacy** — DPDPA 2023 compliance: privacy policy, cookie banner,
      data export & deletion endpoints
- [ ] **Terms & shipping policy** — wire real legal pages
- [ ] **Security** — CSRF tokens, rate-limiting, input sanitisation, CSP headers
- [ ] **Backups** — DB snapshots, JSON content backups, image asset backups
- [ ] **CI/CD** — automated deploys on merge to `main`; staging environment

### Nice-to-haves

- [ ] Wishlist / save for later
- [ ] Product reviews & ratings
- [ ] Referral / loyalty programme
- [ ] Bundle / gift packaging
- [ ] Subscription / repeat orders (jaggery, honey, chyawanprash are good candidates)
- [ ] Multi-currency (NRI customer base)
- [ ] Multi-language (Malayalam, Tamil)
- [ ] Recently viewed
- [ ] Live chat / WhatsApp Business

---

## 5. Suggested phasing

**Phase 1 — Catalogue & content (1–2 weeks)**
- Move `DATA.products`, `DATA.categories`, `DATA.standard`, `DATA.provenance`,
  `DATA.journal`, `DATA.articles` into the database
- Implement `GET /api/products`, `…/categories`, `…/standard`, `…/provenance`,
  `…/journal`
- Replace those `DataService` function bodies with real `fetch`
- Migrate Unsplash placeholders to CDN-hosted product photography

**Phase 2 — Cart & checkout (2–3 weeks)**
- Server-side cart tied to session
- Address book + pincode serviceability
- Razorpay integration (UPI + cards)
- Order management endpoints + admin

**Phase 3 — Auth & account (1–2 weeks)**
- Email + OTP login (mobile-first audience)
- Order history, address book, default address

**Phase 4 — Operations (ongoing)**
- Admin panel for orders, inventory, content
- Email/SMS notifications
- Analytics, monitoring, SEO

---

## 6. Known gaps in the prototype

| Gap                                          | Why deferred                                            |
|----------------------------------------------|---------------------------------------------------------|
| Account / login pages                        | Out of scope per the brief                              |
| Real payment processing                      | Needs Razorpay / Cashfree commercial account            |
| Real search backend                          | 8 products → not yet warranted                          |
| Server-side cart / order persistence         | Backend not yet built                                   |
| FSSAI / GST values                           | Placeholder strings — replace in `DATA.brand.contact`   |
| Pincode serviceability check                 | Needs Shiprocket / Delhivery API key                    |
| Product photography                          | Unsplash placeholders + branded SVG fallbacks           |

---

## 7. Conventions to keep

If you migrate to React / Vue / Next, please preserve these conventions —
they are part of the brand:

- **CSS variables drive every colour and font.** Don't hard-code hex.
- **Three font families, three roles** — see `design.md`.
- **No emoji, no carousels, no hype copy.** The voice is documented in `design.md`.
- **GI tags use `--gold`; organic tags use `--green`.** This pairing is identity.
- **Mono uppercase eyebrows with 0.18em tracking.** Don't replace with another label style.

If a design change feels necessary, update `design.md` first so the system
stays consistent.
