import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    globals: true,
    clearMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["cobertura", "text-summary"],
      reportsDirectory: "coverage",
      include: ["src/utils/auditEngine.ts"],
    },
  },
});
