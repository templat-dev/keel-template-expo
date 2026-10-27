import { useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { Platform } from 'react-native'

import { authAtom } from '@/api/auth-state'
import { getGetMeQueryKey, getMe } from '@/api/generated/auth'
import * as tokenStorage from '@/api/token-storage'

// 起動時に、認証状態を復元する。済むまで状態は loading で、ルートの _layout は画面を描かない。
// - ネイティブ: expo-secure-store からトークンを読む
// - Web: トークンはフロントにないので、/auth/me で、Cookie でログイン済みかを確かめる
export function useRestoreAuth() {
  const queryClient = useQueryClient()
  const setAuth = useSetAtom(authAtom)

  useEffect(() => {
    let cancelled = false
    async function restore() {
      if (Platform.OS === 'web') {
        try {
          const user = await getMe()
          queryClient.setQueryData(getGetMeQueryKey(), user)
          if (!cancelled) setAuth({ status: 'authenticated', token: null })
        } catch {
          // 401 は mutator が未ログインに戻すが、通信の失敗でも先へ進めるよう、ここでも戻す
          if (!cancelled) setAuth({ status: 'unauthenticated' })
        }
        return
      }
      const token = await tokenStorage.get()
      if (cancelled) return
      setAuth(
        token
          ? { status: 'authenticated', token }
          : { status: 'unauthenticated' }
      )
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [queryClient, setAuth])
}
