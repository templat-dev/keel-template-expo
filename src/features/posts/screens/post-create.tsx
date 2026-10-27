import { zodResolver } from '@hookform/resolvers/zod'
import { usePreventRemove, useRouter } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, ScrollView, Text } from 'react-native'

import { Dialog } from '@/components/dialog/dialog'
import { TextField } from '@/components/form/text-field'
import { Content } from '@/components/layout/content'
import { Screen } from '@/components/layout/screen'
import { useCurrentUser } from '@/hooks/use-current-user'

import { useCreatePostAndRefresh } from '../hooks/use-create-post-and-refresh'
import {
  postFormSchema,
  toNewPost,
  type PostFormValues
} from '../schemas/post-form'

export function PostCreate() {
  const router = useRouter()
  const { data: user } = useCurrentUser()
  const { mutateAsync, error } = useCreatePostAndRefresh()
  const { control, handleSubmit, formState } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: { title: '', body: '' }
  })

  // 入力があるまま画面を離れようとしたら、確認するまで離れるのを保留する。
  // 確認した後にもう一度同じ操作をするための repeat を、保留した時点で受け取っておく。
  const [leave, setLeave] = useState<{ repeat: () => void } | null>(null)
  const [allowLeave, setAllowLeave] = useState(false)
  const disablePrevention = usePreventRemove(
    formState.isDirty && !allowLeave,
    ({ repeat }) => setLeave({ repeat })
  )

  const onSubmit = async (values: PostFormValues) => {
    // 投稿者は、ログイン中のユーザー（ホームの挨拶で取得済み）
    if (!user) return
    try {
      await mutateAsync({ data: toNewPost(values, user.id) })
    } catch {
      // 失敗は、下の「投稿に失敗しました」で伝える。前の画面へは戻らない
      return
    }
    disablePrevention()
    router.back()
  }

  const discard = () => {
    setAllowLeave(true)
    leave?.repeat()
    setLeave(null)
  }

  return (
    <Screen>
      <ScrollView
        contentContainerClassName='items-center p-4'
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps='handled'
      >
        <Content className='gap-4'>
          <Controller
            control={control}
            name='title'
            render={({ field, fieldState }) => (
              <TextField
                label='タイトル'
                testID='post-title'
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='body'
            render={({ field, fieldState }) => (
              <TextField
                label='本文'
                testID='post-body'
                multiline
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          {error ? (
            <Text className='text-danger'>投稿に失敗しました</Text>
          ) : null}
          <Pressable
            accessibilityRole='button'
            disabled={formState.isSubmitting}
            onPress={() => handleSubmit(onSubmit)()}
            className={`items-center rounded-lg bg-primary p-3 ${
              formState.isSubmitting ? 'opacity-50' : ''
            }`}
          >
            <Text className='text-on-primary'>登録</Text>
          </Pressable>
          <Dialog
            visible={leave !== null}
            title='入力を破棄しますか？'
            message='入力した内容は保存されません。'
            confirmLabel='破棄する'
            onConfirm={discard}
            cancelLabel='入力を続ける'
            onCancel={() => setLeave(null)}
            destructive
          />
        </Content>
      </ScrollView>
    </Screen>
  )
}
