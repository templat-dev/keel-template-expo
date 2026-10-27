/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
const palette = require('./src/colors.json')

// 色は src/colors.json（ライト / ダーク）の 1 か所で決める。className では bg-primary・text-ink のように、
// 名前で使う。値は CSS 変数（--color-<名前>）に出し、端末のライト / ダークに合わせて切り替える。
const rgb = (hex) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(' ')
const vars = (colors) =>
  Object.fromEntries(
    Object.entries(colors).map(([name, hex]) => [`--color-${name}`, rgb(hex)])
  )

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: Object.fromEntries(
        Object.keys(palette.light).map((name) => [
          name,
          `rgb(var(--color-${name}) / <alpha-value>)`
        ])
      )
    }
  },
  plugins: [
    plugin(({ addBase }) =>
      addBase({
        ':root': vars(palette.light),
        '@media (prefers-color-scheme: dark)': { ':root': vars(palette.dark) }
      })
    )
  ]
}
