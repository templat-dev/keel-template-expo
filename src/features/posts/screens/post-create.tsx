import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'

import { TextField } from '@/components/text-field'
import { useTheme } from '@/hooks/use-theme'

import { useCreatePostAndRefresh } from '../hooks/use-create-post-and-refresh'
import {
  postFormSchema,
  toNewPost,
  type PostFormValues
} from '../utils/post-form'

// JSONPlaceholder には認証がないので、投稿者は固定にする。
const SAMPLE_USER_ID = 1

export function PostCreate() {
  const colors = useTheme()
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
    <ScrollView contentContainerStyle={styles.content}>
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
        <Text style={{ color: colors.danger }}>投稿に失敗しました</Text>
      ) : null}
      <Pressable
        accessibilityRole='button'
        disabled={formState.isSubmitting}
        onPress={() => handleSubmit(onSubmit)()}
        style={[
          styles.button,
          { backgroundColor: colors.primary },
          formState.isSubmitting ? styles.disabled : null
        ]}
      >
        <Text style={{ color: colors.onPrimary }}>登録</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16 },
  button: { alignItems: 'center', padding: 12, borderRadius: 8 },
  disabled: { opacity: 0.5 }
})
