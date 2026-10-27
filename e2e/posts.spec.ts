import { expect, test } from '@playwright/test'

import { isApi, mockApi } from './mock-api'

// 投稿の画面は、ログイン済みで使う（mockApi は既定でログイン済み）。

test('投稿の一覧から詳細を開ける', async ({ page }) => {
  await mockApi(page)
  await page.goto('/')
  await expect(page.getByText('最初の投稿')).toBeVisible()
  await page.getByText('最初の投稿').click()
  await expect(page.getByText('love の話')).toBeVisible()
})

test('キーワードで絞り込むと、その投稿だけが出る', async ({ page }) => {
  await mockApi(page)
  await page.goto('/')
  await expect(page.getByText('二番目の投稿')).toBeVisible()
  await page.getByRole('button', { name: 'love' }).click()
  await expect(page.getByText('最初の投稿')).toBeVisible()
  await expect(page.getByText('二番目の投稿')).toBeHidden()
})

test('一覧の取得に失敗したら、エラーが出て再試行できる', async ({ page }) => {
  const api = await mockApi(page, { failList: true })
  await page.goto('/')
  // React Query は既定で 3 回まで自動で再試行する（1・2・4 秒待つ）ので、エラー表示まで長めに待つ
  await expect(page.getByText('通信に失敗しました（500）')).toBeVisible({
    timeout: 15_000
  })
  api.recover()
  await page.getByRole('button', { name: '再試行' }).click()
  await expect(page.getByText('最初の投稿')).toBeVisible()
})

test('空のまま登録するとエラーが出て、入力すると投稿できる', async ({
  page
}) => {
  await mockApi(page)
  await page.goto('/posts/new')
  await page.getByRole('button', { name: '登録' }).click()
  await expect(page.getByText('タイトルを入力してください')).toBeVisible()
  await expect(page.getByText('本文を入力してください')).toBeVisible()

  const posted = page.waitForRequest(
    (request) => request.method() === 'POST' && isApi(new URL(request.url()))
  )
  await page.getByTestId('post-title').fill('新しい投稿')
  await page.getByTestId('post-body').fill('新しい本文')
  await page.getByRole('button', { name: '登録' }).click()
  expect((await posted).postDataJSON()).toEqual({
    userId: 1,
    title: '新しい投稿',
    body: '新しい本文'
  })
})

test('設定の表示名が、ホームの挨拶に出る', async ({ page }) => {
  await mockApi(page)
  await page.goto('/settings')
  await page.getByTestId('display-name').fill('たろう')
  await page.goto('/')
  await expect(page.getByText('たろう さん、こんにちは')).toBeVisible()
})

test('入力したまま戻ろうとすると、破棄の確認が出る', async ({ page }) => {
  await mockApi(page)
  await page.goto('/')
  await page.getByText('投稿する').click()
  await page.getByTestId('post-title').fill('書きかけ')

  // 戻ろうとすると確認が出る。「入力を続ける」なら、画面にとどまる
  await page.getByRole('link', { name: '(tabs), back' }).click()
  await expect(page.getByText('入力を破棄しますか？')).toBeVisible()
  await page.getByRole('button', { name: '入力を続ける' }).click()
  await expect(page.getByText('入力を破棄しますか？')).toBeHidden()
  await expect(page.getByTestId('post-title')).toHaveValue('書きかけ')

  // 「破棄する」なら、一覧に戻る
  await page.getByRole('link', { name: '(tabs), back' }).click()
  await page.getByRole('button', { name: '破棄する' }).click()
  await expect(page.getByText('最初の投稿')).toBeVisible()
})

test('何も入力していなければ、確認なしで戻れる', async ({ page }) => {
  await mockApi(page)
  await page.goto('/')
  await page.getByText('投稿する').click()
  await page.getByRole('link', { name: '(tabs), back' }).click()
  await expect(page.getByText('最初の投稿')).toBeVisible()
})
