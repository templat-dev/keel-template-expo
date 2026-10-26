import { z } from 'zod'

import type { NewPost } from '@/api/generated/model'

export const postFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'タイトルを入力してください')
    .max(100, 'タイトルは 100 文字までです'),
  body: z.string().trim().min(1, '本文を入力してください')
})
export type PostFormValues = z.infer<typeof postFormSchema>

// フォームの項目（title・body）と API の本文（userId を含む）は一致しない。
export function toNewPost(values: PostFormValues, userId: number): NewPost {
  return { userId, title: values.title, body: values.body }
}
