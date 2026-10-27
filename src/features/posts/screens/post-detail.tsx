import { Stack } from 'expo-router'
import { ScrollView, Text } from 'react-native'

import { useGetPost } from '@/api/generated'
import { Screen } from '@/components/layout/screen'
import { ErrorView } from '@/components/screen-state/error-view'
import { Loading } from '@/components/screen-state/loading'

export function PostDetail({ postId }: { postId: number }) {
  const { data, isPending, error, refetch } = useGetPost(postId)

  if (isPending) return <Loading />
  if (error) return <ErrorView message={error.message} onRetry={refetch} />

  return (
    <Screen>
      <ScrollView contentContainerClassName='gap-3 p-4'>
        <Stack.Screen options={{ title: data.title }} />
        <Text className='text-xl font-bold text-neutral-900 dark:text-neutral-100'>
          {data.title}
        </Text>
        <Text className='text-neutral-900 dark:text-neutral-100'>
          {data.body}
        </Text>
      </ScrollView>
    </Screen>
  )
}
