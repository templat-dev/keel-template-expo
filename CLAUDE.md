# keel-template-expo

Expo アプリの共通ベース。「この構成でアプリを作って」と頼まれたときの、フォルダ構成・選定ライブラリ・開発環境・テスト方針を定める。

## 資料

* [フォルダ構成](./docs/folder-structure.md): どこに置くか（route、feature、共通フォルダ、platform 別コード、style と test）
* [選定ライブラリ](./docs/tech-stack.md): 何を使うか、なぜか、どう使うか（TanStack Query、Orval）
* [開発環境と設定](./docs/development.md): 環境変数、ビルドと配布（EAS）
* [テスト](./docs/testing.md): 何をどのテストで確かめるか（Vitest、Playwright）
* [画面の書き方](./docs/screens.md): データ取得を伴う画面の 4 状態

**同じ事実は 1 か所にだけ書く。** 置き場はフォルダ構成、ライブラリの採用理由と使い方は選定ライブラリ、設定と動かし方は開発環境と設定、テストの方針はテスト、画面の書き方は画面の書き方が持つ。

## 常に守ること

* `src/app/` には route と `_layout` などの規約ファイルだけを置く。画面本体は `src/features/<name>/screens/` に書き、route は薄く保つ
* feature 同士は直接 import しない。別の feature のものが必要になったら、共通フォルダへ昇格させてから使う
* 2 つ目の feature で必要になるまでは、先回りして共通化しない
* データを取得する画面は、Loading・Error・Empty・Data の 4 状態を必ず扱う
* `src/api/generated/` は生成物。手で編集しない
* `EXPO_PUBLIC_` の値はバンドルに埋め込まれ、利用者から見える。秘密鍵・トークンは入れない
* ファイル名は kebab-case に統一する。test は対象ファイルの隣に置く
* Expo は破壊的変更が多い。ライブラリの API に触る前に、使用中の版の公式ドキュメントを確認する
