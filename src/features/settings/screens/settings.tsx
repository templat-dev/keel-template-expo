import { ScrollView, StyleSheet } from 'react-native'

import { TextField } from '@/components/text-field'
import { useDisplayName } from '@/hooks/use-display-name'

export function Settings() {
  const [displayName, setDisplayName] = useDisplayName()
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <TextField
        label='表示名'
        testID='display-name'
        value={displayName}
        onChangeText={setDisplayName}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: { padding: 16 }
})
