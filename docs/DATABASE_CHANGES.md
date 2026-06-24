# Database Changes

Date: 2026-06-24

Status: Phase 1 foundation complete; production migration and automated authorization tests pending

Migration added:

- `backend/prisma/migrations/20260624143000_role_ownership_permissions/migration.sql`

## Additive Columns

`Inquiry`

- `owner_id`
- `acquisition_partner_id`
- `affiliate_partner_id`
- `assigned_hr_id`
- `lead_source`

`Applicant`

- `assigned_hr_id`
- `position_id`
- `application_type`
- `current_stage`

`Project`

- `acquisition_partner_id`
- `delivery_partner_id`
- `affiliate_partner_id`
- `assigned_hr_id`

`ClientWork`

- `inquiry_id`
- `acquisition_partner_id`
- `delivery_partner_id`
- `affiliate_partner_id`
- `assigned_hr_id`

## New Tables

- `partner_profiles`
- `referral_codes`
- `referral_events`
- `referral_attributions`

All changes are additive and nullable where they touch existing production records.

## Deployment Checks Still Required

- Back up the production database before applying the migration.
- Apply the migration first on local/staging PostgreSQL.
- Run `npx prisma migrate deploy`.
- Run `npx prisma migrate status`.
- Assign ownership for historical rows where ownership fields are `null`.
- Verify every role gets `403` when opening unauthorized record IDs.
- Run the full production build again after migration apply.
