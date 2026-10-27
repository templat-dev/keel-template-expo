import { Stack } from 'expo-router'
import { ScrollView, Text } from 'react-native'

import { useGetPost } from '@/api/generated'
import { Content } from '@/components/layout/content'
import { Screen } from '@/components/layout/screen'
import { ErrorView } from '@/components/screen-state/error-view'
import { Loading } from '@/components/screen-state/loading'

export function PostDetail({ postId }: { postId: number }) {
  const { data, isPending, error, refetch } = useGetPost(postId)

  if (isPending) return <Loading />
  if (error) return <ErrorView message={error.message} onRetry={refetch} />

  return (
    <Screen>
      <ScrollView contentContainerClassName='items-center p-4'>
        <Stack.Screen options={{ title: data.title }} />
        <Content className='gap-3'>
          <Text className='text-xl font-bold text-ink'>{data.title}</Text>
          <Text className='text-ink'>{data.body}</Text>
        </Content>
      </ScrollView>
    </Screen>
  )
}
