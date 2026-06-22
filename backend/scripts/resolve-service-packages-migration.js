import { spawnSync } from "node:child_process";

const migrationName = "20260622090000_service_packages_content";
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

const result = spawnSync(
  npx,
  ["prisma", "migrate", "resolve", "--rolled-back", migrationName],
  { stdio: "inherit" },
);

if (result.status === 0) {
  console.log(`[migrate] Marked ${migrationName} as rolled back.`);
} else {
  console.log(`[migrate] ${migrationName} did not need rollback resolution.`);
}
