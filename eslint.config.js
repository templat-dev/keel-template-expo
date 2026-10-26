// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    // 生成物は検査しない（整形も対象外。.prettierignore と同じ理由）
    ignores: ['dist/*', 'src/api/generated/*']
  }
])
