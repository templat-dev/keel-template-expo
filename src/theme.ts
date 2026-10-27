import {
  DarkTheme,
  DefaultTheme,
  type Theme as NavigationTheme
} from 'expo-router'

import palette from './colors.json'

// JS で色の値が要る場所（ナビゲーションのテーマ、タブバーの色、ActivityIndicator など）は、ここを使う。
// 色の定義は src/colors.json の 1 か所。className の色（bg-primary・text-ink など）も、同じ値から作られる。
function toColors(p: typeof palette.light) {
  return {
    background: p.background,
    surface: p.surface, // ヘッダー・タブバー・カードの背景
    text: p.ink,
    textMuted: p['ink-muted'],
    border: p.line,
    primary: p.primary,
    onPrimary: p['on-primary'],
    danger: p.danger
  }
}

export const lightColors = toColors(palette.light)
export const darkColors: typeof lightColors = toColors(palette.dark)

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
