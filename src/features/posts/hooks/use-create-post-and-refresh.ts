import { useQueryClient } from '@tanstack/react-query'

import { getSearchPostsQueryKey, useCreatePost } from '@/api/generated'

// 作成の後に一覧のキャッシュを捨てる（無効化が要るので、生成された hook を包む）。
export function useCreatePostAndRefresh() {
  const queryClient = useQueryClient()
  return useCreatePost({
    mutation: {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: getSearchPostsQueryKey() })
    }
  })
}
