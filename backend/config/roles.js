export const ROLES = Object.freeze({
  ADMIN: "admin",
  AGENT: "agent",
  LEGACY_PARTNER: "partner",
  DELIVERY_PARTNER: "delivery_partner",
  HR_PARTNER: "hr_partner",
  ACQUISITION_PARTNER: "acquisition_partner",
  AFFILIATE_PARTNER: "affiliate_partner",
});

export const LOGIN_ROLES = Object.freeze(Object.values(ROLES));

export const ACCOUNT_ROLES = Object.freeze([
  ROLES.AGENT,
  ROLES.LEGACY_PARTNER,
  ROLES.DELIVERY_PARTNER,
  ROLES.HR_PARTNER,
  ROLES.ACQUISITION_PARTNER,
  ROLES.AFFILIATE_PARTNER,
]);

export const ROLE_LABELS = Object.freeze({
  [ROLES.ADMIN]: "Admin",
  [ROLES.AGENT]: "Agent",
  [ROLES.LEGACY_PARTNER]: "Delivery Partner",
  [ROLES.DELIVERY_PARTNER]: "Delivery Partner",
  [ROLES.HR_PARTNER]: "HR Partner",
  [ROLES.ACQUISITION_PARTNER]: "Acquisition Partner",
  [ROLES.AFFILIATE_PARTNER]: "Affiliate Partner",
});

export function normalizeRole(role) {
  return role === ROLES.LEGACY_PARTNER ? ROLES.DELIVERY_PARTNER : role;
}

export function isLoginRole(role) {
  return LOGIN_ROLES.includes(role);
}

export function isAccountRole(role) {
  return ACCOUNT_ROLES.includes(role);
}

export function hasAnyRole(actualRole, allowedRoles) {
  const normalizedActual = normalizeRole(actualRole);
  return allowedRoles.some((role) => normalizeRole(role) === normalizedActual || role === actualRole);
}

