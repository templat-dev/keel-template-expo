# 画面の書き方

Expo アプリの画面の書き方のルール。置き場は[フォルダ構成](./folder-structure.md)、使うライブラリは[選定ライブラリ](./tech-stack.md)が持つ。本資料は「画面をどう書くか」を扱う。

## データ取得を伴う画面の 4 状態

データを取得する画面は、**Loading・Error・Empty・Data** の 4 状態を必ず扱う。

| 状態    | 条件                         | 表示                               |
| ------- | ---------------------------- | ---------------------------------- |
| Loading | 初回で、まだデータがない     | `Loading`                          |
| Error   | 取得に失敗した               | `ErrorView`（メッセージと再試行）  |
| Empty   | 取得は成功したが、データが空 | `EmptyView`（文言を props で渡す） |
| Data    | データがある                 | 画面本体                           |

* 判定の順序は、Loading → Error → Empty → Data。早期 return で書く。
* **hook は、早期 return より前に呼ぶ。** hook は条件分岐の中で呼べないため、早期 return の後に hook を置かない。
* 再取得中でデータがすでにあるときは、Loading に戻さず、データを表示する（TanStack Query の `isPending` は、データがまだない初回だけ true になる）。

```tsx
export function ItemList() {
  const { data, isPending, error, refetch } = useGetItems()

  if (isPending) return <Loading />
  if (error) return <ErrorView message={error.message} onRetry={refetch} />
  if (data.length === 0) return <EmptyView message='商品がありません' />

  return <ItemListView items={data} />
}
```

* `error.message` が使えるのは、mutator が `ErrorType` を export してエラーの型を上書きしているため（[選定ライブラリ](./tech-stack.md#エラーの型)）。上書きしないと、エラーの型が `unknown` になり、型エラーになる。

### 画面の一部だけが状態に依存するとき

一覧の挨拶やフィルタのように、常に出したい部分があるときは、画面全体を早期 return で置き換えられない（ヘッダーとフィルタが消える）。**状態に依存する部分を別のコンポーネントに分け**、そこで早期 return する。親の画面は、hook を呼んで固定部分を描く。

```tsx
export function PostList() {
  const { data, isPending, error, refetch } = useListPosts()
  return (
    <View>
      <PostListHeader />
      <PostListBody data={data} isPending={isPending} error={error} onRetry={refetch} />
    </View>
  )
}

function PostListBody({ data, isPending, error, onRetry }: Props) {
  if (isPending) return <Loading />
  if (error) return <ErrorView message={error.message} onRetry={onRetry} />
  if (!data || data.length === 0) return <EmptyView message='投稿がありません' />
  return <FlatList data={data} … />
}
```

* `data` の型は、生成された型（`Post[]`）を使う。手で書き直さない。

### 共通コンポーネント

`src/components/` に、1 ファイル 1 コンポーネントで置く。

| ファイル         | props                | 役割                           |
| ---------------- | -------------------- | ------------------------------ |
| `loading.tsx`    | なし                 | 読み込み中の表示               |
| `error-view.tsx` | `message`、`onRetry` | エラーメッセージと再試行ボタン |
| `empty-view.tsx` | `message`            | データが空のときの表示         |

## フォーム

検証を伴う入力フォームは、React Hook Form と Zod で書く（採用理由は[選定ライブラリ](./tech-stack.md#フォーム)）。検証のない単純な入力は、`useState` でよい。

* **スキーマは feature の `utils/` に置く。** 純粋なロジックなので、単体テストの対象になる。型は `z.infer` で取る。
* 入力は `Controller` で `TextInput` に接続する。エラー表示つきの共通入力コンポーネント `text-field.tsx` を `src/components/` に置き、各フォームはそれを使う。
* 送信中は二重送信を防ぐ。`formState.isSubmitting` を使い、送信ボタンを無効にする。
* `Pressable` の `onPress` に `handleSubmit(onSubmit)` をそのまま渡すと、イベントの型が合わず型エラーになる。`() => handleSubmit(onSubmit)()` と関数で包む。

```tsx
// src/features/items/utils/item-form.ts
export const itemFormSchema = z.object({
  name: z.string().min(1, '名前を入力してください')
})
export type ItemFormValues = z.infer<typeof itemFormSchema>
```

```tsx
// src/features/items/screens/item-create.tsx
const { control, handleSubmit, formState } = useForm<ItemFormValues>({
  resolver: zodResolver(itemFormSchema),
  defaultValues: { name: '' }
})

<Controller
  control={control}
  name='name'
  render={({ field, fieldState }) => (
    <TextField
      value={field.value}
      onChangeText={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  )}
/>
<Pressable
  accessibilityRole='button'
  disabled={formState.isSubmitting}
  onPress={() => handleSubmit(onSubmit)()}
>
  <Text>登録</Text>
</Pressable>
```

## メモ化

`experiments.reactCompiler` を有効にしているため（[開発環境と設定](./development.md#appjson-の既定)）、**`useCallback`・`useMemo`・`React.memo` は書かない。** React Compiler が自動でメモ化する。

* 対象は関数コンポーネントのアプリのコード。クラスコンポーネントは最適化されない。
* 最適化を外したいコンポーネントやファイルには、`'use no memo'` ディレクティブを書く。
