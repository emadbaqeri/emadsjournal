import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  reporter: 'list',
  projects: [
    {
      name: 'models',
      testMatch: '**/*.spec.ts',
    },
  ],
});
