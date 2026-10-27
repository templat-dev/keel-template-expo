import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native'

import { useTheme } from '@/hooks/use-theme'

type DialogProps = {
  visible: boolean
  title: string
  message?: string
  confirmLabel: string
  onConfirm: () => void
  /** 渡すと「キャンセル」のボタンが出る。省略すると、確認ボタンだけの案内になる */
  cancelLabel?: string
  onCancel?: () => void
  /** 取り消せない操作のとき、確認ボタンを警告の色にする */
  destructive?: boolean
  /** 確認の処理中。確認ボタンを押せなくして、二重に実行されないようにする */
  busy?: boolean
}

// 確認と案内のダイアログ。Alert.alert は Web で何も起きないので、自前で用意する。
// 目的は確認なので、枠の外をタップしても閉じない。Android の戻るボタンは、キャンセル（なければ確認）として扱う。
export function Dialog({
  visible,
  title,
  message,
  confirmLabel,
  onConfirm,
  cancelLabel,
  onCancel,
  destructive,
  busy
}: DialogProps) {
  const { colors } = useTheme()
  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onCancel ?? onConfirm}
    >
      <View className='flex-1 items-center justify-center bg-black/50 px-6'>
        <View
          accessibilityRole='alert'
          className='w-full max-w-sm gap-4 rounded-2xl bg-surface-raised p-6'
        >
          <View className='gap-2'>
            <Text className='text-lg font-bold text-ink'>{title}</Text>
            {message ? <Text className='text-ink-muted'>{message}</Text> : null}
          </View>
          <View className='flex-row justify-end gap-3'>
            {cancelLabel ? (
              <Pressable
                accessibilityRole='button'
                onPress={onCancel}
                className='rounded-lg px-4 py-2'
              >
                <Text className='font-bold text-ink-muted'>{cancelLabel}</Text>
              </Pressable>
            ) : null}
            <Pressable
              accessibilityRole='button'
              disabled={busy}
              onPress={onConfirm}
              className={`flex-row items-center gap-2 rounded-lg px-4 py-2 ${
                destructive ? 'bg-danger' : 'bg-primary'
              } ${busy ? 'opacity-50' : ''}`}
            >
              {busy ? <ActivityIndicator color={colors.onPrimary} /> : null}
              <Text
                className={`font-bold ${
                  destructive ? 'text-on-danger' : 'text-on-primary'
                }`}
              >
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}
