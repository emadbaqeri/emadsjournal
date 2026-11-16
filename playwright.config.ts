import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  reporter: 'list',
  projects: [
    {
      name: 'unit',
      testMatch: '**/*.spec.ts',
      testIgnore: '**/e2e/**',
    },
    {
      name: 'e2e',
      testMatch: '**/e2e/**/*.spec.ts',
      use: {
        baseURL: 'http://127.0.0.1:4321',
      },
    },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
