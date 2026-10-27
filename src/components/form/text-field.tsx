import { type KeyboardTypeOptions, Text, TextInput, View } from 'react-native'

export function TextField({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  multiline,
  secureTextEntry,
  autoCapitalize,
  keyboardType,
  testID
}: {
  label: string
  value: string
  onChangeText: (text: string) => void
  onBlur?: () => void
  error?: string
  multiline?: boolean
  secureTextEntry?: boolean
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  keyboardType?: KeyboardTypeOptions
  testID?: string
}) {
  return (
    <View className='gap-1'>
      <Text className='text-ink'>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        // 複数行は上から書き始める（className では指定できない）
        style={multiline ? { textAlignVertical: 'top' } : undefined}
        className={`rounded-lg border p-2.5 text-ink ${
          error ? 'border-danger' : 'border-line'
        } ${multiline ? 'min-h-[120px]' : ''}`}
      />
      {error ? <Text className='text-danger'>{error}</Text> : null}
    </View>
  )
}
