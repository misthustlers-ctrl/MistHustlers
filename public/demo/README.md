# MistHustlers Premium /demo Folder

Premium, conversion-focused website demos for 10 client industries. Built with plain HTML, CSS, and Vanilla JS.

## Structure

```
demo/
├── index.html              # Premium demo hub / portfolio gallery
├── css/shared.css          # Premium design system: spacing, type, shadows, animations, reduced motion
├── js/shared.js            # UTM tracking, staggered reveals, counters, WhatsApp, analytics, form success
├── README.md               # This file
├── coaching/               # #01 Coaching Institutes (Priority)
├── clinic/                 # #02 Clinics / Dentists (Priority)
├── interior/               # #03 Interior / Architects (Priority)
├── realestate/             # #04 Real Estate Brokers / Builders
├── gym/                    # #05 Gyms / Fitness Studios
├── salon/                  # #06 Salons / Spas
├── restaurant/             # #07 Restaurants / Cafes
├── ca-lawyer/              # #08 CA / Lawyers / Consultants
├── manufacturer/           # #09 Manufacturers / Traders (B2B)
└── startup/                # #10 Startup / SaaS Ideas
```

## How to Deploy

1. Copy the entire `/demo` folder into your main site root.
2. Update `js/shared.js` — replace `XXXXXXXXXX` with the real MistHustlers WhatsApp number.
3. Add a link on the main site: `https://yourdomain.com/demo/?utm_source=main_site&utm_medium=button&utm_campaign=demo_portfolio`
4. Add Google Analytics / GTM to each page if desired. Shared JS already fires `gtag` events when available.
5. Replace remote Unsplash image URLs with your own production images if needed.

## Premium Features

- **Design system**: 16px/24px radius, 24px/32px card padding, 8px spacing grid, consistent shadows
- **Typography**: Google Fonts with preconnect, negative heading tracking, 1.65 body line-height
- **Animations**: Staggered scroll reveals (0.20 threshold), hover lifts, CTA arrow movement, reduced-motion support
- **Conversion**: Sticky WhatsApp button, sticky footer CTA, action-specific form buttons, form success state
- **SEO**: Canonical URLs, meta descriptions, structured titles, favicon
- **Accessibility**: focus-visible styles, aria-labels, proper labels, reduced-motion media query
- **Performance**: No external JS frameworks, lazy-loaded images, inline SVG favicon, no console logs

## WhatsApp Pre-fill Messages

Every demo uses a pre-filled message: `I saw your [type] demo, interested!`.

## UTM Tracking

Hub links carry UTM parameters. Internal CTA buttons use `data-track` attributes for GA4 event tracking.

## Notes

- All pages are mobile-first and responsive.
- Hero images load eagerly; other images use `loading="lazy"` and `decoding="async"`.
- All forms include phone validation and a success state.
- Replace `XXXXXXXXXX` with a real number before going live.

---

MistHustlers — Indore, India — 2025
