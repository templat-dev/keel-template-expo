import { useLocalSearchParams } from 'expo-router'

import { ErrorView } from '@/components/screen-state/error-view'
import { PostDetail } from '@/features/posts/screens/post-detail'

export default function PostDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const postId = Number(id)
  if (!Number.isInteger(postId))
    return <ErrorView message='投稿が見つかりません' />
  return <PostDetail postId={postId} />
}
