import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { adminAuth, createSessionToken, requireAdmin } from "../middleware/admin-auth.middleware.js";

process.env.ADMIN_USERNAME = "security-test-admin";
process.env.ADMIN_PASSWORD = "security-test-password";
process.env.ADMIN_SESSION_SECRET = "security-test-session-secret-at-least-32-characters";

async function withServer(run) {
  const app = express();
  app.get("/protected", adminAuth, requireAdmin, (_req, res) => res.json({ ok: true }));
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise((resolve) => server.close(resolve)); }
}

test("admin route returns 401 without authentication", async () => {
  await withServer(async (url) => assert.equal((await fetch(`${url}/protected`)).status, 401));
});

test("admin route returns 403 for a signed non-admin session", async () => {
  const token = createSessionToken({ id: 4, username: "agent", role: "agent", source: "test" });
  await withServer(async (url) => assert.equal((await fetch(`${url}/protected`, { headers: { Authorization: `Bearer ${token}` } })).status, 403));
});

test("admin route returns 200 for configured owner credentials", async () => {
  const basic = Buffer.from(`${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`).toString("base64");
  await withServer(async (url) => {
    const response = await fetch(`${url}/protected`, { headers: { Authorization: `Basic ${basic}` } });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
  });
});
