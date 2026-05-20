# Boda – Ana Mar & Mario

Wedding invitation website for Ana Mar & Mario, event on **November 7, 2026 in Tampico**.

## Stack
- Static frontend: `public/index.html`, `public/styles.css`, `public/app.js`
- Server: Express (`server.js`), serves the `public/` folder on port 3000
- Start: `npm run dev` (or `node server.js`)
- Fonts: Cormorant Garamond (headings) + Montserrat (body) via Google Fonts

## Design tokens (CSS variables)
| Token | Value | Use |
|-------|-------|-----|
| `--ink` | `#0e2841` | Primary text |
| `--cream` | `#f8f4ef` | Page background |
| `--teal` | `#156082` | Headings, links, accents |
| `--terracotta` | `#e97132` | Buttons, highlights |
| `--white` | `#ffffff` | Card backgrounds |

## Key classes
- `.section` — controls vertical padding for every page section (`clamp(1.5rem, 3vw, 2.5rem) 0`)
- `.intro-detail` — stacked detail lines below the date in the intro section
- `.parents-names` — bold teal for parent name groups
- `.parents-connector` — italic faded "y" separator between parent groups
- `.btn` — shared button/link style (terracotta pill, `cursor: pointer`, `border: none`)

## RSVP
Form submits to a Google Apps Script endpoint defined in `public/app.js` (`GOOGLE_SCRIPT_URL`). Uses `fetch` with `mode: "no-cors"`. Fields: name, people (1–2), transport (1=ida y vuelta, 2=solo regreso, 3=ninguno), dietary.

## Formatting fixes applied (May 2026)
- Lines 58–61 in `index.html`: converted bare `<span>` tags to `<p class="intro-detail">` so ceremony/reception/dress code/adults lines stack properly
- `y` connector between parent names: moved to `.parents-connector` class (italic, faded)
- Modal close button: changed `x` to `&times;`
- `.btn`: added `cursor: pointer` and `border: none`
- Section padding halved from `clamp(3rem, 6vw, 5rem)` to `clamp(1.5rem, 3vw, 2.5rem)`
