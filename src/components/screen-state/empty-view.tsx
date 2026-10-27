import { Text, View } from 'react-native'

export function EmptyView({ message }: { message: string }) {
  return (
    <View className='flex-1 items-center justify-center'>
      <Text className='text-ink-muted'>{message}</Text>
    </View>
  )
}
