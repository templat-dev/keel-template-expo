import { Text, View } from 'react-native'

export function EmptyView({ message }: { message: string }) {
  return (
    <View className='flex-1 items-center justify-center'>
      <Text className='text-neutral-500 dark:text-neutral-400'>{message}</Text>
    </View>
  )
}
