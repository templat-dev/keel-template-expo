import { StyleSheet, Text, View } from 'react-native'

import { useTheme } from '@/hooks/use-theme'

export function EmptyView({ message }: { message: string }) {
  const colors = useTheme()
  return (
    <View style={styles.container}>
      <Text style={{ color: colors.subtext }}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' }
})
