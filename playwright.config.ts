import { defineConfig, devices } from '@playwright/test'

// 開発サーバー（8081）とは別のポートで起動する。同じポートだと、起動済みの開発サーバー
// （接続先が実 API）を再利用してしまい、API の差し替えが効かない。
const PORT = 8090

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Expo の Web 開発サーバーを起動してから実行する。API は e2e 側で差し替えるので、
  // 接続先は実在しないホストにしておく（実物には届かない）。
  webServer: {
    command: `npx expo start --web --clear --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    // .env.local があると、その値が優先される（e2e 側で接続先に依存しないようにしてある）。
    env: { EXPO_PUBLIC_API_BASE_URL: 'http://api.test', CI: '1' },
    timeout: 120_000
  }
})
