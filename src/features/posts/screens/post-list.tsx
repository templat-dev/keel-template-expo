import { Link } from 'expo-router'
import { useState } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'

import { useListPosts } from '@/api/generated'
import type { Post } from '@/api/generated/model'
import { EmptyView } from '@/components/empty-view'
import { ErrorView } from '@/components/error-view'
import { Loading } from '@/components/loading'
import { useDisplayName } from '@/hooks/use-display-name'

const USER_FILTERS = [undefined, 1, 2, 3]

export function PostList() {
  const [userId, setUserId] = useState<number | undefined>(undefined)
  const [displayName] = useDisplayName()
  const { data, isPending, error, refetch } = useListPosts(
    userId === undefined ? undefined : { userId }
  )

  return (
    <View className='flex-1'>
      <View className='flex-row justify-between p-4'>
        <Text className='text-neutral-900 dark:text-neutral-100'>
          {displayName ? `${displayName} さん、こんにちは` : 'こんにちは'}
        </Text>
        <Link href='/posts/new' className='text-sky-700 dark:text-sky-400'>
          投稿する
        </Link>
      </View>
      <View className='flex-row gap-2 px-4 pb-2'>
        {USER_FILTERS.map((id) => {
          const selected = userId === id
          return (
            <Pressable
              key={id ?? 'all'}
              accessibilityRole='button'
              onPress={() => setUserId(id)}
              className={`rounded-full border px-3 py-1 ${
                selected
                  ? 'border-sky-700 bg-sky-700 dark:border-sky-400 dark:bg-sky-400'
                  : 'border-neutral-300 dark:border-neutral-700'
              }`}
            >
              <Text
                className={
                  selected
                    ? 'text-white dark:text-neutral-900'
                    : 'text-neutral-900 dark:text-neutral-100'
                }
              >
                {id === undefined ? 'すべて' : `ユーザー ${id}`}
              </Text>
            </Pressable>
          )
        })}
      </View>
      <PostListBody
        isPending={isPending}
        error={error}
        data={data}
        onRetry={refetch}
      />
    </View>
  )
}

function PostListBody({
  isPending,
  error,
  data,
  onRetry
}: {
  isPending: boolean
  error: Error | null
  data: Post[] | undefined
  onRetry: () => void
}) {
  if (isPending) return <Loading />
  if (error) return <ErrorView message={error.message} onRetry={onRetry} />
  if (!data || data.length === 0)
    return <EmptyView message='投稿がありません' />

  return (
    <FlatList
      data={data}
      keyExtractor={(post) => String(post.id)}
      renderItem={({ item }) => (
        <Link
          href={{ pathname: '/posts/[id]', params: { id: String(item.id) } }}
          className='border-b border-neutral-200 p-4 text-neutral-900 dark:border-neutral-800 dark:text-neutral-100'
        >
          {item.title}
        </Link>
      )}
    />
  )
}
