# MistHustlers Career, Partner, Referral, Commission, and Role System Audit

Date: 2026-06-24  
Branch: `feature/dynamic-career-partner-system`  
Repository path: `C:\Users\Lenovo\Music\misthustlers01\misthustlers01\misthustlers\MistHustlers`

## 1. Audit Scope

This audit reviews the current MistHustlers app before implementing a scalable career, partner, referral, commission, role, and admin management system.

The review covers:

- Public website career/application flow
- Admin dashboard roles and permissions
- Existing CRM/work-order/payment logic
- Current Prisma/PostgreSQL schema
- Existing public and admin APIs
- CMS/content architecture
- Google Sheet and email integrations
- Upload/media handling
- Deployment/start/build behavior
- Security, data isolation, migration, and production risks

This file intentionally documents the current state first. Major implementation should proceed only after this audit is accepted.

## 2. Git State Reviewed

Required commands were run from the actual repository folder.

- Current branch before audit: `main`
- Working tree before audit: clean
- Latest commits reviewed:
  - `1a58725 Allow Google Fonts in CSP`
  - `38d38fd Let admin choose homepage execution plans`
  - `f55bb83 Improve services filtering and budget plan focus`
  - `1aad9d2 Sync homepage hero content on startup`
  - `8cd8e12 Prevent CMS content flash on first load`
  - `3494bd6 Fix homepage first-load hero rendering`
  - `f25ce3f Unblock service package migration deploy`
  - `b40bcb8 Add service packages and SEO presence updates`
  - `bdd2ff3 Refine services hero orbit animation`
  - `f47aacf Polish service visuals and preview tooling`

A new safe feature branch was created:

- `feature/dynamic-career-partner-system`

Current implementation status:

- Phase 1 foundation complete; production migration and automated authorization tests pending.

## 3. Existing Architecture

The project is a single full-stack app:

- Frontend: React 19, Vite, TypeScript, Tailwind CSS v4
- Backend: Express 4, Prisma 5, PostgreSQL
- Admin UI: separate Vite React app inside `backend/admin-ui`
- Deployment: Railway via `railway.json`
- Build command: root `npm run build`
- Start command: root `npm run start`

Important files:

- `package.json`
- `vite.config.mjs`
- `src/App.tsx`
- `src/pages/Career.tsx`
- `src/components/TalentApplicationForm.tsx`
- `src/components/ServiceInquiryForm.tsx`
- `backend/server.js`
- `backend/routes/admin.routes.js`
- `backend/routes/public.routes.js`
- `backend/routes/inquiry.routes.js`
- `backend/routes/content.routes.js`
- `backend/middleware/admin-auth.middleware.js`
- `backend/prisma/schema.prisma`
- `backend/admin-ui/src/App.tsx`

## 4. Existing Database Models

Current Prisma models:

- `Content`
- `ContentDraft`
- `ContentRevision`
- `MediaAsset`
- `ActivityLog`
- `Inquiry`
- `Opportunity`
- `Applicant`
- `Project`
- `AdminUser`
- `ClientWork`
- `WorkPayment`

Useful existing tables for this system:

- `admin_users`: already supports `admin`, `agent`, and `partner` role strings.
- `client_work`: already connects client work to optional `agentId` and `partnerId`.
- `work_payments`: already stores payment history for agent/partner roles.
- `opportunities`: already powers career listings.
- `applicants`: already stores public career applications.
- `inquiries`: already stores service lead forms with email/sheet status.
- `activity_logs`: already stores admin action history.

Remaining database/product concepts after Phase 1 foundation:

- No dedicated role/permission tables.
- `partner_profiles` database foundation exists, but admin profile-management UI is still pending.
- HR partner role exists, but full HR profile/team management is still pending.
- Referral database foundation exists, but public referral-link capture, cookie attribution and conversion flow are not implemented yet.
- No commission policy table.
- No commission ledger table.
- No payout request/approval workflow.
- No bank/UPI payout details storage.
- No task/milestone/deliverable model for partner work execution.
- No applicant ownership/assignment model.
- No inquiry-to-work conversion linkage.
- No status history table for opportunities, applicants, client work, commissions, or payouts.

## 5. Existing Roles and Access

Current role list in backend auth:

- `admin`
- `agent`
- `partner`

Current admin account creation:

- Only admin can create database-backed accounts.
- Allowed account roles are currently `agent` and `partner`.
- Environment owner admin still exists via `ADMIN_USERNAME` and `ADMIN_PASSWORD`.

Current admin UI role tab mapping:

- `admin`: dashboard, work, leads, workers, career, projects, content, media, logo, accounts, bin
- `agent`: dashboard, work, leads, workers, career
- `partner`: dashboard, work, projects

Current backend access rules:

- Accounts: admin only
- Work orders: admin, agent, partner
- Work payments: admin only
- Inquiries: admin, agent
- Opportunities: admin, agent for read/update, admin for create/delete
- Applicants: admin, agent for read/update, admin for create/delete
- Projects: admin, partner for read/update, admin for create/delete
- CMS/media/content: admin only

Current data isolation:

- `GET /api/admin/work-orders` filters agent users to their own `agentId`.
- `GET /api/admin/work-orders` filters partner users to their own `partnerId`.
- `PUT /api/admin/work-orders` checks agent/partner ownership before update.
- `GET /api/admin/inquiries`, `GET /api/admin/opportunities`, and `GET /api/admin/applicants` expose all records to agents.
- `GET /api/admin/projects` exposes all projects to partners.

Risk: partner/agent dashboard access exists, but a formal permission matrix does not. Some role behavior is hardcoded across backend routes and a large admin UI file.

## 6. Existing Public Career Flow

Current public files:

- `src/pages/Career.tsx`
- `src/components/CareerHero.tsx`
- `src/components/TalentApplicationForm.tsx`
- `backend/routes/public.routes.js`
- `backend/controllers/applicant.controller.js`

Current flow:

1. Career page loads CMS career content through `useContent("career")`.
2. Career page requests live listings from `GET /api/opportunities`.
3. Public applicant form posts to `POST /api/applicants`.
4. Backend creates an `Applicant` row.
5. Backend increments `Opportunity.applicants`.
6. Backend attempts an email notification through SMTP.

Current limitations:

- Public application form does not collect phone even though `Applicant.phone` exists.
- Public application form has no role-specific application type for HR partner, acquisition partner, affiliate, worker, intern, freelancer, or event attendee.
- Some career CTAs still link to a hardcoded Google Form URL in `Career.tsx` and `CareerHero.tsx`.
- `GET /api/opportunities` merges database opportunity rows with rich JSON content by matching titles. This can drift when titles change.
- Applicant email delivery is attempted but applicant email/sheet status is not stored.
- Applicant submissions do not sync to Google Sheets.

## 7. Existing CRM, Agent, Partner, and Payment Flow

Current CRM files:

- `backend/prisma/schema.prisma`
- `backend/routes/admin.routes.js`
- `backend/admin-ui/src/App.tsx`

Current data model:

- `ClientWork` tracks client name, phone, service, price, status, notes, delivery link, delivery notes, agent, partner, commission, payout, paid amounts.
- `WorkPayment` records admin-entered payments for agent or partner.

Current flow:

- Admin can create full client work and assign agent/partner.
- Agent can create client leads. Agent-created work has price, commission, and payout set to zero.
- Partner can update status and delivery fields only for assigned work.
- Admin can record agent/partner payments.

Strengths:

- This is a good base for an agent/referral and partner-delivery system.
- Existing work-order status list can be reused.
- Admin dashboard already shows agent/partner payment overview.

Missing:

- No automatic commission calculation.
- Referral database foundation exists, but public referral-link capture, cookie attribution and conversion flow are not implemented yet.
- No lead source attribution.
- No inquiry-to-work conversion path.
- No commission approval workflow.
- No payout request/settlement workflow.
- No proof/upload per delivery milestone.
- No work category model.
- No public partner onboarding form.
- No partner qualification/review process.

## 8. Existing CMS and Service Management

CMS pages currently allowed:

- `home`
- `about`
- `services`
- `career`
- `projects`
- `contact`
- `logo`
- `seo`

Admin CMS has:

- Draft save
- Publish
- Restore versions
- Delete content
- Content import/export
- Visual editors for services, home, about, career, projects, contact, logo, SEO
- JSON editor fallback

Services content already includes:

- Categories
- Service cards
- Pricing tiers
- Homepage featured plan IDs

This can be reused for partner categories, worker categories, and opportunity categories.

## 9. Existing Email and Google Sheet Integrations

Current email service:

- `backend/services/mail.service.js`
- Supports inquiry email.
- Supports applicant email.
- Uses Gmail SMTP env vars: `SMTP_EMAIL`, `SMTP_PASSWORD`, `EMAIL_TO`.

Current Google Sheet service:

- `backend/services/sheet.service.js`
- Supports website inquiry sync only.
- Uses `GOOGLE_SHEETS_WEBHOOK_URL`.
- Stores status on `Inquiry.sheetStatus` and `Inquiry.sheetError`.

Missing:

- No applicant sheet sync.
- No partner onboarding sheet sync.
- No referral lead sheet sync.
- No payout sheet sync.
- No integration event log.
- No retry queue.

## 10. Existing Upload and Media Flow

Current upload behavior:

- Admin-only image upload via `POST /api/admin/upload`.
- Allowed image extensions: jpg, jpeg, png, webp, gif.
- Allowed image MIME types are checked.
- Images are resized to max 1200x1200 and converted to webp for jpg/png/webp.
- Upload size limit is 10 MB.
- Delete removes missing content references from `Content` and `ContentDraft`.

Missing:

- No public resume/file upload.
- No partner proof upload.
- No document upload.
- No file ownership.
- No private file access model.
- No virus scanning or remote object storage.

## 11. Security Review Findings

Positive controls already present:

- Helmet is enabled.
- CSP exists.
- Admin APIs are protected by auth middleware.
- Passwords for database accounts use PBKDF2 with per-user salt.
- Session tokens are HMAC signed and expire after 8 hours.
- Admin rate limiter exists.
- General API rate limiter exists.
- Uploads validate extension and MIME.
- Content size limit exists for CMS payloads.
- Admin account creation is admin-only.
- Partner/agent work-order updates check ownership.

Risks to address before production-scale partner/referral launch:

- No CSRF protection for admin APIs. Bearer token in `sessionStorage` lowers cookie CSRF risk, but XSS would expose the token.
- `script-src` currently allows `'unsafe-inline'`, increasing CSP/XSS risk.
- Admin UI stores auth token in `sessionStorage`.
- Preview login exists on localhost only, but should remain impossible in production.
- Role permissions are hardcoded in multiple places, not centralized.
- Agents can view all inquiries, opportunities, and applicants.
- Partners can view all projects.
- No audit log entries are created for some important operations such as work-order create/update/delete in all branches.
- No failed login audit trail.
- No lockout or escalating login throttling per username.
- Public applicant form has no rate limiter specific to `/api/applicants`; it is only covered by the general limiter.
- Uploads are local filesystem based. Railway filesystem is not durable across redeploys, so production uploads can disappear.
- Partner/agent financial fields exist but no immutable ledger or approval status protects against accidental edits.

## 12. Deployment and Migration Risks

Current Railway build/start:

- Build runs backend install, Prisma generate, admin UI build, frontend build, Playwright browser install, prerender, SEO verification.
- Start runs service package migration resolver, Prisma migrate deploy, content sync scripts, hero sync script, and server.

Known risks:

- Production migrations have previously failed. New migrations must be additive and carefully tested.
- Railway local filesystem uploads are not durable; partner proof/resume uploads should not rely on local disk for serious production.
- `seed()` runs on every backend boot and skips existing content/opportunities/projects. This is safe-ish but should be monitored when adding default data.
- Existing migration order includes an old failed migration resolver script. New migration names must not conflict.

## 13. Main Gaps Against Requested System

Required system area | Current status | Gap
--- | --- | ---
Career system | Basic opportunities/applicants exist | Needs application types, stages, assignment, HR pipeline
Worker inquiries | Applicants exist | Needs category-wise worker inquiry model and admin filters
HR partner | Not present | Needs role/profile, permissions, candidate ownership
Acquisition partner | Partial via agent/partner | Needs partner type, attribution, lead conversion
Affiliate/referral | Database foundation exists | Needs public referral-link capture, cookie attribution, conversion flow, affiliate dashboard
Commission policy | Manual fields on client work | Needs policy table and ledger
Payouts | Manual paid amount + payment rows | Needs payout request, approval, paid/rejected flow
Role management | Hardcoded roles | Needs centralized permission matrix
Public onboarding | Career applicant form only | Needs partner/affiliate/worker onboarding entry points
Admin overview | Partial dashboard | Needs combined pipeline, revenue, commission, partner, HR, and attribution overview
Google Sheet overview | Inquiries only | Needs integration overview across all form types
Auditability | Basic activity logs | Needs broader financial and role action logs

## 14. Recommended Implementation Plan

### Phase 1: Permission Matrix and Role Foundation

Create a central role/permission definition used by backend and admin UI.

Recommended roles:

- `admin`
- `agent`
- `delivery_partner`
- `hr_partner`
- `acquisition_partner`
- `affiliate_partner`

Keep backward compatibility:

- Existing `partner` accounts can map to `delivery_partner` behavior until migrated.
- Existing `agent` accounts remain valid.

Deliverables:

- `docs/ROLE_PERMISSION_MATRIX.md`
- Central backend permission helper
- Admin UI role/tab mapping update
- Safer route guards
- Data isolation rules for every route

### Phase 2: Partner and Worker Profiles

Add profile data without breaking existing `AdminUser`.

Recommended tables:

- `PartnerProfile`
- `WorkerProfile`
- `PartnerCategory`
- `WorkerCategory`

Capabilities:

- Admin creates/manages partner accounts.
- Admin assigns partner type.
- Admin tags skills/categories.
- Partner dashboard shows only assigned/owned data.
- Worker inquiries can be reviewed by category.

Deliverables:

- `docs/ACQUISITION_PARTNER_FLOW.md`
- `docs/HR_PARTNER_FLOW.md`
- Admin account/profile UI
- Partner dashboard profile cards

### Phase 3: Referral and Attribution System

Referral tables now exist. The next phase is public referral-link capture, 60-day first-touch attribution, and conversion flow.

Recommended tables:

- `ReferralCode`
- `ReferralEvent`
- `ReferralAttribution`

Capabilities:

- Admin generates referral codes.
- Agent/acquisition/affiliate partner gets unique link.
- Public forms capture `ref`, `utm_source`, `utm_medium`, `utm_campaign`, landing page, and first-touch timestamp.
- Admin sees source of each lead, applicant, and client work.

Deliverables:

- `docs/REFERRAL_ATTRIBUTION.md`
- `docs/AFFILIATE_FLOW.md`
- Public tracking utility
- Admin attribution overview

### Phase 4: Commission and Payout Ledger

Replace manual-only financial tracking with a ledger.

Recommended tables:

- `CommissionPolicy`
- `CommissionLedger`
- `PayoutRequest`

Rules:

- Admin defines commission type: fixed, percent, tiered, manual.
- Commission generated when lead converts to paid work or reaches approved status.
- Payout request can move through requested, approved, paid, rejected.
- Manual edits should create audit entries.

Deliverables:

- `docs/COMMISSION_POLICY.md`
- Admin commission policy UI
- Agent/partner earnings dashboard
- Immutable ledger view

### Phase 5: Career and HR Pipeline Upgrade

Extend current opportunity/applicant models or add new pipeline tables.

Recommended additions:

- Application source fields
- Candidate category
- Assigned HR partner
- Stage history
- Interview/task notes
- Public application type selector

Capabilities:

- HR partner sees assigned candidates.
- Admin sees all candidates by category/stage/source.
- Existing career page remains usable.

Deliverables:

- Admin worker/career board
- HR partner dashboard
- Applicant sheet/email status tracking

### Phase 6: Forms and Integrations Overview

Unify all public form submissions.

Recommended approach:

- Add a shared `SubmissionEvent` or integration log table.
- Track form type: inquiry, applicant, partner onboarding, referral lead.
- Store email/sheet status for each.
- Add admin integration overview with retry where feasible.

Deliverables:

- Admin "Form & Integrations" overview
- Sheet sync expansion
- Email notification expansion

### Phase 7: Testing, Migration, and Production Hardening

Deliverables:

- `docs/DATABASE_CHANGES.md`
- `docs/MIGRATION_GUIDE.md`
- `docs/ADMIN_GUIDE.md`
- `docs/PARTNER_ONBOARDING.md`
- `docs/SECURITY_REVIEW.md`
- `docs/TEST_REPORT.md`

Validation:

- `npm run build`
- Prisma generate
- Prisma migration validation
- Admin role login smoke tests
- Public form smoke tests
- Agent/partner data isolation tests
- Commission/payout ledger tests

## 15. Files Expected to Change During Implementation

Likely backend files:

- `backend/prisma/schema.prisma`
- New Prisma migration folder(s)
- `backend/routes/admin.routes.js`
- `backend/routes/public.routes.js`
- `backend/routes/inquiry.routes.js`
- `backend/controllers/applicant.controller.js`
- `backend/controllers/inquiry.controller.js`
- `backend/services/mail.service.js`
- `backend/services/sheet.service.js`
- `backend/middleware/admin-auth.middleware.js`
- New permission/role helper files under `backend/`

Likely admin UI files:

- `backend/admin-ui/src/App.tsx`
- Possibly split future admin modules if the file becomes too risky to maintain

Likely frontend files:

- `src/pages/Career.tsx`
- `src/components/CareerHero.tsx`
- `src/components/TalentApplicationForm.tsx`
- `src/components/ServiceInquiryForm.tsx`
- New referral tracking utility under `src/utils/`

Likely docs:

- `docs/ROLE_PERMISSION_MATRIX.md`
- `docs/AFFILIATE_FLOW.md`
- `docs/ACQUISITION_PARTNER_FLOW.md`
- `docs/HR_PARTNER_FLOW.md`
- `docs/COMMISSION_POLICY.md`
- `docs/REFERRAL_ATTRIBUTION.md`
- `docs/DATABASE_CHANGES.md`
- `docs/MIGRATION_GUIDE.md`
- `docs/ADMIN_GUIDE.md`
- `docs/PARTNER_ONBOARDING.md`
- `docs/SECURITY_REVIEW.md`
- `docs/TEST_REPORT.md`

## 16. Minimum Safe First Implementation Slice

The first coding slice should be small enough to deploy safely:

1. Centralize role names and permissions.
2. Add new role names while keeping existing `agent` and `partner` valid.
3. Add profile fields/tables for partner type and category.
4. Restrict agents/partners from viewing unrelated applicant/project data.
5. Add admin UI filters for partner type and worker category.
6. Add docs for permissions and migration.
7. Run build and Prisma checks before any push.

This slice gives visible admin value without immediately touching commission math.

## 17. Do Not Do Yet

Avoid these until the foundation is in place:

- Do not replace the existing app.
- Do not rename existing public routes.
- Do not remove current admin/agent/partner logins.
- Do not rewrite the admin UI from scratch.
- Do not change existing `ClientWork` behavior without a migration plan.
- Do not store payout bank details without a clear security policy.
- Do not rely on Railway local uploads for production-critical documents.
- Do not push until explicitly authorized.
