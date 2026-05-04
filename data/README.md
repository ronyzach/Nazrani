# /data/ — example response shapes

These JSON files are kept as **reference fixtures only** — they're no longer
loaded by the running site. The single source of truth is now
`/assets/data.js`.

Use them as canonical examples when you implement the real backend:

| File              | Maps to endpoint                       |
|-------------------|----------------------------------------|
| `products.json`   | `GET /api/products`                    |
| `categories.json` | `GET /api/categories`                  |
| `standard.json`   | `GET /api/standard`                    |
| `provenance.json` | `GET /api/provenance`                  |
| `journal.json`    | `GET /api/journal`                     |
| `articles.json`   | `GET /api/journal/:slug` (keyed map)   |

**Important:** These fixtures may drift from `data.js` over time. When in
doubt, treat `data.js` as authoritative.

You can safely delete this folder once the real backend is live and the
shapes are documented elsewhere.
