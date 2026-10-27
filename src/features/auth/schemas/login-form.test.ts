import { describe, expect, it } from 'vitest'

import { loginFormSchema } from './login-form'

describe('loginFormSchema', () => {
  it('空のユーザー名は弾く', () => {
    const result = loginFormSchema.safeParse({ username: '  ', password: 'x' })
    expect(result.success).toBe(false)
  })

  it('空のパスワードは弾く', () => {
    const result = loginFormSchema.safeParse({
      username: 'emilys',
      password: ''
    })
    expect(result.success).toBe(false)
  })

  it('ユーザー名の前後の空白は取る。パスワードは取らない', () => {
    const result = loginFormSchema.parse({
      username: ' emilys ',
      password: ' pass '
    })
    expect(result).toEqual({ username: 'emilys', password: ' pass ' })
  })
})
