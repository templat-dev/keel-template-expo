import { Text, TextInput, View } from 'react-native'

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
  return (
    <View className='gap-1'>
      <Text className='text-neutral-900 dark:text-neutral-100'>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        multiline={multiline}
        // 複数行は上から書き始める（className では指定できない）
        style={multiline ? { textAlignVertical: 'top' } : undefined}
        className={`rounded-lg border p-2.5 text-neutral-900 dark:text-neutral-100 ${
          error
            ? 'border-red-600'
            : 'border-neutral-300 dark:border-neutral-700'
        } ${multiline ? 'min-h-[120px]' : ''}`}
      />
      {error ? (
        <Text className='text-red-600 dark:text-red-400'>{error}</Text>
      ) : null}
    </View>
  )
}
