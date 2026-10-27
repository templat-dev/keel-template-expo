import { ActivityIndicator, View } from 'react-native'

import { useTheme } from '@/hooks/use-theme'

export function Loading() {
  const { colors } = useTheme()
  return (
    <View className='flex-1 items-center justify-center'>
      <ActivityIndicator color={colors.primary} />
    </View>
  )
}
