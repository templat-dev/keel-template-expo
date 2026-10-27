// Orval が生成した API 呼び出しの共通の入口。通信は標準の fetch で行う。
import { Platform } from 'react-native'
import { getDefaultStore } from 'jotai'

import { authAtom, resetAuth } from './auth-state'
import { API_BASE_URL, AUTH_API_BASE_URL } from '@/constants'

export class ApiError<Body = unknown> extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body?: Body
  ) {
    super(message)
  }
}

// withAuth: 認証を付ける接続先か。トークンは、それを発行した接続先にだけ送る（別の接続先へ送ると漏れる）。
async function request<T>(
  baseUrl: string,
  withAuth: boolean,
  url: string,
  options: RequestInit
): Promise<T> {
  const init: RequestInit = { ...options }
  if (withAuth) {
    if (Platform.OS === 'web') {
      // Web は Cookie（httpOnly）で認証する。トークンのヘッダは付けない
      init.credentials = 'include'
    } else {
      const auth = getDefaultStore().get(authAtom)
      if (auth.status === 'authenticated' && auth.token) {
        const headers = new Headers(options.headers)
        headers.set('Authorization', `Bearer ${auth.token}`)
        init.headers = headers
      }
    }
  }

  const response = await fetch(`${baseUrl}${url}`, init)
  if (withAuth && response.status === 401) {
    await resetAuth()
  }
  if (!response.ok) {
    const body = await response.json().catch(() => undefined)
    throw new ApiError(
      response.status,
      `通信に失敗しました（${response.status}）`,
      body
    )
  }
  return (await response.json()) as T
}

// 認証を使わない接続先（サンプルの JSONPlaceholder）
export const customFetch = <T>(url: string, options: RequestInit): Promise<T> =>
  request<T>(API_BASE_URL, false, url, options)

// 認証を使う接続先（サンプルの DummyJSON）
export const authFetch = <T>(url: string, options: RequestInit): Promise<T> =>
  request<T>(AUTH_API_BASE_URL, true, url, options)

// react-query のエラーの型を上書きする（Orval の規約）。画面では error.message を使える。
export type ErrorType<Body> = ApiError<Body>
