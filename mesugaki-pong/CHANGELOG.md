# Changelog

## [1.2.0](https://github.com/HappyOnigiri/game-portal/compare/mesugaki-pong-v1.1.0...mesugaki-pong-v1.2.0) (2026-02-23)


### Features

* CI設定の追加とMakefileの改善 ([d9dbce7](https://github.com/HappyOnigiri/game-portal/commit/d9dbce7bd61ecf18a939accd6bd6fdd218d6a63f))
* mesugaki-pong に favicon を追加 ([41714ed](https://github.com/HappyOnigiri/game-portal/commit/41714ed83f9f129a5f30323de1423c30eea2158b))
* mesugaki-pong に favicon を追加 ([c15f393](https://github.com/HappyOnigiri/game-portal/commit/c15f3937f5b1519e56d55853fdc3dad87cdf3001))
* mesugaki-pongのサムネイル画像をハイブリッド方式に移行 ([dcaee4a](https://github.com/HappyOnigiri/game-portal/commit/dcaee4a734cfefae169988ff993211df842ed1bb))
* アプリケーションのバージョン管理の標準化とCIスクリプト/スキルの統合 ([869887b](https://github.com/HappyOnigiri/game-portal/commit/869887b1ee038908ea3480fcfb9baccdfaee4be1))
* アプリの設定情報をルートの apps.json での一括管理に移行 ([a1a332a](https://github.com/HappyOnigiri/game-portal/commit/a1a332a1fb778515814575cc4416c2345c6c377e))
* アプリ情報を一括管理するための apps.json を導入し、各アプリの古い設定を削除 ([16d5c5b](https://github.com/HappyOnigiri/game-portal/commit/16d5c5b777f82439dc8a19bb967b6a4d1a51c46b))
* タイピングゲーム「量子マグロ亭」の追加と開発環境の標準化 ([d081457](https://github.com/HappyOnigiri/game-portal/commit/d081457d0629fa76824f7af8046a7312484ddd7a))


### Bug Fixes

* **pong:** グローバルな p タグのスタイルをフッターテキストで上書きし、色とサイズが正しく適用されるように修正 ([12c95cd](https://github.com/HappyOnigiri/game-portal/commit/12c95cdb82364eaacf2948a5d9b959211fb4c4c4))
* ゲームオーバー時のリスタート判定をリスタートボタンのみに制限 ([6503f22](https://github.com/HappyOnigiri/game-portal/commit/6503f22e071d22207c10eab7708ea5b162dac738))
* リスタートボタンのみでゲームを再開できるように修正 ([5ddbfd7](https://github.com/HappyOnigiri/game-portal/commit/5ddbfd7977a8064665c164efc1fc95d1a20f8daf))
* 固定タイムステップを導入してリフレッシュレート依存の速度差を解消 ([3a09c48](https://github.com/HappyOnigiri/game-portal/commit/3a09c480388bad01d9799dd34bb1c9b7b094cbd8))
* 固定タイムステップ導入によるゲームスピードの均一化 ([ae8cc22](https://github.com/HappyOnigiri/game-portal/commit/ae8cc221f1322106dcf8c93786abd1ac5ae9b61a))
* 高スコア時にメッセージが即座に消えるバグとゲームオーバー時にメッセージが消える問題を修正 ([f87b358](https://github.com/HappyOnigiri/game-portal/commit/f87b358afe570dd60f2f42e0ba4c318f89edb8a6))
