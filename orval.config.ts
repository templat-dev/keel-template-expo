import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: './src/api/openapi.yaml',
    output: {
      target: './src/api/generated/index.ts',
      schemas: './src/api/generated/model',
      client: 'react-query',
      httpClient: 'fetch',
      override: {
        fetch: {
          // 既定では { data, status, headers } で返る。画面では data だけを使うので外す
          includeHttpResponseReturnType: false
        },
        mutator: {
          path: './src/api/mutator.ts',
          name: 'customFetch'
        }
      }
    }
  },
  // 接続先が 2 つあるので、契約・出力・mutator を分ける（認証を付けるのは、こちらだけ）
  auth: {
    input: './src/api/openapi-auth.yaml',
    output: {
      target: './src/api/generated/auth/index.ts',
      schemas: './src/api/generated/auth/model',
      client: 'react-query',
      httpClient: 'fetch',
      override: {
        fetch: { includeHttpResponseReturnType: false },
        mutator: {
          path: './src/api/mutator.ts',
          name: 'authFetch'
        }
      }
    }
  }
})
