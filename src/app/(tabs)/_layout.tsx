import { Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name='index' options={{ title: 'ホーム' }} />
      <Tabs.Screen name='settings' options={{ title: '設定' }} />
    </Tabs>
  )
}
