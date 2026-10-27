import { Pressable, Text, View } from 'react-native'

export function ErrorView({
  message,
  onRetry
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <View className='flex-1 items-center justify-center gap-3 p-4'>
      <Text className='text-danger'>{message}</Text>
      {onRetry ? (
        <Pressable
          accessibilityRole='button'
          onPress={onRetry}
          className='rounded-lg bg-primary px-4 py-2'
        >
          <Text className='text-on-primary'>再試行</Text>
        </Pressable>
      ) : null}
    </View>
  )
}
