// Web: トークンはサーバーが httpOnly Cookie で持つので、フロントは何も保存しない。
// 関数の形は token-storage.ts（ネイティブ）と同じ。
export async function get(): Promise<string | null> {
  return null
}

export async function set(token: string): Promise<void> {
  void token
}

export async function clear(): Promise<void> {}
