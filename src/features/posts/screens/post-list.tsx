import { Link } from 'expo-router'
import { useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'

import { useListPosts } from '@/api/generated'
import type { Post } from '@/api/generated/model'
import { EmptyView } from '@/components/empty-view'
import { ErrorView } from '@/components/error-view'
import { Loading } from '@/components/loading'
import { useDisplayName } from '@/hooks/use-display-name'
import { useTheme } from '@/hooks/use-theme'

const USER_FILTERS = [undefined, 1, 2, 3]

export function PostList() {
  const colors = useTheme()
  const [userId, setUserId] = useState<number | undefined>(undefined)
  const [displayName] = useDisplayName()
  const { data, isPending, error, refetch } = useListPosts(
    userId === undefined ? undefined : { userId }
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ color: colors.text }}>
          {displayName ? `${displayName} さん、こんにちは` : 'こんにちは'}
        </Text>
        <Link href='/posts/new' style={{ color: colors.primary }}>
          投稿する
        </Link>
      </View>
      <View style={styles.filters}>
        {USER_FILTERS.map((id) => (
          <Pressable
            key={id ?? 'all'}
            accessibilityRole='button'
            onPress={() => setUserId(id)}
            style={[
              styles.chip,
              { borderColor: colors.border },
              userId === id ? { backgroundColor: colors.primary } : null
            ]}
          >
            <Text
              style={{ color: userId === id ? colors.onPrimary : colors.text }}
            >
              {id === undefined ? 'すべて' : `ユーザー ${id}`}
            </Text>
          </Pressable>
        ))}
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
  const colors = useTheme()
  if (isPending) return <Loading />
  if (error) {
    const message =
      error instanceof Error ? error.message : '通信に失敗しました'
    return <ErrorView message={message} onRetry={onRetry} />
  }
  if (!data || data.length === 0)
    return <EmptyView message='投稿がありません' />

  return (
    <FlatList
      data={data}
      keyExtractor={(post) => String(post.id)}
      renderItem={({ item }) => (
        <Link
          href={{ pathname: '/posts/[id]', params: { id: String(item.id) } }}
          style={[
            styles.row,
            { borderColor: colors.border, color: colors.text }
          ]}
        >
          {item.title}
        </Link>
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8
  },
  chip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4
  },
  row: { padding: 16, borderBottomWidth: 1 }
})
