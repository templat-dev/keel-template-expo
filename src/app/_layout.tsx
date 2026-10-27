import '../global.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { Stack, ThemeProvider } from 'expo-router'
import { useColorScheme as useNativeWindColorScheme } from 'nativewind'
import { useEffect } from 'react'
import { Platform, useColorScheme } from 'react-native'

import { queryClient } from '@/api/query-client'
import { BackButton } from '@/components/layout/back-button'
import { navigationTheme } from '@/theme'

// URL を直接開いても、戻る先として (tabs) が履歴の底に積まれる。
export const unstable_settings = { anchor: '(tabs)' }

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const { setColorScheme } = useNativeWindColorScheme()

  // Web は、darkMode: 'class' だと dark: のクラスが端末の設定に自動では従わないので、端末の設定を NativeWind と html に渡す。
  // 開発サーバーでは NativeWind が class を付けるのが間に合わないので、自分で付ける。
  // ネイティブでは setColorScheme を呼ばない（呼ぶと端末の設定が固定され、起動中の切り替えが反映されなくなる）。
  useEffect(() => {
    if (Platform.OS !== 'web') return
    const scheme = colorScheme === 'dark' ? 'dark' : 'light'
    setColorScheme(scheme)
    document.documentElement.classList.toggle('dark', scheme === 'dark')
  }, [colorScheme, setColorScheme])

  const theme = navigationTheme(colorScheme === 'dark')

  return (
    <QueryClientProvider client={queryClient}>
      {/* ヘッダーやタブバー、画面の背景を、端末のライト / ダークに合わせる */}
      <ThemeProvider value={theme}>
        <Stack
          screenOptions={{
            // iOS 26 以降の既定（透明なヘッダーで、内容がヘッダーの下に入る）を使わない
            headerTransparent: false,
            // iOS の戻るボタンは Liquid Glass で描かれ、長押しで遷移元（(tabs)）が出る。Android と同じにするため、自前のものにする。
            // hidesSharedBackground は、ボタンの背景（ガラス）を外す。Android は標準の戻るボタンのまま。
            unstable_headerLeftItems: ({ canGoBack }) =>
              canGoBack
                ? [
                    {
                      type: 'custom',
                      element: <BackButton />,
                      hidesSharedBackground: true
                    }
                  ]
                : []
          }}
        >
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen name='posts/[id]' options={{ title: '投稿の詳細' }} />
          <Stack.Screen name='posts/new' options={{ title: '投稿の作成' }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
