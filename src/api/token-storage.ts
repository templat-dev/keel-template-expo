// ネイティブ: 認証トークンを expo-secure-store（iOS は Keychain、Android は Keystore）に保存する。
// Web 用は token-storage.web.ts（関数の形は同じ）。
import * as SecureStore from 'expo-secure-store'

const KEY = 'accessToken'

// 保存・読み出しは失敗しうる（端末の状態による）。失敗は未保存として扱う。
export async function get(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(KEY)
  } catch {
    return null
  }
}

export async function set(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEY, token)
  } catch {
    // 保存できなくても、このセッションの間は atom のトークンで動く（次の起動でログインし直す）
  }
}

export async function clear(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(KEY)
  } catch {
    // 消せなくても、atom は未ログインに戻っている
  }
}
