import type { ReactNode } from 'react'
import { SafeAreaView, type Edge } from 'react-native-safe-area-context'

// 画面の外枠。ノッチやホームインジケータ、Android のナビゲーションバーに内容が隠れないようにする。
// ヘッダーのある画面は、上側をヘッダーが持つので、既定は下・左・右。ヘッダーのない画面は edges に 'top' を足す。
// タブバーの上に描かれる画面でも、タブバーと重なる分だけが余白になるので、二重にはならない。
export function Screen({
  children,
  edges = ['bottom', 'left', 'right']
}: {
  children: ReactNode
  edges?: Edge[]
}) {
  return (
    <SafeAreaView edges={edges} className='flex-1'>
      {children}
    </SafeAreaView>
  )
}
