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
  }
})
