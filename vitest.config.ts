import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'firefox',
      provider: 'playwright',
      // https://playwright.dev
      providerOptions: {},
      headless: true,
    },
  },
})
