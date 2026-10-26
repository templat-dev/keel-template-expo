# 開発環境と設定

Expo アプリの開発環境と設定のルール。置き場は[フォルダ構成](./folder-structure.md)、使うライブラリは[選定ライブラリ](./tech-stack.md)が持つ。本資料は「どう設定し、どう動かすか」を扱う。

## 環境変数

### ファイル

| ファイル           | リポジトリに                              | 内容                                                 |
| ------------------ | ----------------------------------------- | ---------------------------------------------------- |
| `.env.example`     | 入れる（コミット）                        | 必要なキーの見本。説明と既定値を書く                 |
| `.env.local`       | 入れない（`.gitignore` の `.env*.local`） | 各自の端末固有の値。`.env.example` をコピーして作る  |
| `.env.development` | 入れる（空）                              | 開発時の値。環境ごとに値が違うときにアプリが書く     |
| `.env.production`  | 入れる（空）                              | 本番ビルドの値。環境ごとに値が違うときにアプリが書く |

* `.env.local` はテンプレートに含まれない。コピーして作る: `cp .env.example .env.local`
* `.env.development` と `.env.production` はコミットされる。**書いてよいのは公開してよい値だけ**（次節）。
* 読み込みの優先順位（上ほど優先）
  * 開発（`expo start`）: `.env.development.local` → `.env.local` → `.env.development` → `.env`
  * 本番（`expo export`）: `.env.production.local` → `.env.local` → `.env.production` → `.env`
* `.env.local` は開発でも本番でも効く。ローカルで本番ビルドを試すときは、`.env.local` の値が残っていないか確かめる。
* `.env.staging` のような標準外の名前は、SDK 58 以降では読み込まれない。

### 書き方

* クライアントに渡す値は、名前を `EXPO_PUBLIC_` で始める。
* **`EXPO_PUBLIC_` の値はバンドルに埋め込まれ、利用者から平文で見える。** 秘密鍵・トークンは入れない。秘密が要る処理はバックエンドに置く。
* 参照は `process.env.EXPO_PUBLIC_XXX` とドット記法で静的に書く。ブラケット記法（`process.env["XXX"]`）や分割代入は埋め込まれず、動かない。
* 値は `src/constants.ts` の 1 か所で読み、他の場所はそこから使う。

### 実機から接続するとき

* 実機からは `localhost` が使えない（端末自身を指す）。ローカルのサーバーに接続するときは、`.env.local` に PC の LAN IP を書く。

### 値を変えたとき

* `.env` の値を変えても、Expo CLI の再起動やキャッシュ削除は要らない。アプリを完全にリロードする（Expo Go や開発ビルドでシェイクして Reload）。

## 開発ビルドと Expo Go

日常の開発は、**開発ビルド**で行う。開発ビルドは、自分のアプリをビルドした「自分専用の Expo Go」で、任意のネイティブライブラリを使える。Expo の公式も、ストアに出すアプリには開発ビルドを推奨している。

* `expo-dev-client` を依存に入れる: `npx expo install expo-dev-client`
* Expo Go は、環境を試すだけの確認や、ネイティブモジュールを使わない小さな検証に限る。**Expo Go で動くことを前提にコードを書かない。**
* iOS の実機で動かすには、有料の Apple Developer Program が必要。

### 開発ビルドの作り方

どちらを使ってもよい。

| 方法 | コマンド | 必要なもの |
| --- | --- | --- |
| ローカルビルド | `npx expo run:ios` / `npx expo run:android`（実機は `--device`） | Xcode、Android Studio。Expo アカウントは不要 |
| EAS ビルド | `eas build --profile development --platform <ios\|android>` | Expo アカウント、`eas-cli`。iOS シミュレータ向けは `eas.json` の `ios.simulator` を `true` にする |

ビルドを入れたら、`npx expo start` で開発サーバーを起動して接続する。

### 再ビルドが要るとき

JavaScript / TypeScript だけの変更なら、再ビルドは要らない（開発サーバーに反映される）。次のときは再ビルドする。

* ネイティブライブラリを追加・更新したとき（追加には `npx expo install` を使う。SDK に合う版が入る）
* `app.json` を変更したとき
* Expo SDK を更新したとき

Web 版（Playwright の E2E）には影響しない。

## Lint・Format・型

### Lint

* ESLint と `eslint-config-expo`（flat config）を使う。`npx expo lint` で実行する。設定は `eslint.config.js`。
* 生成物（`src/api/generated/`）は検査しない。

### Format

* Prettier を、ESLint のプラグイン（`eslint-plugin-prettier`）経由で実行する。整形の違反も `lint` で検出される。
* 設定は `.prettierrc`。**Standard Style（StandardJS）に準拠する。** 共有設定 `prettier-config-standard` と同じ値で、Prettier 3 の既定値と違う次の 4 項目だけを書く（パッケージには依存しない）。
  * `semi: false`（セミコロンなし）
  * `singleQuote: true`（文字列はシングルクォート）
  * `jsxSingleQuote: true`（JSX の属性値もシングルクォート）
  * `trailingComma: none`（末尾のカンマなし。Prettier 3 の既定は `all`）
* Expo の公式ガイドは、Prettier の設定の例を示していない。上の準拠は、このテンプレートの選択。
* 生成物は整形しない（`.prettierignore`）。整形すると、生成のたびに全行が書き換わる。
* 整形は `npm run format`（`prettier --write .`）で行う。

インストールは `npx expo install prettier eslint-config-prettier eslint-plugin-prettier --dev`。

### 型

* TypeScript は strict。`tsconfig.json` は `expo/tsconfig.base` を継承し、`@/*` を `./src/*` に解決する。
* 型の検査は `npm run typecheck`（`tsc --noEmit`）。

### スクリプト

`package.json` のスクリプト名はそろえる。

| スクリプト | 内容 |
| --- | --- |
| `start` / `ios` / `android` / `web` | 開発サーバーの起動 |
| `lint` | `expo lint` |
| `format` | `prettier --write .` |
| `typecheck` | `tsc --noEmit` |
| `test` / `test:watch` | Vitest（[テスト](./testing.md)） |
| `e2e` | Playwright（[テスト](./testing.md)） |
| `generate` | `orval`（API クライアントの生成） |

## 依存パッケージ

* 追加は `npx expo install <パッケージ>` で行う。プロジェクトの `react-native` に合うバージョンが選ばれる。`npm install` の代わりに使え、Expo 管轄外のパッケージもそのまま入る。
* Expo が管理するパッケージのバージョン範囲（`~` で始まるもの）は、手で書き換えない。
* バージョンの不整合は `npx expo install --check` で検出する（不整合があると非ゼロで終了するので、CI で使える）。`npx expo install --fix` で直す。
* パッケージマネージャーは npm。Expo の公式ドキュメントと既知の不具合の情報が、npm を前提にしているため。`package-lock.json` はコミットする。
* Node は `package.json` の `engines` で宣言する: `"engines": { "node": "^24.3.0" }`。Node 24 は LTS で、`react-native` の要求（24 系なら 24.3.0 以上）に合う。`engines` は宣言なので、バージョンの切り替えは各自のツールで行う。
* Expo SDK の更新は、1 回に 1 つずつ上げる。手順は公式のアップグレードガイドに従う。更新後は開発ビルドを作り直す。

## app.json の既定

`app.json` に、次の既定を入れている。アプリごとに変えてよいものと、アプリごとに決めるものを分ける。

| 項目 | 既定 | 補足 |
| --- | --- | --- |
| `name` / `slug` / `scheme` | プレースホルダ | 新しいアプリ名に置き換える。`scheme` はディープリンク用で、小文字で始める。ビルド時の設定なので Expo Go では効かない |
| `version` | `"1.0.0"` | 公開バージョン |
| `orientation` | `"portrait"` | 縦固定。ロックしないなら `"default"` |
| `userInterfaceStyle` | `"automatic"` | 端末のライト / ダークに従う。Android では `expo-system-ui` が要る。`theme.ts` で両方に対応する。未指定だと `light` 固定になる |
| `web.output` | `"single"` | SPA（既定）。動的ルートがそのまま動く。ルートごとの HTML が要る（SEO が必要な）アプリは `"static"` にする。その場合、動的ルートには `generateStaticParams` が要る |
| `experiments.typedRoutes` | `true` | 型付きの `href`（[フォルダ構成](./folder-structure.md#1-srcapp-は-route-専用)） |
| `experiments.reactCompiler` | `true` | 自動でメモ化される。`useCallback`・`useMemo`・`React.memo` は書かない（[画面の書き方](./screens.md#メモ化)） |
| `plugins` | `["expo-router"]` | 権限の説明文などが要るプラグインは、使うアプリが足す |

アプリごとに決めるもの（既定では入れない）。

* `ios.bundleIdentifier` / `android.package`: ストアで一意の ID。最初の EAS ビルドの前に決める。
* `ios.config.usesNonExemptEncryption`: 暗号化の輸出規制の回答。アプリの実態に合わせて決める。
* EAS Update（`runtimeVersion`・`updates`）: 必要なアプリが足す。
* アイコン、スプラッシュ画面: 画像を用意したアプリが足す。

`newArchEnabled` は設定せず、SDK の既定に任せる。`app.config.ts` は、環境ごとに動的な値が要るときだけ使う（静的な `app.json` を既定とする）。

React Compiler は、SDK 54 以降は Babel が自動設定される。SDK 55 以降は、lint のルールも `eslint-config-expo` に入っている。`babel.config.js` を変えたら、`npx expo start --clear` で Metro を再起動する。

## ビルドと配布（EAS）

`eas.json` に、ビルドの種類（プロファイル）を 3 つ定義している。

| プロファイル  | 用途                                           | 配布               |
| ------------- | ---------------------------------------------- | ------------------ |
| `development` | 開発ビルド（日常の開発に使う自分専用のアプリ） | 内部（`internal`） |
| `preview`     | 検証用。社内やテスターに配る                   | 内部（`internal`） |
| `production`  | ストアに出す本番用                             | ストア             |

* ビルド時の環境変数は、プロファイルの `env` で渡す。値は公開してよいものだけ。
* ストアに出さないアプリ（Web だけのアプリなど）は、`eas.json` を削除してよい。
