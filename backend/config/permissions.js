import { ROLES, normalizeRole } from "./roles.js";

export function adminId(req) {
  return Number(req.admin?.id || 0);
}

export function currentRole(req) {
  return normalizeRole(req.admin?.role);
}

export function isAdmin(req) {
  return currentRole(req) === ROLES.ADMIN;
}

export function isLeadRole(req) {
  return [ROLES.AGENT, ROLES.ACQUISITION_PARTNER].includes(currentRole(req));
}

export function isAffiliate(req) {
  return currentRole(req) === ROLES.AFFILIATE_PARTNER;
}

export function isHr(req) {
  return currentRole(req) === ROLES.HR_PARTNER;
}

export function isDeliveryPartner(req) {
  return currentRole(req) === ROLES.DELIVERY_PARTNER;
}

export function inquiryWhereFor(req) {
  if (isAdmin(req)) return {};
  const id = adminId(req);
  if (currentRole(req) === ROLES.AGENT) {
    return { ownerId: id };
  }
  if (currentRole(req) === ROLES.ACQUISITION_PARTNER) {
    return { OR: [{ ownerId: id }, { acquisitionPartnerId: id }] };
  }
  if (isAffiliate(req)) {
    return { affiliatePartnerId: id };
  }
  if (isHr(req)) {
    return { assignedHrId: id };
  }
  return { id: -1 };
}

export function applicantWhereFor(req) {
  if (isAdmin(req)) return {};
  if (isHr(req)) return { assignedHrId: adminId(req) };
  return { id: -1 };
}

export function projectWhereFor(req) {
  if (isAdmin(req)) return {};
  if (isDeliveryPartner(req)) {
    return { deliveryPartnerId: adminId(req) };
  }
  return { id: -1 };
}

export function workWhereFor(req) {
  if (isAdmin(req)) return {};
  const id = adminId(req);
  if (currentRole(req) === ROLES.AGENT) return { agentId: id };
  if (currentRole(req) === ROLES.ACQUISITION_PARTNER) return { acquisitionPartnerId: id };
  if (isAffiliate(req)) return { affiliatePartnerId: id };
  if (isDeliveryPartner(req)) return { OR: [{ deliveryPartnerId: id }, { partnerId: id }] };
  return { id: -1 };
}

export function canAccessInquiry(req, inquiry) {
  if (isAdmin(req)) return true;
  const id = adminId(req);
  if (currentRole(req) === ROLES.AGENT) return inquiry.ownerId === id;
  if (currentRole(req) === ROLES.ACQUISITION_PARTNER) return inquiry.ownerId === id || inquiry.acquisitionPartnerId === id;
  if (isAffiliate(req)) return inquiry.affiliatePartnerId === id;
  if (isHr(req)) return inquiry.assignedHrId === id;
  return false;
}

export function canEditInquiry(req, inquiry) {
  if (isAdmin(req)) return true;
  if (isAffiliate(req)) return false;
  return canAccessInquiry(req, inquiry);
}

export function canAccessApplicant(req, applicant) {
  if (isAdmin(req)) return true;
  return isHr(req) && applicant.assignedHrId === adminId(req);
}

export function canAccessProject(req, project) {
  if (isAdmin(req)) return true;
  if (isDeliveryPartner(req)) return project.deliveryPartnerId === adminId(req);
  return false;
}

export function canAccessWork(req, work) {
  if (isAdmin(req)) return true;
  const id = adminId(req);
  if (currentRole(req) === ROLES.AGENT) return work.agentId === id;
  if (currentRole(req) === ROLES.ACQUISITION_PARTNER) return work.acquisitionPartnerId === id;
  if (isAffiliate(req)) return work.affiliatePartnerId === id;
  if (isDeliveryPartner(req)) return work.deliveryPartnerId === id || work.partnerId === id;
  return false;
}

export function sanitizeInquiryForRole(req, inquiry) {
  if (!isAffiliate(req)) return inquiry;
  return {
    id: inquiry.id,
    service: inquiry.service,
    budget: inquiry.budget,
    status: inquiry.status,
    leadSource: inquiry.leadSource,
    createdAt: inquiry.createdAt,
    updatedAt: inquiry.updatedAt,
  };
}

export function sanitizeWorkForRole(req, work) {
  if (!isAffiliate(req)) return work;
  return {
    id: work.id,
    service: work.service,
    status: work.status,
    affiliatePartnerId: work.affiliatePartnerId,
    createdAt: work.createdAt,
    updatedAt: work.updatedAt,
  };
}
