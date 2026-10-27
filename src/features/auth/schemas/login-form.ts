import { z } from 'zod'

export const loginFormSchema = z.object({
  username: z.string().trim().min(1, 'ユーザー名を入力してください'),
  password: z.string().min(1, 'パスワードを入力してください')
})
export type LoginFormValues = z.infer<typeof loginFormSchema>
