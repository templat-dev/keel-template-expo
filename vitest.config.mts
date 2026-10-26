import path from 'node:path'
import { defineConfig } from 'vitest/config'

// 単体テストの対象は、react-native を import しない純粋なロジックだけ（*.test.ts）。
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node'
  },
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') }
  }
})
