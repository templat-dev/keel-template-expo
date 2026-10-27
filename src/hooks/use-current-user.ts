import { useGetMe } from '@/api/generated/auth'

// ログイン中のユーザー。ホームの挨拶と設定のアカウントの 2 つの feature で使うので、共通の hooks に置く。
// ログイン応答と起動時の確認がキャッシュに入れるので、あとから再取得しない（staleTime: Infinity）。
export function useCurrentUser() {
  return useGetMe({ query: { staleTime: Infinity } })
}
