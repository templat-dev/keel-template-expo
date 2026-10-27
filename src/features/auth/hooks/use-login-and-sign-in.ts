import { useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { Platform } from 'react-native'

import { authAtom } from '@/api/auth-state'
import { getGetMeQueryKey, useLogin } from '@/api/generated'
import * as tokenStorage from '@/api/token-storage'

// ログインに成功したら、トークンの保存・認証状態の更新・ユーザーのキャッシュを行う。
export function useLoginAndSignIn() {
  const queryClient = useQueryClient()
  const setAuth = useSetAtom(authAtom)
  return useLogin({
    mutation: {
      onSuccess: async ({
        accessToken,
        refreshToken: _refreshToken,
        ...user
      }) => {
        // 401 で戻されたあとは、ログアウトを通っていない。前のユーザーのキャッシュを残さない
        queryClient.clear()
        // ログイン応答のユーザーを入れておけば、ホームが続けて /auth/me を呼ばなくて済む
        queryClient.setQueryData(getGetMeQueryKey(), user)
        await tokenStorage.set(accessToken)
        // Web は、トークンを Cookie（サーバー）が持つので、フロントでは持たない
        setAuth({
          status: 'authenticated',
          token: Platform.OS === 'web' ? null : accessToken
        })
      }
    }
  })
}
