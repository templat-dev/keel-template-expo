import { describe, expect, it } from 'vitest'

import { postFormSchema, toNewPost } from './post-form'

describe('postFormSchema', () => {
  it('空のタイトルは弾く', () => {
    const result = postFormSchema.safeParse({ title: '   ', body: '本文' })
    expect(result.success).toBe(false)
  })

  it('空の本文は弾く', () => {
    const result = postFormSchema.safeParse({ title: 'タイトル', body: '' })
    expect(result.success).toBe(false)
  })

  it('101 文字のタイトルは弾く', () => {
    const result = postFormSchema.safeParse({
      title: 'あ'.repeat(101),
      body: '本文'
    })
    expect(result.success).toBe(false)
  })

  it('前後の空白を取り除く', () => {
    const result = postFormSchema.parse({ title: ' タイトル ', body: ' 本文 ' })
    expect(result).toEqual({ title: 'タイトル', body: '本文' })
  })
})

describe('toNewPost', () => {
  it('userId を足して API の本文にする', () => {
    expect(toNewPost({ title: 'a', body: 'b' }, 1)).toEqual({
      userId: 1,
      title: 'a',
      body: 'b'
    })
  })
})
