import { Pressable, Text, View } from 'react-native'

import { signOut } from '@/api/auth-state'
import { Avatar } from '@/components/image/avatar'
import { ErrorView } from '@/components/screen-state/error-view'
import { Loading } from '@/components/screen-state/loading'
import { useCurrentUser } from '@/hooks/use-current-user'
import { formatFullName } from '@/utils/format-full-name'

// ログイン中のユーザーの表示と、ログアウト。ユーザーの取得に失敗しても、ログアウトはできるようにする。
export function AccountSection() {
  const { data: user, isPending, error, refetch } = useCurrentUser()

  return (
    <View className='gap-4'>
      {isPending ? (
        <View className='h-24'>
          <Loading />
        </View>
      ) : error ? (
        <View className='h-24'>
          <ErrorView message={error.message} onRetry={refetch} />
        </View>
      ) : (
        <View className='flex-row items-center gap-4'>
          <Avatar
            uri={user.image}
            size={64}
            label={formatFullName(user.firstName, user.lastName)}
          />
          <View className='shrink gap-1'>
            <Text className='text-lg font-bold text-ink'>
              {formatFullName(user.firstName, user.lastName)}
            </Text>
            <Text className='text-ink-muted'>{user.email}</Text>
          </View>
        </View>
      )}
      <Pressable
        accessibilityRole='button'
        onPress={signOut}
        className='items-center rounded-lg border border-danger p-3'
      >
        <Text className='text-danger'>ログアウト</Text>
      </Pressable>
    </View>
  )
}
