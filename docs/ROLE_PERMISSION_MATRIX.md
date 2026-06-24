# MistHustlers Role Permission Matrix

Date: 2026-06-24  
Status: Phase 1 foundation complete; production migration and automated authorization tests pending

## Supported Roles

Role | Purpose | Notes
--- | --- | ---
`admin` | Owner/admin dashboard | Full access
`agent` | Brings client leads | Existing role, preserved
`partner` | Legacy delivery partner | Kept for existing accounts; treated like `delivery_partner`
`delivery_partner` | Completes assigned client work | New explicit partner type
`hr_partner` | Handles worker/career pipeline | New explicit partner type
`acquisition_partner` | Brings client leads as partner | New explicit partner type
`affiliate_partner` | Referral/affiliate lead source | New explicit partner type

## Permission Matrix

Area | Admin | Agent | Delivery Partner | HR Partner | Acquisition Partner | Affiliate Partner
--- | --- | --- | --- | --- | --- | ---
Dashboard overview | Full | Own/limited | Own assigned work | Career/workers | Own/limited | Own/limited
Create accounts | Yes | No | No | No | No | No
Manage CMS/content | Yes | No | No | No | No | No
Manage media/uploads | Yes | No | No | No | No | No
View leads/inquiries | All | Own `ownerId` | No | Assigned HR only if routed | Own `ownerId`/`acquisitionPartnerId` | Own `affiliatePartnerId`, masked
Update leads/inquiries | Yes | Own only | No | No | Own only | No
Create client work | Yes | Own lead | No | No | Own lead | No
View client work | All | Own `agentId` | Own `partnerId`/`deliveryPartnerId` | No | Own `acquisitionPartnerId` | Own `affiliatePartnerId`, masked
Update client work | Full | Own status/notes | Own delivery/status | No | Own status/notes | No
Record payments | Yes | No | No | No | No | No
View projects | All | No | Own `deliveryPartnerId` only | No | No | No
Update projects | Yes | No | Status only currently | No | No | No
View opportunities | All | No | No | Read only | No | No
Update opportunities | Yes | No | No | No | No | No
View applicants | All | No | No | Own `assignedHrId` only | No | No
Update applicants | Yes | No | No | Own `assignedHrId` stage/notes/status only | No | No
Delete records | Yes | No | No | No | No | No
Bin restore/delete | Yes | No | No | No | No | No

## Known Phase 1 Limitations

- Ownership scoping is enforced on backend routes for leads, applicants, projects, and client work.
- Existing historical rows with no owner/assignment will not appear to non-admin users until admin assigns ownership.
- Commission and payout values are still stored on `ClientWork` and `WorkPayment`; a formal ledger is still pending.
- Referral database foundation exists, but public referral-link capture, cookie attribution and conversion flow are not implemented yet.

## Required Next Hardening

1. Implement public referral-link capture and 60-day attribution.
2. Add automatic referral-code generation and affiliate dashboard.
3. Add commission policy and immutable commission ledger.
4. Add payout request, approval and payment workflow.
5. Add automated route-level permission tests.
6. Add admin ownership-assignment UI for historical records.
