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
      <Text className='text-red-600 dark:text-red-400'>{message}</Text>
      {onRetry ? (
        <Pressable
          accessibilityRole='button'
          onPress={onRetry}
          className='rounded-lg bg-sky-700 px-4 py-2 dark:bg-sky-400'
        >
          <Text className='text-white dark:text-neutral-900'>再試行</Text>
        </Pressable>
      ) : null}
    </View>
  )
}
