import {
  DarkTheme,
  DefaultTheme,
  type Theme as NavigationTheme
} from 'expo-router'

// アプリの色の定義（ライト / ダーク）。アプリごとに、ここの値を書き換える。
//
// JS で色の値が要る場所（ナビゲーションのテーマ、タブバーの色、ActivityIndicator など）は、ここを使う。
// className で使う色は Tailwind の色。同じ色にそろえるため、各値に対応する Tailwind の色をコメントで添えている。
export const lightColors = {
  background: '#f2f2f2', // 画面の背景
  surface: '#ffffff', // ヘッダー・タブバー・カードの背景
  text: '#171717', // neutral-900
  textMuted: '#737373', // neutral-500
  border: '#d4d4d4', // neutral-300
  primary: '#0369a1', // sky-700
  onPrimary: '#ffffff',
  danger: '#dc2626' // red-600
}

export const darkColors: typeof lightColors = {
  background: '#000000',
  surface: '#121212',
  text: '#f5f5f5', // neutral-100
  textMuted: '#a3a3a3', // neutral-400
  border: '#404040', // neutral-700
  primary: '#38bdf8', // sky-400
  onPrimary: '#171717',
  danger: '#f87171' // red-400
}

export type Colors = typeof lightColors

// ナビゲーション（ヘッダー・タブバー・画面の背景）のテーマ。ルートの _layout.tsx の ThemeProvider に渡す。
export function navigationTheme(isDark: boolean): NavigationTheme {
  const base = isDark ? DarkTheme : DefaultTheme
  const colors = isDark ? darkColors : lightColors
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border
    }
  }
}
