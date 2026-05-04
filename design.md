# Nazrani Heritage — Design System

A short, opinionated reference for keeping every page consistent. If you're
adding a new section, page, or component, read this once, then check your
work against it before merging.

The principles below are encoded in `assets/styles.css` (tokens & components)
and `assets/data.js` (copy & taxonomy). Don't introduce a new colour, font
size, or piece of microcopy without first checking whether one of those files
already provides it.

---

## 1. Brand voice

The voice is **quiet, factual, slightly old-fashioned**. It descends from a
merchant tradition that earned its reputation by writing down what was in
each jar and meaning it. Three rules:

1. **Specifics over adjectives.** "Marayoor cane, crushed within 12 hours" beats
   "premium hand-crafted jaggery". Numbers, places, and dates beat hype.
2. **Short sentences. Honest pauses.** Em-dashes (—) and full stops over commas.
   The reading rhythm should feel like a letter, not a brochure.
3. **Confidence without flourish.** No "world-class," no "best-in-class,"
   no exclamation marks. The product should sound like something a knowledgeable
   friend would tell you about, not something an agency wrote.

Italics (in `<span class="serif-i">`) are used sparingly to lift a key phrase
within a sentence — never for whole paragraphs.

---

## 2. Colour tokens

All colours are CSS variables in `:root` (see `styles.css`). Do not introduce
new hex values; pick the closest token instead.

| Token              | Hex        | Where it lives                                |
|--------------------|------------|-----------------------------------------------|
| `--ink`            | `#1a1d1a`  | Body text                                     |
| `--ink-soft`       | `#4a4f4a`  | Secondary text, prose paragraphs              |
| `--ink-muted`      | `#8b9089`  | Tertiary text, mono labels                    |
| `--rule`           | `#d9d6cb`  | Default 1px borders                           |
| `--rule-soft`      | `#ece9de`  | Inner table-cell borders                      |
| `--paper`          | `#fdfbf5`  | Page background (warm white)                  |
| `--paper-warm`     | `#f4efe2`  | Story strips, founder quote, page heads       |
| `--paper-cool`     | `#ffffff`  | Card surfaces                                 |
| `--green-deep`     | `#1f3a2b`  | Hero, footer, sourcing standard, dark CTAs    |
| `--green`          | `#2c5239`  | Primary buttons, accent text                  |
| `--green-soft`     | `#4a7355`  | Hover lifts                                   |
| `--green-pale`     | `#d8e0d2`  | Hover backgrounds for ghost CTAs              |
| `--green-tint`     | `#eef0e8`  | Placeholder fills, hover row                  |
| `--gold`           | `#a88a4a`  | GI tag border + text, drop-cap                |
| `--gold-soft`      | `#c5a874`  | Toast tick, dark-section eyebrows             |
| `--error`          | `#8b3a3a`  | Validation error states                       |

**Contrast.** All foreground/background pairs should clear WCAG 2.1 AA at
the rendered size. Mono labels at 9–10 px need dark backgrounds — never put
`--ink-muted` on `--rule-soft`.

---

## 3. Typography

Three families, three roles:

| Family             | CSS var      | Role                                          |
|--------------------|--------------|-----------------------------------------------|
| Cormorant Garamond | `--serif`    | Display, marketing copy, prose                |
| Inter              | `--sans`     | Body, buttons, lists, forms                   |
| JetBrains Mono     | `--mono`     | Eyebrows, lot numbers, labels, datestamps     |

All three are loaded from Google Fonts with `display=swap`.

### Type scale (clamps for fluid responsiveness)

| Use                              | Size                        | Class / selector              |
|----------------------------------|-----------------------------|-------------------------------|
| Hero H1                          | `clamp(34px, 4.4vw, 60px)`  | `.hero h1`                    |
| Page H1                          | `clamp(28px, 3.2vw, 44px)`  | `.page-head h1`               |
| Section H2                       | `clamp(22px, 2.6vw, 34px)`  | `.story h2`, `.standard h2`   |
| Article body                     | 16 px                       | `.article-body p`             |
| Body default                     | 14 px                       | `body`                        |
| Card name (serif)                | 18 px                       | `.product-card .info .name`   |
| Mono eyebrow                     | 10 px                       | `.eyebrow`                    |
| Mono label / lot                 | 8.5–9.5 px                  | various                       |

Letter-spacing on mono labels is `0.14em–0.18em` and always uppercase. This
is the single strongest visual identifier of the brand — keep using it on any
new label or eyebrow.

### Italics & display variants

- `.serif-i` — italic 400. Used inline within H1/H2 for "we serve", "harvest desk", etc.
- `.serif-i.accent` — italic + gold-soft, for the title accent inside dark sections.

---

## 4. Spacing & rhythm

The page uses a soft 4 px grid expressed through these gaps:

| Use                            | Value          |
|--------------------------------|----------------|
| Section vertical padding       | 64–72 px       |
| Page-head vertical padding     | 56 / 40 px     |
| Container max-width            | 1120 px (`--max`) |
| Container side padding         | 28 px          |
| Card / cell padding            | 14–22 px       |
| Inter-paragraph gap (prose)    | 12–20 px       |
| Hero side gap                  | 48 px (collapses to 36 px ≤960 px) |
| Form field column gap          | 18 px          |

Use `var(--max)` for the content container. If you need a narrower reading
column, use `.container-narrow` (max 760 px) — defined for article bodies and
the founder quote.

---

## 5. Layout grid & breakpoints

| Breakpoint  | Behaviour                                                   |
|-------------|-------------------------------------------------------------|
| `> 960 px`  | Multi-column hero/story/standard/cart; 4-up product grid    |
| `≤ 960 px`  | One-column sections; 3-up product grid; shop sidebar stacks |
| `≤ 700 px`  | One-column nav; 2-up product grid; footer 2-col             |

**Don't** introduce ad-hoc media queries inside a component. Add the rule
to the existing `@media (max-width: 960px)` or `(max-width: 700px)` block in
`styles.css`. If you need a third breakpoint, justify it in this file first.

---

## 6. Component patterns

Every component below has a working canonical example in the codebase. Find
it, copy it, adapt — don't invent a new variant.

### 6.1 Buttons

Three variants only. Don't introduce a fourth.

```html
<a class="btn btn-primary">Primary action →</a>
<a class="btn btn-ghost">Secondary action</a>
<a class="btn btn-light">For dark backgrounds</a>
```

Padding is fixed at `10px 16px`. Text is uppercase 11 px Inter Medium with
0.08em tracking. Don't override these per page.

### 6.2 Tags

```html
<span class="tag">Default</span>
<span class="tag tag-gold">GI · Wayanad</span>
<span class="tag tag-green">India Organic</span>
```

Tags are 8.5 px mono uppercase with 4–7 px padding. Use `tag-gold` for GI tags
and `tag-green` for organic certifications — that pairing is part of the
visual rhythm.

### 6.3 Eyebrow

```html
<div class="eyebrow">Part I · The Name</div>
```

Mono 10 px, 0.18em tracking, uppercase, `--ink-muted`. Inside dark sections,
prefer `--gold-soft`.

### 6.4 Product card

Defined once in `app.js → productCardHTML(p)`. All product grids (home featured,
shop PLP, related on PDP) MUST use this function. Don't render product cards
inline.

### 6.5 Quantity stepper

```html
<div class="qty-stepper">
  <button data-step="-1" type="button" aria-label="Decrease quantity">−</button>
  <input type="number" value="1" min="1" max="20" aria-label="Quantity"/>
  <button data-step="+1" type="button" aria-label="Increase quantity">+</button>
</div>
```

Used on PDP and cart line. The hover state inverts the button.

### 6.6 Form field

```html
<div class="field">
  <label for="cf-email">Email</label>
  <input id="cf-email" type="email" required autocomplete="email"/>
</div>
```

Inputs are bare — no border-radius, no boxes. A single `border-bottom:
1px solid var(--ink)` and a `--green` focus colour. This is intentional;
boxed inputs would conflict with the editorial aesthetic.

### 6.7 Page head

Used on every non-home page:

```html
<section class="page-head">
  <div class="container">
    <div class="crumbs">…</div>
    <h1 id="page-title">Title <span class="accent">accent.</span></h1>
    <p class="lede">Single-paragraph intro.</p>
  </div>
</section>
```

The `.accent` span is gold italic and provides the typographic note that
identifies a page-head visually.

---

## 7. Motion

Ambient. Two principles:

1. **Transitions are 180–220 ms** with `ease`. Anything snappier feels twitchy;
   anything slower feels sluggish. Use `transition: all 180ms ease;` as default.
2. **Hover lifts are subtle.** Border colour change > opacity change > transform.
   Do not use scale/translate transitions on cards.

The toast is the only animated element with motion (8 px slide-up, 200 ms in).
No carousels, no parallax, no auto-advancing anything.

---

## 8. Imagery

Two kinds:

1. **Photography** — Unsplash placeholders (in prototype) for product hero,
   founder portrait, journal articles. Always with `loading="lazy"` (except
   PDP hero & home hero which are `eager`), `decoding="async"`, and meaningful `alt`.
2. **Botanical SVG illustrations** — defined in `assets/illustrations.js` as
   fallbacks for products without photographs. They use the same colour palette
   and stroke weights. Do not change their style without updating all four
   illustrations together (jaggery, chyawanprash, rice, honey).

Aspect ratios: product card 1:1, hero card 4:5, journal card 4:3, article hero
16:9. Use `aspect-ratio` CSS, not fixed heights.

---

## 9. Accessibility commitments

These are non-negotiable. Every new page must satisfy them.

- `<main id="main">` wraps the page content
- `<header role="banner">`, `<footer role="contentinfo">`
- `aria-labelledby` on every `<section>` that has a heading
- `aria-label` on icon-only buttons
- Keyboard reachable: `Tab` cycles in DOM order; `Esc` closes search overlay
- All inputs have `<label>` (visible or `.visually-hidden`)
- All images have meaningful `alt` (or `alt=""` for decorative)
- Focus rings are not removed — never `outline: none` without an alternative
- Touch targets ≥ 36 × 36 px
- Page passes WCAG 2.1 AA contrast at the rendered size

---

## 10. Page composition rules

When adding a new page:

1. **Copy lives in `data.js`.** Add a new `DATA.copy.pages.<id>` block. The
   only strings allowed in HTML are structural markup, classnames, and
   `id`/`for` references.
2. **Page chrome** (header, footer, announcement, toast, search) is rendered
   by `Nazrani.init({ active: '<navId>', pageId: '<pageId>' })`. Pages must
   include the two anchor divs:
   ```html
   <div id="app-chrome"></div>
   <main id="main"> ... </main>
   <div id="app-footer"></div>
   ```
3. **Product grids** use `Nazrani.productCardHTML(p)` and
   `Nazrani.wireAddToCart(grid)`.
4. **Currency** uses `Nazrani.rupee(n)` — never hard-code `₹`.
5. **Microcopy** uses `DATA.copy.ui.*` — never hard-code "Add to cart".
6. **Meta tags** are set automatically by `Nazrani.init` if you provide
   `pageId`.
7. **Loading state** — every async surface should have a placeholder before
   the data arrives. Prefer `aria-live="polite"` on the surface.
8. **Empty state** — every list / grid must handle the empty case (see
   `cart.html` and `shop.html` for canonical examples).

---

## 11. What NOT to do

- ❌ New CSS variables in component files. Add them to `:root` in styles.css.
- ❌ Inline styles longer than ~3 properties. Extract to a class.
- ❌ Hard-coded English strings inside HTML. Use `DATA.copy.*`.
- ❌ Hard-coded prices, shipping rules, payment methods. Use `DATA.config.*`.
- ❌ Per-page `<style>` blocks. Add classes to `styles.css`.
- ❌ Per-page utility libraries. The codebase has zero runtime dependencies
  on purpose; keep it that way until the engineer adds a build step.
- ❌ `outline: none` without an alternative focus indicator.
- ❌ Bullet characters (`•`) in HTML — use `<ul>` and styled `<li>`.

---

## 12. Open questions for the engineer

These are not blockers, but worth thinking about before launch:

- Whether to ship the site as static HTML or migrate to a small React app.
  The current architecture is intentionally framework-free; the design tokens
  (CSS variables) port cleanly to React with no rewrite.
- Whether to keep `data.js` as the editor-facing source of truth or migrate
  to a CMS (Sanity / Strapi / Contentful) — a small editor-friendly schema
  is already implicit in the JSON shape.
- Whether to bundle the four asset files for production. They're roughly
  85 KB uncompressed; brotli would put the wire weight under 25 KB.

---

## 13. Where things live

```
assets/styles.css        Design tokens + every component style
assets/data.js           Brand, copy, products, content, config (single source of truth)
assets/data-service.js   Public API consumed by every page
assets/app.js            Header, footer, search, toast, product card, init()
assets/illustrations.js  Botanical SVG fallbacks (4 illustrations)
```

If you can't find the right place to put something, that's a sign it shouldn't
be added.
