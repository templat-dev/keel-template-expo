import { Stack } from 'expo-router'
import { ScrollView, StyleSheet, Text } from 'react-native'

import { useGetPost } from '@/api/generated'
import { ErrorView } from '@/components/error-view'
import { Loading } from '@/components/loading'
import { useTheme } from '@/hooks/use-theme'

export function PostDetail({ postId }: { postId: number }) {
  const colors = useTheme()
  const { data, isPending, error, refetch } = useGetPost(postId)

  if (isPending) return <Loading />
  if (error) {
    const message =
      error instanceof Error ? error.message : '通信に失敗しました'
    return <ErrorView message={message} onRetry={refetch} />
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: data.title }} />
      <Text style={[styles.title, { color: colors.text }]}>{data.title}</Text>
      <Text style={{ color: colors.text }}>{data.body}</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: 'bold' }
})
