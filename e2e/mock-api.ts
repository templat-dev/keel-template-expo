import type { Page } from '@playwright/test'

// API の接続先は、.env.local の有無で変わる（.env.local の値が優先される）。ホストは見ず、
// アプリ自身（localhost）以外へ出る、API のパスへのリクエストを差し替える。
export const isPostsApi = (url: URL) =>
  url.hostname !== 'localhost' && url.pathname.startsWith('/posts')
export const isAuthApi = (url: URL) =>
  url.hostname !== 'localhost' && url.pathname.startsWith('/auth')

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': '*'
}

export const posts = [
  { id: 1, userId: 1, title: '最初の投稿', body: '最初の本文' },
  { id: 2, userId: 2, title: '二番目の投稿', body: '二番目の本文' }
]

// 画像は実物に取りに行かない（1 ピクセルの PNG を返す）。
export const user = {
  id: 1,
  username: 'emilys',
  email: 'emily.johnson@example.test',
  firstName: 'Emily',
  lastName: 'Johnson',
  image: 'http://auth.test/icon/emilys/128'
}

const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
)

type Options = {
  // 既にログイン済み（Cookie がある）か。/auth/me が 200 になる
  loggedIn?: boolean
  failList?: boolean
}

// API は実物に届かせず、ここで差し替える。
export async function mockApi(page: Page, options: Options = {}) {
  let loggedIn = options.loggedIn ?? true
  let failList = options.failList ?? false

  await page.route(
    (url) =>
      isPostsApi(url) || isAuthApi(url) || url.pathname.startsWith('/icon'),
    async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      if (request.method() === 'OPTIONS') {
        return route.fulfill({
          status: 204,
          headers: {
            ...CORS,
            'access-control-allow-origin': request.headers().origin ?? '*',
            'access-control-allow-credentials': 'true'
          }
        })
      }
      // 認証付きの API は、資格情報つき（Cookie）で呼ばれるので、オリジンを返し、資格情報を許可する
      const authCors = {
        ...CORS,
        'access-control-allow-origin': request.headers().origin ?? '*',
        'access-control-allow-credentials': 'true'
      }

      if (url.pathname.startsWith('/icon')) {
        return route.fulfill({
          status: 200,
          headers: { ...CORS, 'content-type': 'image/png' },
          body: PIXEL
        })
      }
      if (request.method() === 'POST' && url.pathname === '/auth/login') {
        const body = request.postDataJSON()
        if (body.password !== 'emilyspass') {
          return route.fulfill({
            status: 400,
            headers: authCors,
            json: { message: 'Invalid credentials' }
          })
        }
        loggedIn = true
        return route.fulfill({
          status: 200,
          headers: authCors,
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
            headers: authCors,
            json: { message: 'Unauthorized' }
          })
        }
        return route.fulfill({ status: 200, headers: authCors, json: user })
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
    }
  )
  return {
    recover: () => {
      failList = false
    }
  }
}
