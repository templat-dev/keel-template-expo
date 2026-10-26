import { ActivityIndicator, StyleSheet, View } from 'react-native'

import { useTheme } from '@/hooks/use-theme'

export function Loading() {
  const colors = useTheme()
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' }
})
