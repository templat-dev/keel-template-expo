import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'

import { useTheme } from '@/hooks/use-theme'

// ヘッダーの戻るボタン。iOS 26 以降の標準の戻るボタンは Liquid Glass で描かれ、長押しで遷移元（(tabs) など）のメニューが出る。
// Android と同じ見た目・動きにするため、ルートの Stack の headerLeft に使う。
export function BackButton() {
  const router = useRouter()
  const { colors } = useTheme()

  return (
    <Pressable
      accessibilityRole='button'
      accessibilityLabel='戻る'
      hitSlop={8}
      onPress={() => router.back()}
    >
      <Ionicons name='arrow-back' size={24} color={colors.text} />
    </Pressable>
  )
}
