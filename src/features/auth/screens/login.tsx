import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, ScrollView, Text } from 'react-native'

import { ApiError } from '@/api/mutator'
import { TextField } from '@/components/form/text-field'
import { Content } from '@/components/layout/content'
import { Screen } from '@/components/layout/screen'

import { useLoginAndSignIn } from '../hooks/use-login-and-sign-in'
import { loginFormSchema, type LoginFormValues } from '../schemas/login-form'

export function Login() {
  const { mutateAsync, error } = useLoginAndSignIn()
  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: '', password: '' }
  })

  // 成功すると認証状態が変わり、ルートの _layout（Stack.Protected）がホームへ切り替える。
  // 失敗は mutation の error で表示するので、ここでは握る。
  const onSubmit = async (values: LoginFormValues) => {
    try {
      await mutateAsync({ data: values })
    } catch {}
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
            name='username'
            render={({ field, fieldState }) => (
              <TextField
                label='ユーザー名'
                testID='login-username'
                autoCapitalize='none'
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='password'
            render={({ field, fieldState }) => (
              <TextField
                label='パスワード'
                testID='login-password'
                secureTextEntry
                autoCapitalize='none'
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          {error ? (
            <Text className='text-danger'>
              {error instanceof ApiError && error.status === 400
                ? 'ユーザー名かパスワードが違います'
                : 'ログインに失敗しました'}
            </Text>
          ) : null}
          <Pressable
            accessibilityRole='button'
            disabled={formState.isSubmitting}
            onPress={() => handleSubmit(onSubmit)()}
            className={`items-center rounded-lg bg-primary p-3 ${
              formState.isSubmitting ? 'opacity-50' : ''
            }`}
          >
            <Text className='text-on-primary'>ログイン</Text>
          </Pressable>
          <Text className='text-ink-muted'>
            サンプルのユーザー: emilys / emilyspass
          </Text>
        </Content>
      </ScrollView>
    </Screen>
  )
}
