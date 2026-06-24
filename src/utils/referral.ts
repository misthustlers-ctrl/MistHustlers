const STORAGE_KEY = "mh_referral_code";
const COOKIE_KEY = "mh_ref";
const ATTRIBUTION_DAYS = 60;

function cleanReferralCode(value: string | null | undefined) {
  return (value || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);
}

function setReferralCookie(code: string) {
  const maxAge = ATTRIBUTION_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(code)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

function getReferralCookie() {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_KEY}=([^;]*)`));
  return match ? cleanReferralCode(decodeURIComponent(match[1])) : "";
}

export function captureReferralFromUrl(search = window.location.search) {
  const params = new URLSearchParams(search);
  const code = cleanReferralCode(params.get("ref"));
  if (!code || code.length < 4) return "";

  localStorage.setItem(STORAGE_KEY, code);
  setReferralCookie(code);
  return code;
}

export function getStoredReferralCode() {
  return cleanReferralCode(localStorage.getItem(STORAGE_KEY)) || getReferralCookie();
}

export function clearStoredReferralCode() {
  localStorage.removeItem(STORAGE_KEY);
  document.cookie = `${COOKIE_KEY}=; Max-Age=0; Path=/; SameSite=Lax`;
}
