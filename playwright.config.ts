import { defineConfig, devices } from '@playwright/test'

const PORT = 8081

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Expo の Web 開発サーバーを起動してから実行する。API は e2e 側で差し替えるので、
  // 接続先は実在しないホストにしておく（実物には届かない）。
  webServer: {
    command: `npx expo start --web --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    env: { EXPO_PUBLIC_API_BASE_URL: 'http://api.test', CI: '1' },
    timeout: 120_000
  }
})
