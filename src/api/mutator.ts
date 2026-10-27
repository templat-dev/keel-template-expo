// Orval が生成した API 呼び出しの共通の入口。通信は標準の fetch で行う。
import { Platform } from 'react-native'
import { getDefaultStore } from 'jotai'

import { authAtom, resetAuth } from './auth-state'
import { API_BASE_URL } from '@/constants'

export class ApiError<Body = unknown> extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body?: Body
  ) {
    super(message)
  }
}

// 接続先は 1 つ（認証もメモも同じ DummyJSON）。トークンを発行した接続先にしか送らない。
export async function customFetch<T>(
  url: string,
  options: RequestInit
): Promise<T> {
  const init: RequestInit = { ...options }
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

  const response = await fetch(`${API_BASE_URL}${url}`, init)
  if (response.status === 401) {
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

// react-query のエラーの型を上書きする（Orval の規約）。画面では error.message を使える。
export type ErrorType<Body> = ApiError<Body>
