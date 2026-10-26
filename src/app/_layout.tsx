import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'

import { queryClient } from '@/api/query-client'

// URL を直接開いても、戻る先として (tabs) が履歴の底に積まれる。
export const unstable_settings = { anchor: '(tabs)' }

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='posts/[id]' options={{ title: '投稿の詳細' }} />
        <Stack.Screen name='posts/new' options={{ title: '投稿の作成' }} />
      </Stack>
    </QueryClientProvider>
  )
}
