# keel-template-expo

Expo アプリの共通ベース。フォルダ構成・選定ライブラリ・開発環境・テスト方針を決めた上で、動くサンプルアプリを載せている。ここから新しいアプリを作る。

* ルーティング: Expo Router
* 状態・データ: TanStack Query、Jotai、Orval（OpenAPI から API クライアントを生成）
* フォーム: React Hook Form + Zod
* スタイル: NativeWind（Tailwind CSS v3）
* テスト: Vitest（単体）、Playwright（E2E）

決めたことと、その理由は [docs/](./docs/) にある。AI（Claude）に作業を頼むときの入口は [CLAUDE.md](./CLAUDE.md)。

## 実行手順

必要なもの: Node 24（`package.json` の `engines` は `^24.3.0`）。

```bash
nvm use 24                       # Node を 24 にする（nvm の場合）
npm install
cp .env.example .env.local       # 接続先の API を設定する（.env.local はコミットされない）
npm run web                      # http://localhost:8081 をブラウザで開く
```

* iOS / Android では、Expo Go ではなく**開発ビルド**で動かす（`npm run ios` / `npm run android`）。作り方は [開発環境と設定](./docs/開発環境と設定.md#開発ビルドと-expo-go) を見る。
* サンプルは、公開の [JSONPlaceholder](https://jsonplaceholder.typicode.com) に接続する。投稿（POST）は保存されないので、作成しても一覧には出ない。

## コマンド

| コマンド                                                        | 内容                                                                      |
| --------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `npm start` / `npm run web` / `npm run ios` / `npm run android` | 開発サーバーの起動                                                        |
| `npm run lint`                                                  | ESLint と Prettier の検査                                                 |
| `npm run format`                                                | Prettier で整形                                                           |
| `npm run typecheck`                                             | 型の検査（typed routes の型を生成してから `tsc`）                         |
| `npm test`                                                      | 単体テスト（Vitest）                                                      |
| `npm run e2e`                                                   | E2E テスト（Playwright）。初回は `npx playwright install chromium` が要る |
| `npm run generate`                                              | `src/api/openapi.yaml` から API クライアントを生成（Orval）               |

## サンプルアプリ

投稿の一覧・詳細・作成と、設定の画面。構成の使い方の見本になる。

| 画面                 | 見本になっていること                                                                                            |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| ホーム（投稿の一覧） | 生成された hook でのデータ取得、クエリパラメータでの絞り込み、4 状態（Loading・Error・Empty・Data）、`FlatList` |
| 投稿の詳細           | 動的ルート（route で `id` を読み、props で画面に渡す）、データに依存するタイトル                                |
| 投稿の作成           | React Hook Form + Zod、更新後のキャッシュの無効化、入力中に離れるときの確認（`Dialog`）                         |
| 設定                 | Jotai の atom（AsyncStorage に保存）、複数の feature で使うので `src/hooks/` に置く                             |

## 資料

| 資料                                           | 内容                                                |
| ---------------------------------------------- | --------------------------------------------------- |
| [フォルダ構成](./docs/フォルダ構成.md)         | どこに置くか                                        |
| [選定ライブラリ](./docs/選定ライブラリ.md)     | 何を使うか、なぜか、どう使うか                      |
| [開発環境と設定](./docs/開発環境と設定.md)     | 環境変数、開発ビルド、Lint・Format、`app.json`、EAS |
| [テスト](./docs/テスト.md)                     | 何をどのテストで確かめるか                          |
| [画面の書き方](./docs/画面の書き方.md)         | 4 状態、フォーム、ダイアログ、一覧、メモ化          |
| [認証](./docs/認証.md)                         | トークンの保存と扱い                                |
| [AIとの進め方](./docs/AIとの進め方.md)（任意） | 依存の追加、完了の報告、公式ドキュメントの確認      |
