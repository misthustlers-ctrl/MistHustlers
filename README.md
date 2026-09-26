# MistHustlers Backend Deployment

This project is deploy-ready on Netlify Free for the website, SEO Audit API, and Lead Finder API.

## Backend Routes

- `/api/run-seo-audit`
  - Fetches and renders a public website URL on the backend.
  - Runs the 14-point SEO score on the server.
  - Returns score, checks, pass/fail details, and report data.

- `/api/fetch-audit-html`
  - Lower-level backend fetch/render route used by the audit engine.

- `/api/find-leads`
  - Finds business leads from public map data.
  - Supports niche, location, max count up to 500, and website-gap filters.
  - Returns CSV/JSON export-ready lead data from the frontend.

## Free Deploy

1. Push this repo to GitHub.
2. Create a new Netlify site from the repo.
3. Netlify will use `netlify.toml` automatically.
4. Build command:

```bash
npm ci && npx playwright install --with-deps chromium && npm run build:netlify
```

5. Publish directory:

```bash
dist
```

No paid API key is required for the current Lead Finder. It uses public OpenStreetMap/Overpass data so it can run on a free backend. For deeper Google Maps data, run the separate local/VPS workflow instead of putting Google Maps scraping inside the website backend.

## Supabase Database

The backend can save every SEO audit and lead search to Supabase.

1. Create a Supabase project.
2. Open Supabase SQL Editor.
3. Run the SQL in `supabase/schema.sql`.
4. In Netlify, add these environment variables:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
SUPABASE_ANON_KEY=your-public-anon-key
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Use the service role key only in Netlify environment variables. Do not put it in frontend code or `VITE_*` variables. `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are public-safe frontend values used for Google sign-in.

## SEO Audit Google Sign-In

Only `/seo-audit` requires Google authentication. The public website routes (`/`, `/services`, `/about`, `/contact`, `/projects`, and other content pages) stay accessible without login.

Configure Supabase Auth before production testing:

1. Enable the Google provider in Supabase Auth.
2. Add the Google OAuth Client ID and Client Secret in Supabase. Never add the Google Client Secret to frontend code.
3. Add these redirect URLs in Supabase Auth URL settings:

```bash
http://localhost:5173/seo-audit
https://www.misthustlers.in/seo-audit
```

4. Add the same authorized redirect/callback settings required by Supabase in Google Cloud Console.

The frontend sends the Supabase access token as `Authorization: Bearer <access_token>` to `/api/run-seo-audit` and `/api/fetch-audit-html`. The Netlify functions validate the token with Supabase before running the audit.

Saved tables:

- `seo_audit_runs`
- `lead_search_runs`
- `backend_job_queue`
- `api_gateway_events`
- `api_response_cache`

If Supabase env vars are missing, the website still works; database saving is skipped.

## Timed Queue

Heavy backend jobs are protected by a timed queue:

- SEO Audit allows up to 8 active jobs.
- Lead Finder allows up to 3 active jobs.
- Extra requests return a queued response with `retryAfterSeconds`.
- The frontend waits and retries automatically.

With Supabase env vars enabled, queue state is stored in `backend_job_queue`. Without Supabase, a best-effort in-memory queue is used per warm function instance.

## Gateway Protection

The backend has a gateway layer before expensive work starts:

- SEO Audit rate limit: 8 requests per IP per 60 seconds.
- Lead Finder rate limit: 4 requests per IP per 120 seconds.
- SEO Audit cache: same URL is cached for 6 hours.
- Lead Finder cache: same niche/location/filter/count is cached for 12 hours.
- Cached responses skip queue, external data APIs, Playwright, and extra database writes.

With Supabase enabled, gateway events and response cache are shared across function instances. Without Supabase, in-memory cache/rate-limit still protects warm function instances.

## Local Checks

```bash
npm run build
```

Direct function smoke tests:

```bash
node -e "import('./netlify/functions/run-seo-audit.mjs').then(async m=>{const r=await m.handler({httpMethod:'POST',body:JSON.stringify({url:'https://example.com',trafficHint:'test'})}); console.log(r.statusCode, r.body.slice(0,200));})"
```

```bash
node -e "import('./netlify/functions/find-leads.mjs').then(async m=>{const r=await m.handler({httpMethod:'POST',body:JSON.stringify({niche:'dental clinic',location:'Indore',count:5,filter:'missing-website'})}); console.log(r.statusCode, r.body.slice(0,300));})"
```

## Practical Limits

The free backend is good for small to moderate usage. Very heavy lead searches, repeated scraping, or Google Maps-scale enrichment should be moved to a VPS worker or a paid data API.
