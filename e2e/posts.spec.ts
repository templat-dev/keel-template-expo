import { expect, test, type Page } from '@playwright/test'

// API の接続先は、.env.local の有無で変わる（.env.local の値が優先される）。ホストは見ず、
// アプリ自身（localhost）以外へ出る /posts へのリクエストを API として差し替える。
const isApi = (url: URL) =>
  url.hostname !== 'localhost' && url.pathname.startsWith('/posts')
const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': '*'
}

const posts = [
  { id: 1, userId: 1, title: '最初の投稿', body: '最初の本文' },
  { id: 2, userId: 2, title: '二番目の投稿', body: '二番目の本文' }
]

// API は実物に届かせず、ここで差し替える。
async function mockApi(page: Page, options: { failList?: boolean } = {}) {
  let failList = options.failList ?? false
  await page.route(isApi, async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    if (request.method() === 'OPTIONS') {
      return route.fulfill({ status: 204, headers: CORS })
    }
    if (request.method() === 'POST' && url.pathname === '/posts') {
      const body = request.postDataJSON()
      return route.fulfill({
        status: 201,
        headers: CORS,
        json: { id: 101, ...body }
      })
    }
    if (url.pathname === '/posts') {
      if (failList)
        return route.fulfill({ status: 500, headers: CORS, json: {} })
      const userId = url.searchParams.get('userId')
      const list = userId
        ? posts.filter((p) => String(p.userId) === userId)
        : posts
      return route.fulfill({ status: 200, headers: CORS, json: list })
    }
    const detail = posts.find((p) => url.pathname === `/posts/${p.id}`)
    if (detail)
      return route.fulfill({ status: 200, headers: CORS, json: detail })
    return route.fulfill({ status: 404, headers: CORS, json: {} })
  })
  return {
    recover: () => {
      failList = false
    }
  }
}

test('投稿の一覧から詳細を開ける', async ({ page }) => {
  await mockApi(page)
  await page.goto('/')
  await expect(page.getByText('最初の投稿')).toBeVisible()
  await page.getByText('最初の投稿').click()
  await expect(page.getByText('最初の本文')).toBeVisible()
})

test('ユーザーで絞り込むと、その投稿だけが出る', async ({ page }) => {
  await mockApi(page)
  await page.goto('/')
  await expect(page.getByText('二番目の投稿')).toBeVisible()
  await page.getByRole('button', { name: 'ユーザー 1' }).click()
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
