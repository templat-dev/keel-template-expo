import type { Page } from '@playwright/test'

// API の接続先は、.env.local の有無で変わる（.env.local の値が優先される）。ホストは見ず、
// アプリ自身（localhost）以外へ出る、API のパスへのリクエストを差し替える。
export const isApi = (url: URL) =>
  url.hostname !== 'localhost' &&
  (url.pathname.startsWith('/auth') || url.pathname.startsWith('/posts'))
const isIcon = (url: URL) =>
  url.hostname !== 'localhost' && url.pathname.startsWith('/icon')

// 認証付きの API は、資格情報つき（Cookie）で呼ばれるので、オリジンを返し、資格情報を許可する。
const cors = (origin: string | undefined) => ({
  'access-control-allow-origin': origin ?? '*',
  'access-control-allow-headers': '*',
  'access-control-allow-methods': '*',
  'access-control-allow-credentials': 'true'
})

export const posts = [
  {
    id: 1,
    userId: 1,
    title: '最初の投稿',
    body: 'love の話',
    tags: []
  },
  {
    id: 2,
    userId: 2,
    title: '二番目の投稿',
    body: 'history の話',
    tags: []
  }
]

export const user = {
  id: 1,
  username: 'emilys',
  email: 'emily.johnson@example.test',
  firstName: 'Emily',
  lastName: 'Johnson',
  image: 'http://api.test/icon/emilys/128'
}

// 画像は実物に取りに行かない（1 ピクセルの PNG を返す）。
const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
)

type Options = {
  // 既にログイン済み（Cookie がある）か。/auth/me が 200 になる
  loggedIn?: boolean
  // 一覧の取得を 500 にする
  failList?: boolean
}

// API は実物に届かせず、ここで差し替える。
export async function mockApi(page: Page, options: Options = {}) {
  let loggedIn = options.loggedIn ?? true
  let failList = options.failList ?? false

  await page.route(
    (url) => isApi(url) || isIcon(url),
    async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const headers = cors(request.headers().origin)
      if (request.method() === 'OPTIONS') {
        return route.fulfill({ status: 204, headers })
      }

      if (isIcon(url)) {
        return route.fulfill({
          status: 200,
          headers: { ...headers, 'content-type': 'image/png' },
          body: PIXEL
        })
      }
      if (request.method() === 'POST' && url.pathname === '/auth/login') {
        const body = request.postDataJSON()
        if (body.password !== 'emilyspass') {
          return route.fulfill({
            status: 400,
            headers,
            json: { message: 'Invalid credentials' }
          })
        }
        loggedIn = true
        return route.fulfill({
          status: 200,
          headers,
          json: {
            ...user,
            accessToken: 'access-token',
            refreshToken: 'refresh'
          }
        })
      }
      if (url.pathname === '/auth/me') {
        if (!loggedIn) {
          return route.fulfill({
            status: 401,
            headers,
            json: { message: 'Unauthorized' }
          })
        }
        return route.fulfill({ status: 200, headers, json: user })
      }
      if (request.method() === 'POST' && url.pathname === '/posts/add') {
        return route.fulfill({
          status: 201,
          headers,
          json: { id: 101, ...request.postDataJSON() }
        })
      }
      if (url.pathname === '/posts/search') {
        if (failList) return route.fulfill({ status: 500, headers, json: {} })
        // 実物と同じく、q を省くとすべて。q があれば、タイトルか本文に含むものだけ
        const q = url.searchParams.get('q')
        const list = q
          ? posts.filter((p) => `${p.title} ${p.body}`.includes(q))
          : posts
        return route.fulfill({
          status: 200,
          headers,
          json: { posts: list, total: list.length, skip: 0, limit: 30 }
        })
      }
      const detail = posts.find((p) => url.pathname === `/posts/${p.id}`)
      if (detail) return route.fulfill({ status: 200, headers, json: detail })
      return route.fulfill({ status: 404, headers, json: {} })
    }
  )
  return {
    recover: () => {
      failList = false
    }
  }
}
