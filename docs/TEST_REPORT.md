# Test Report

Date: 2026-06-24

Status: Phase 1 foundation complete; production migration and automated authorization tests pending

## Commands Run

- `npx prisma validate` with a dummy local `DATABASE_URL`
- `npx prisma generate`
- `npm run build`

## Results

- Prisma schema validation: PASS
- Prisma client generation: PASS
- Admin UI build: PASS
- Frontend Vite build: PASS
- Prerender: PASS, 13 succeeded and 0 failed
- SEO verification: PASS, 13/13 routes passed

## Manual Security Checks

- Affiliate partner no longer has lead update route access.
- Affiliate partner no longer has client work create/update route access.
- Affiliate lead/work responses are sanitized to hide direct contact data.
- Acquisition partner lead access is scoped by ownership.
- Agent lead access is scoped by ownership.
- HR partner applicant access is scoped by `assignedHrId`.
- Delivery partner project access is scoped by `deliveryPartnerId`.

## Still Pending

- Production database backup before deploy.
- Local/staging PostgreSQL migration apply using `npx prisma migrate deploy`.
- Migration verification using `npx prisma migrate status`.
- Manual `403` checks against unauthorized record IDs for every role.
- Automated route-level allow/deny tests are not yet implemented.
- Commission ledger and payout workflow tests are pending because those modules are not implemented yet.
