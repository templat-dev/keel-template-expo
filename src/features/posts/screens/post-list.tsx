import { Link } from 'expo-router'
import { useState } from 'react'
import { FlatList, Pressable, Text } from 'react-native'

import { useSearchPosts } from '@/api/generated'
import type { PostList as PostListData } from '@/api/generated/model'
import { EmptyView } from '@/components/screen-state/empty-view'
import { ErrorView } from '@/components/screen-state/error-view'
import { Content, CONTENT_WIDTH } from '@/components/layout/content'
import { Screen } from '@/components/layout/screen'
import { Loading } from '@/components/screen-state/loading'

import { PostListHeader } from '../components/post-list-header'

// 絞り込みのキーワード（undefined はすべて）
const KEYWORDS = [undefined, 'love', 'history', 'night']

export function PostList() {
  const [keyword, setKeyword] = useState<string | undefined>(undefined)
  const { data, isPending, error, refetch } = useSearchPosts(
    keyword === undefined ? undefined : { q: keyword }
  )

  return (
    <Screen>
      <Content>
        <PostListHeader />
      </Content>
      <Content className='flex-row gap-2 px-4 pb-2'>
        {KEYWORDS.map((word) => {
          const selected = keyword === word
          return (
            <Pressable
              key={word ?? 'all'}
              accessibilityRole='button'
              onPress={() => setKeyword(word)}
              className={`rounded-full border px-3 py-1 ${
                selected ? 'border-primary bg-primary' : 'border-line'
              }`}
            >
              <Text className={selected ? 'text-on-primary' : 'text-ink'}>
                {word === undefined ? 'すべて' : word}
              </Text>
            </Pressable>
          )
        })}
      </Content>
      <PostListBody
        isPending={isPending}
        error={error}
        data={data}
        onRetry={refetch}
      />
    </Screen>
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
  data: PostListData | undefined
  onRetry: () => void
}) {
  if (isPending) return <Loading />
  if (error) return <ErrorView message={error.message} onRetry={onRetry} />
  if (!data || data.posts.length === 0)
    return <EmptyView message='投稿がありません' />

  return (
    <FlatList
      data={data.posts}
      keyExtractor={(post) => String(post.id)}
      renderItem={({ item }) => (
        <Link
          href={{ pathname: '/posts/[id]', params: { id: String(item.id) } }}
          asChild
        >
          <Pressable
            accessibilityRole='link'
            className={`border-b border-line-soft p-4 ${CONTENT_WIDTH}`}
          >
            <Text className='text-ink'>{item.title}</Text>
          </Pressable>
        </Link>
      )}
    />
  )
}
