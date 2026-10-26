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

## ビルドと配布（EAS）

`eas.json` に、ビルドの種類（プロファイル）を 3 つ定義している。

| プロファイル  | 用途                                           | 配布               |
| ------------- | ---------------------------------------------- | ------------------ |
| `development` | 開発ビルド（日常の開発に使う自分専用のアプリ） | 内部（`internal`） |
| `preview`     | 検証用。社内やテスターに配る                   | 内部（`internal`） |
| `production`  | ストアに出す本番用                             | ストア             |

* ビルド時の環境変数は、プロファイルの `env` で渡す。値は公開してよいものだけ。
* ストアに出さないアプリ（Web だけのアプリなど）は、`eas.json` を削除してよい。
