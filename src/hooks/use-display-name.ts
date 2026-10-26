import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAtom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

// 設定の画面と、ホームの挨拶の 2 つの feature で使うので、共通の hooks に置く。
const storage = createJSONStorage<string>(() => AsyncStorage)
const displayNameAtom = atomWithStorage<string>('displayName', '', storage)

export function useDisplayName() {
  return useAtom(displayNameAtom)
}
