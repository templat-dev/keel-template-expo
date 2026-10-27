import { expect, test } from '@playwright/test'

import { mockApi } from './mock-api'

test('ログインすると、ホームに入れる', async ({ page }) => {
  await mockApi(page, { loggedIn: false })
  await page.goto('/')
  // 未ログイン（/auth/me が 401）なので、ログインが出る
  await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible()

  await page.getByTestId('login-username').fill('emilys')
  await page.getByTestId('login-password').fill('emilyspass')
  await page.getByRole('button', { name: 'ログイン' }).click()

  await expect(page.getByText('最初の投稿')).toBeVisible()
  await expect(page.getByText('Emily Johnson さん、こんにちは')).toBeVisible()
})

test('パスワードが違うと、エラーが出て、ログインのままになる', async ({
  page
}) => {
  await mockApi(page, { loggedIn: false })
  await page.goto('/')
  await page.getByTestId('login-username').fill('emilys')
  await page.getByTestId('login-password').fill('wrong')
  await page.getByRole('button', { name: 'ログイン' }).click()
  await expect(page.getByText('ユーザー名かパスワードが違います')).toBeVisible()
  await expect(page.getByText('最初の投稿')).toBeHidden()
})

test('未ログインで URL を直接開くと、ログインに戻される', async ({ page }) => {
  await mockApi(page, { loggedIn: false })
  await page.goto('/posts/new')
  await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible()
  await expect(page.getByTestId('post-title')).toBeHidden()
})

test('ログアウトすると、ログインに戻る', async ({ page }) => {
  await mockApi(page)
  await page.goto('/settings')
  await expect(page.getByText('Emily Johnson', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'ログアウト' }).click()
  await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible()
  await expect(page.getByTestId('display-name')).toBeHidden()
})
