import { Link } from 'expo-router'
import { Pressable, Text, View } from 'react-native'

import { Avatar } from '@/components/image/avatar'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useDisplayName } from '@/hooks/use-display-name'
import { formatFullName } from '@/utils/format-full-name'

// 一覧の上の、常に出す部分（挨拶と、投稿への入口）。ユーザーの取得が済んでいなくても出す。
export function PostListHeader() {
  const [displayName] = useDisplayName()
  const { data: user } = useCurrentUser()
  const name =
    displayName || (user ? formatFullName(user.firstName, user.lastName) : '')

  return (
    <View className='flex-row items-center justify-between gap-3 p-4'>
      <View className='flex-1 flex-row items-center gap-3'>
        {user ? (
          <Avatar
            uri={user.image}
            size={36}
            label={formatFullName(user.firstName, user.lastName)}
          />
        ) : null}
        <Text className='shrink text-ink'>
          {name ? `${name} さん、こんにちは` : 'こんにちは'}
        </Text>
      </View>
      <Link href='/posts/new' asChild>
        <Pressable accessibilityRole='link'>
          <Text className='text-primary'>投稿する</Text>
        </Pressable>
      </Link>
    </View>
  )
}
