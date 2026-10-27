import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs } from 'expo-router'

import { useTheme } from '@/hooks/use-theme'

// タブバーの color は ColorValue（数値や null を含む）、Ionicons の color は string 型で合わない。
// 実際に渡るのは文字列なので、string として渡す。
export default function TabsLayout() {
  const { colors } = useTheme()
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home-outline' color={color as string} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: '設定',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='settings-outline'
              color={color as string}
              size={size}
            />
          )
        }}
      />
    </Tabs>
  )
}
