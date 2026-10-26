# 選定ライブラリ

このテンプレートが採用するライブラリと、その使い方。置き場は[フォルダ構成](./folder-structure.md)が持つ。本資料は「何を使うか、なぜか、どう使うか」を扱う。

## 採用一覧

| 領域                   | 採用                  | 備考                                                                                         |
| ---------------------- | --------------------- | -------------------------------------------------------------------------------------------- |
| ルーティング           | Expo Router           | ファイルベース。route の書き方は[フォルダ構成](./folder-structure.md#1-srcapp-は-route-専用) |
| データ取得・キャッシュ | TanStack Query        |                                                                                              |
| クライアント状態       | Jotai                 | サーバー状態以外の状態。使い方は下の「クライアント状態（Jotai）」                            |
| フォーム               | React Hook Form + Zod | 検証を伴う入力フォーム。使い方は下の「フォーム」と[画面の書き方](./screens.md#フォーム)      |
| API クライアントの生成 | Orval                 | OpenAPI 契約から、型・API 呼び出し関数・TanStack Query の hook を生成する                    |
| 通信                   | 標準の `fetch`        | Orval の mutator に認証ヘッダと 401 処理を集約する                                           |
| トークンの保存         | `expo-secure-store`   | ネイティブのみ。Web は `httpOnly` Cookie。方針は[認証](./auth.md)                            |
| スタイル               | `StyleSheet`（標準）  | アプリごとに変えてよい                                                                       |
| 単体テスト             | Vitest（node 環境）   | 純粋なロジックだけが対象。方針は[テスト](./testing.md)                                       |
| E2E テスト             | Playwright            | Web 版（react-native-web）が対象。方針は[テスト](./testing.md)                               |

ここに無い領域（アニメーション、国際化など）は未決。アプリごとに選び、そのアプリの `CLAUDE.md` に書く。新しいライブラリの追加は、事前に提案する。

## クライアント状態（Jotai）

サーバーの状態は TanStack Query が持つ。Jotai が持つのは、それ以外の状態（認証ユーザー、入力途中の下書き、UI の一時状態など）。

* Provider は置かない。Provider なしで使うと既定のストアが使われる。
* React Context は、変化の少ない値（テーマ・ロケールなど）と、ライブラリが要求する Provider（`QueryClientProvider` など）に限る。変化の多い値には使わない。
* atom の置き場は、専用のフォルダを作らず、使うファイルに直接書いてよい（[フォルダ構成](./folder-structure.md#3-昇格ルール共通フォルダへの移動)）。
* React の外（mutator など）から読み書きするときは、`getDefaultStore()` で取った既定のストアに `get` / `set` する。たとえば、API が 401 を返したときに、mutator が認証状態の atom を未ログインへ戻せる。
* 永続化は `atomWithStorage` を使う。React Native では `createJSONStorage` に AsyncStorage を渡す。AsyncStorage は非同期なので、atom の値は Promise になり、現在の値を見て更新するときは `await` が要る。
* **認証トークンなど秘密の値は、`atomWithStorage`（AsyncStorage）に入れない。** 保存先の規約は[認証](./auth.md)が持つ。

## フォーム（React Hook Form + Zod）

検証を伴う入力フォームは、React Hook Form（RHF）と Zod で書く。検証のない単純な入力は、`useState` でよい。

* RHF は React Native でも使える。入力は `Controller` でラップし、`field` の `onChange` / `onBlur` / `value` を `TextInput` の `onChangeText` / `onBlur` / `value` に接続する。
* 検証のスキーマは Zod で定義し、`@hookform/resolvers` の `zodResolver` を `useForm` の `resolver` に渡す。型は `z.infer` で取る。
* Zod v4 を使うときは、`@hookform/resolvers` を 3.10 以上にし、`tsconfig.json` の `moduleResolution` を `"bundler"`・`"node16"`・`"nodenext"` のいずれかにする（合わないと `Cannot find module '@hookform/resolvers/zod'` になる）。
* Orval の Zod 生成（`client: 'zod'`）は、テンプレートでは使わない。フォームの項目は API のリクエスト本文と一致しないことが多く、フォーム専用のスキーマのほうが素直なため。一致するアプリが、必要なら足す。

## API クライアントの生成（Orval）

### 役割

* `src/api/openapi.yaml` から、型・API 呼び出し関数・TanStack Query の hook を生成する。契約をバックエンドと共有するアプリは、`orval.config.ts` の入力パスを共有の場所に向けてよい。
* 通信ライブラリではない。通信は標準の `fetch` で行い、認証ヘッダと 401 処理は mutator（`src/api/mutator.ts`）に集約する。
* 生成物は `src/api/generated/` に置く。**手で編集しない。** 型が合わないときは OpenAPI 契約を直して再生成する。
* 設定ファイル（`orval.config.ts`）は `src/` の外（リポジトリ直下）に置く。

### 採用理由

* hook まで生成でき、手書きを最小にできる。
* 画面から URL の文字列が消え、関数名の typo をコンパイルで検出できる。
* 8.x で安定している。

### 弱点と補い方

* キャッシュキーの形が生成側で決まり、暗黙になる。
* 補い方は 2 つ。更新で捨てる対象を「操作 → 捨てる対象」の表で明示する。無効化のテストで取りこぼしを検出する。

## 取得と更新の呼び方（TanStack Query + Orval）

### 取得

生成された hook を、画面から直接呼んでよい。URL の文字列もキャッシュキーも画面に出てこないため、手書きの hook で包む理由がない。

```tsx
const { data } = useGetItem(itemId);
```

hook の名前は OpenAPI の `operationId` に由来する。

### 更新

生成された hook を画面から直接呼んでよい。ただし、**更新後にキャッシュの無効化などの処理が要るときだけ**、feature の `hooks/` に包んだ hook を作る。無効化の要らない更新は、包まない。

```tsx
// src/features/items/hooks/use-create-item.ts
export function useCreateItem() {
  const queryClient = useQueryClient();
  return usePostItems({
    mutation: {
      onSuccess: () => {
        // 「操作 → 捨てる対象」の表のとおりに無効化する
        queryClient.invalidateQueries({ queryKey: getGetItemsQueryKey() });
      },
    },
  });
}
```

`useGetItem`・`usePostItems` などの名前は、OpenAPI の `operationId` から決まる例。

### 無効化を 1 か所にまとめる選択肢

更新が多いアプリは、`QueryClient` の `MutationCache` に共通の `onSuccess` を置き、更新ごとに `meta` で「何を捨てるか」を付ける方式も選べる。画面にもラップ hook にも、無効化のコードを書かなくて済む。更新が少ないうちは、上の包んだ hook で足りる。

### feature の `hooks/` に残るもの

* 無効化などを伴う更新のラップ
* 複数の生成 hook を組み合わせる合成（画面の状態、入力フォーム、派生値）
* 画面の挙動（フォーカス時の再取得など）
