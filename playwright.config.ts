import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  expect: {
    timeout: 5000,
  },
  reporter: process.env.CI ? "github" : "list",
  testDir: "./apps/web/e2e",
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm --filter @ai-hooks/web dev",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    url: "http://127.0.0.1:3100",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
