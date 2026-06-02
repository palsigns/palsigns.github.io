# Pal Signs

Marketing site for Pal Signs, a custom signage and large format print shop.
Concept: "Where names learn to glow." A darkened showroom where signs ignite,
the real client work sits dimmed and lights up on hover, and a soft torch
follows the cursor.

## Pages

| File | Page | Content |
| --- | --- | --- |
| `index.html` | Home | Igniting wordmark hero, client marquee, manifesto, featured work, capabilities, stats, craft feature, CTA |
| `work.html` | Work | Full portfolio with category filtering and illuminate-on-hover gallery |
| `signs.html` | Signs | Illuminated signage: channel letters, lightboxes, neon, dimensional, process, materials |
| `printing.html` | Printing | Large format: banners, window graphics, vehicle wraps, apparel, print specs |
| `contact.html` | Contact | Quote form, contact details, hours |

## Stack

Static HTML, CSS, and vanilla JavaScript. No build step. Open `index.html`
directly or serve the folder with any static host.

- `css/style.css` shared design system (tokens, components, responsive, motion)
- `js/main.js` cursor torch, wordmark ignition, scroll reveals, nav, work filter, form
- `assets/` client photography (referenced via CSS `object-fit`, no manual cropping)

Type: Fraunces (display), Hanken Grotesk (body), Martian Mono (labels), loaded
from Google Fonts.

## Notes

- The contact form is a front-end demo. Wire `#quote-form` to an email service
  or backend endpoint before launch.
- Phone, email, and stats are placeholders to confirm and replace.
- Designed dark-first. Portfolio images render in a dimmed "off" state and
  illuminate on hover (touch devices show them lit by default).
