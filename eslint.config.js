// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')

// Tailwind の色（bg-sky-700・text-neutral-900 など）の直書き。
const RAW_COLOR =
  '\\b(bg|text|border|ring|fill|stroke|from|via|to)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}\\b'
const RAW_COLOR_MESSAGE =
  'Tailwind の色を直書きしない。src/colors.json の名前（bg-primary・text-ink など）を使う。'

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    // 色は src/colors.json の名前で書く（className に使う色も、JS の色も、同じ値から作られる）。
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: `Literal[value=/${RAW_COLOR}/]`,
          message: RAW_COLOR_MESSAGE
        },
        {
          selector: `TemplateElement[value.raw=/${RAW_COLOR}/]`,
          message: RAW_COLOR_MESSAGE
        }
      ]
    }
  },
  {
    // 生成物は検査しない（整形も対象外。.prettierignore と同じ理由）
    ignores: ['dist/*', 'src/api/generated/*']
  }
])
