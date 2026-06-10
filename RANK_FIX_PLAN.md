# Rank Fix Plan — MistHustlers

## Current Score: ~45/100 (won't rank)

---

## Phase 1: Critical (Do This Week)

### 1.1 SSR / Pre-rendering
**Problem:** SPA — Googlebot sees empty div, not content
**Fix:** Add `@prerender/prerender-node` or `react-snap` to pre-render pages for crawlers
**File:** `backend/server.js` + `package.json`
**Effort:** 2-4 hours

### 1.2 Custom Domain
**Problem:** `misthustlers.up.railway.app` has zero authority
**Fix:** Buy `misthustlers.com` or `misthustlers.in` → point to Railway
**Effort:** 1 hour + ₹800/yr

### 1.3 Google Business Profile
**Task:**
- Create GMB listing: "MistHustlers, Indore"
- Address: Indore, Madhya Pradesh 452001
- Phone: +91 888 993 7648
- Website, hours, services, photos
- Get 5+ Google reviews from past clients

**Impact:** Local pack ranking for "web development Indore"

---

## Phase 2: High Priority (Do This Month)

### 2.1 Backlinks (Most Important)
| Source | Method | Quantity |
|--------|--------|----------|
| Indore business directories | Justdial, Sulekha, IndiaMart | 5-8 |
| Dev communities | IndieHackers, GitHub, Dev.to posts | 3-5 |
| Startup directories | ProductHunt, BetaList, SaasHub | 3 |
| Guest posts | Tech blogs about web dev in Indore | 2-3 |

### 2.2 Local Citations
Submit NAP to: Justdial, Sulekha, AskLaila, Indore Yellow Pages, Google Maps

### 2.3 Content Marketing (Blog)
Create 4-6 articles targeting long-tail keywords:
- "Website development cost in Indore 2026"
- "Best web development agency in Indore for startups"
- "How much does it cost to build an MVP in India"
- "Custom automation solutions for Indore businesses"
- "MistHustlers portfolio: websites built for Indore clients"

---

## Phase 3: Medium Priority

### 3.1 Portfolio with Real Images
- Collect past projects from Naveen
- Add before/after screenshots
- Add client testimonials (real names + photos if possible)
- Replace all gradient placeholders with real project images

### 3.2 Case Studies
Write 2-3 detailed case studies:
- Client problem → solution → results (metrics)
- Include tech stack, timeline, screenshots
- Each case study = separate URL: `/case-studies/xyz`

### 3.3 Speed Optimization
- Run Lighthouse → fix issues (currently untested)
- Convert OG SVG to real JPG (some platforms reject SVG)
- Add `loading="lazy"` to below-fold images (already present)
- Enable Cloudflare CDN in front of Railway

### 3.4 Schema Enhancement
- Add `Review` schema for testimonials
- Add `Article` schema for blog posts
- Add `Product` schema for services with pricing

---

## Phase 4: Long Term

### 4.1 Social Proof
- Twitter/X presence (@misthustlers)
- LinkedIn company page
- GitHub organization with public repos
- YouTube channel (build in public / tutorials)

### 4.2 Email List
- Capture leads via the inquiry form (already exists)
- Build email sequence: quote → follow-up → case study → check-in

### 4.3 Paid Ads (Optional)
- Google Local Services Ads (Indore)
- Facebook/Instagram retargeting

---

## Expected Timeline

| Milestone | Timeframe | Expected Rank |
|-----------|-----------|---------------|
| Custom domain + SSR | Week 1 | — |
| GMB + 5 reviews | Week 2 | "web development agency indore" → page 5-6 |
| 10 backlinks + 8 citations | Week 4 | Page 3-4 |
| 6 blog posts + 3 case studies | Week 6-8 | Page 2 |
| Ongoing backlinks + content | Month 3-4 | Page 1 (long-tail) |

**Realistic:** Page 1 for "web development agency in Indore" in 4-6 months with consistent effort.

---

## Resources Needed

| Item | Cost |
|------|------|
| Domain (misthustlers.in) | ~₹800/yr |
| GMB setup | Free |
| Backlink outreach | Free (time) |
| Blog content | Free (you write) |
| Prerender service | Free tier ~250 pages/mo |
| Total | ~₹800 + time |

Want me to start implementing Phase 1 (the code changes)?
