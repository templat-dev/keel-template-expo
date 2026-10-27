import { atom, getDefaultStore } from 'jotai'

import { queryClient } from './query-client'
import * as tokenStorage from './token-storage'

// 認証状態は、メモリ上の atom で持つ（永続化しない）。
// - loading: 起動時の復元が済むまで。この間は画面を描かない
// - authenticated: token はネイティブだけが持つ。Web は Cookie をサーバーが持つので null
export type Auth =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'authenticated'; token: string | null }

export const authAtom = atom<Auth>({ status: 'loading' })

// React の外（mutator）から呼ぶので、既定のストアを使う。
// 401 を受けたとき: 認証状態を未ログインに戻し、保存値も消す。
export async function resetAuth() {
  getDefaultStore().set(authAtom, { status: 'unauthenticated' })
  await tokenStorage.clear()
}

// ログアウト: 認証状態・保存値・TanStack Query のキャッシュを消す。
// キャッシュを消すのは、前のユーザーのデータが次のユーザーに見えないようにするため。
export async function signOut() {
  await resetAuth()
  queryClient.clear()
}
