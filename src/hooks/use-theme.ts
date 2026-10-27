import { useColorScheme } from 'react-native'

import { darkColors, lightColors } from '@/theme'

// 端末のライト / ダークに合わせた色（src/theme.ts）を返す。className で書けない場所（JS の色の指定）で使う。
export function useTheme() {
  const isDark = useColorScheme() === 'dark'
  return { isDark, colors: isDark ? darkColors : lightColors }
}
