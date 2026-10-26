import { useColorScheme } from 'react-native'

import { darkColors, lightColors } from '@/theme'

export function useTheme() {
  return useColorScheme() === 'dark' ? darkColors : lightColors
}
