import type { ReactNode } from 'react'
import { View } from 'react-native'

// 画面の内容の最大幅。Web で広げたときに、一覧や入力欄が横へ伸びきらないようにし、中央に寄せる。
// 幅に応じて sm: → md: → lg: で広げる（ネイティブでも、タブレットでは効く）。
export const CONTENT_WIDTH =
  'w-full max-w-md self-center sm:max-w-xl md:max-w-2xl lg:max-w-3xl'

export function Content({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  return <View className={`${CONTENT_WIDTH} ${className}`}>{children}</View>
}
