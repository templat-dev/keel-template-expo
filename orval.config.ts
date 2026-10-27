import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: './src/api/openapi.yaml',
    output: {
      target: './src/api/generated/index.ts',
      // 契約から無くなった操作の出力（古いファイル）を消す。既定では残る
      clean: true,
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
