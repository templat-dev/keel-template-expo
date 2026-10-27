// 姓名を 1 つの表示用の文字列にする。名・姓の順で、半角スペースで区切る。
// どちらかが空なら、残りだけを返す（前後の空白は取る）。
export function formatFullName(firstName: string, lastName: string): string {
  return [firstName, lastName]
    .map((name) => name.trim())
    .filter((name) => name !== '')
    .join(' ')
}
