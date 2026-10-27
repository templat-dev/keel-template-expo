import { Image } from 'expo-image'

import { useTheme } from '@/hooks/use-theme'

// 丸いアバター画像。ディスクキャッシュ（既定）と、読み込み中の背景色、切り替えのフェードを持つ。
// expo-image の寸法は style で指定する（className ではなく）。
export function Avatar({
  uri,
  size,
  label
}: {
  uri: string
  size: number
  label: string
}) {
  const { colors } = useTheme()
  return (
    <Image
      source={{ uri }}
      accessibilityLabel={label}
      contentFit='cover'
      transition={200}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.border // 読み込み中の背景
      }}
    />
  )
}
