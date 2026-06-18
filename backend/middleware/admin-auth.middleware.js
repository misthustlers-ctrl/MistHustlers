import crypto from "crypto";
import prisma from "../prisma/client.js";

const VALID_ROLES = ["admin", "agent", "partner"];
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET is required in production");
  }
  return secret || "development-admin-session-secret";
}

function signPayload(payload) {
  return crypto.createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function createSessionToken(admin) {
  const payload = {
    id: admin.id,
    username: admin.username,
    displayName: admin.displayName || null,
    role: admin.role,
    source: admin.source,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${signPayload(encoded)}`;
}

export function readSessionToken(token) {
  if (!token || !token.includes(".")) return null;
  const [encoded, signature] = token.split(".");
  const expected = signPayload(encoded || "");
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature || "");
  if (!encoded || !signature || expectedBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8"));
    if (!payload.exp || payload.exp < Date.now()) return null;
    if (!VALID_ROLES.includes(payload.role)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const passwordHash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return { salt, passwordHash };
}

export function verifyPassword(password, salt, passwordHash) {
  const attempted = hashPassword(password, salt).passwordHash;
  return crypto.timingSafeEqual(Buffer.from(attempted, "hex"), Buffer.from(passwordHash, "hex"));
}

export async function adminAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (auth?.startsWith("Bearer ")) {
    const payload = readSessionToken(auth.split(" ")[1]);
    if (!payload) return res.status(401).json({ success: false, message: "Session expired. Please login again." });
    if (payload.source === "database") {
      const user = await prisma.adminUser.findUnique({ where: { id: Number(payload.id) } }).catch(() => null);
      if (!user || user.status !== "active" || user.username !== payload.username || user.role !== payload.role) {
        return res.status(401).json({ success: false, message: "Session expired. Please login again." });
      }
    }
    req.admin = {
      id: payload.id,
      username: payload.username,
      displayName: payload.displayName,
      role: payload.role,
      source: payload.source,
    };
    return next();
  }

  if (!auth || !auth.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin"');
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  try {
    const base64 = auth.split(" ")[1];
    const decoded = Buffer.from(base64, "base64").toString("utf-8");
    const [username, password] = decoded.split(":");

    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPass = process.env.ADMIN_PASSWORD;

    if (!expectedUser || !expectedPass) {
      return res.status(500).json({ success: false, message: "Admin credentials not configured" });
    }

    if (username !== expectedUser || password !== expectedPass) {
      const user = await prisma.adminUser.findUnique({ where: { username } }).catch(() => null);
      if (!user || user.status !== "active" || !VALID_ROLES.includes(user.role) || !verifyPassword(password, user.salt, user.passwordHash)) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
      req.admin = { id: user.id, username: user.username, displayName: user.displayName, role: user.role, source: "database" };
      return next();
    }

    req.admin = { id: 0, username, displayName: "Owner Admin", role: "admin", source: "environment" };
    next();
  } catch {
    res.status(400).json({ success: false, message: "Invalid authorization header" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.admin?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
}

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ success: false, message: "You do not have permission for this action" });
    }
    next();
  };
}
