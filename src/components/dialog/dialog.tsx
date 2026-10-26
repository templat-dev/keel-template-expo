import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native'

// 確認・案内のモーダル。Alert.alert は Web で動かないので、自前で持つ。
// 背景のタップでは閉じない（確認を読まずに閉じて進んでしまうのを避ける）。
export function Dialog({
  visible,
  title,
  body,
  actions,
  onDismiss
}: {
  visible: boolean
  title: string
  body: string
  /** `pending` は処理中。押せなくして、ラベルの前に処理中の表示を出す（二重実行を防ぐ） */
  actions: {
    label: string
    onPress: () => void
    destructive?: boolean
    pending?: boolean
  }[]
  /** Android の戻るボタンで呼ばれる。通常は「キャンセル」と同じ処理を渡す */
  onDismiss?: () => void
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onDismiss}
    >
      <View className='flex-1 items-center justify-center bg-black/40 p-6'>
        <View
          accessibilityRole='alert'
          className='w-full max-w-sm gap-3 rounded-xl bg-white p-5 dark:bg-neutral-800'
        >
          <Text className='text-base font-bold text-neutral-900 dark:text-neutral-100'>
            {title}
          </Text>
          <Text className='text-sm leading-6 text-neutral-600 dark:text-neutral-400'>
            {body}
          </Text>
          <View className='mt-2 gap-2'>
            {actions.map((action) => (
              <Pressable
                key={action.label}
                accessibilityRole='button'
                disabled={action.pending}
                onPress={action.onPress}
                className={`flex-row items-center justify-center gap-2 rounded-lg py-3 ${
                  action.destructive && !action.pending
                    ? 'bg-red-600'
                    : 'border border-neutral-300 dark:border-neutral-600'
                }`}
              >
                {action.pending ? <ActivityIndicator /> : null}
                <Text
                  className={`text-sm font-bold ${
                    action.destructive && !action.pending
                      ? 'text-white'
                      : 'text-neutral-900 dark:text-neutral-100'
                  }`}
                >
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  )
}
