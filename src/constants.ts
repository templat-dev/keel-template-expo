// 環境変数は、ここで 1 か所だけ読む（process.env.EXPO_PUBLIC_XXX は静的に書く）。
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? ''
export const AUTH_API_BASE_URL = process.env.EXPO_PUBLIC_AUTH_API_BASE_URL ?? ''

// 未設定だと相対 URL で自分の開発サーバーに fetch してしまうので、起動時に止める。
if (!API_BASE_URL) {
  throw new Error(
    'EXPO_PUBLIC_API_BASE_URL が未設定です。.env.example を .env.local にコピーしてください。'
  )
}
if (!AUTH_API_BASE_URL) {
  throw new Error(
    'EXPO_PUBLIC_AUTH_API_BASE_URL が未設定です。.env.example を .env.local にコピーしてください。'
  )
}
