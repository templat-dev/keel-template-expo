import { StyleSheet, Text, TextInput, View } from 'react-native'

import { useTheme } from '@/hooks/use-theme'

export function TextField({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  multiline,
  testID
}: {
  label: string
  value: string
  onChangeText: (text: string) => void
  onBlur?: () => void
  error?: string
  multiline?: boolean
  testID?: string
}) {
  const colors = useTheme()
  return (
    <View style={styles.container}>
      <Text style={{ color: colors.text }}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        multiline={multiline}
        style={[
          styles.input,
          multiline ? styles.multiline : null,
          {
            borderColor: error ? colors.danger : colors.border,
            color: colors.text
          }
        ]}
      />
      {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 4 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10 },
  multiline: { minHeight: 120, textAlignVertical: 'top' }
})
