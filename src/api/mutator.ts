// Orval が生成した API 呼び出しの共通の入口。通信は標準の fetch で行う。
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

export const customFetch = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${url}`, options)
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
