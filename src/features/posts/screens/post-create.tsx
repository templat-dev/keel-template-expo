import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, ScrollView, Text } from 'react-native'

import { TextField } from '@/components/text-field'

import { useCreatePostAndRefresh } from '../hooks/use-create-post-and-refresh'
import {
  postFormSchema,
  toNewPost,
  type PostFormValues
} from '../utils/post-form'

// JSONPlaceholder には認証がないので、投稿者は固定にする。
const SAMPLE_USER_ID = 1

export function PostCreate() {
  const router = useRouter()
  const { mutateAsync, error } = useCreatePostAndRefresh()
  const { control, handleSubmit, formState } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: { title: '', body: '' }
  })

  const onSubmit = async (values: PostFormValues) => {
    await mutateAsync({ data: toNewPost(values, SAMPLE_USER_ID) })
    router.back()
  }

  return (
    <ScrollView contentContainerClassName='gap-4 p-4'>
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
        <Text className='text-red-600 dark:text-red-400'>
          投稿に失敗しました
        </Text>
      ) : null}
      <Pressable
        accessibilityRole='button'
        disabled={formState.isSubmitting}
        onPress={() => handleSubmit(onSubmit)()}
        className={`items-center rounded-lg bg-sky-700 p-3 dark:bg-sky-400 ${
          formState.isSubmitting ? 'opacity-50' : ''
        }`}
      >
        <Text className='text-white dark:text-neutral-900'>登録</Text>
      </Pressable>
    </ScrollView>
  )
}
