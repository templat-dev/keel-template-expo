import { Pressable, StyleSheet, Text, View } from 'react-native'

import { useTheme } from '@/hooks/use-theme'

export function ErrorView({
  message,
  onRetry
}: {
  message: string
  onRetry?: () => void
}) {
  const colors = useTheme()
  return (
    <View style={styles.container}>
      <Text style={{ color: colors.danger }}>{message}</Text>
      {onRetry ? (
        <Pressable
          accessibilityRole='button'
          onPress={onRetry}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={{ color: colors.onPrimary }}>再試行</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16
  },
  button: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }
})
