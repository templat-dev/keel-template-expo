import { describe, expect, it } from 'vitest'

import { formatFullName } from './format-full-name'

describe('formatFullName', () => {
  it('両方が空なら、空文字を返す', () => {
    expect(formatFullName('', '')).toBe('')
    expect(formatFullName('  ', ' ')).toBe('')
  })

  it('片方が空なら、もう片方だけを返す', () => {
    expect(formatFullName('Emily', '')).toBe('Emily')
    expect(formatFullName('', 'Johnson')).toBe('Johnson')
  })

  it('名・姓の順に、半角スペースで区切る', () => {
    expect(formatFullName('Emily', 'Johnson')).toBe('Emily Johnson')
  })

  it('前後の空白は取る', () => {
    expect(formatFullName(' Emily ', ' Johnson ')).toBe('Emily Johnson')
  })
})
