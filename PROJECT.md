
## App Overview

おはなしパレットは、子どもが iPad でタップしながら進める短い物語アプリです。  
ユーザーはテーマとことばを選び、画面をタップして物語を読み進めます。  
物語の続きはバックエンド API を通じて LLM が生成します。

このプロジェクトの初期版では、親子で実際に10回遊べる品質まで持っていくことを目標にします。  
最適化対象は「将来の拡張性」ではなく、「遊べる体験を素早く作ること」です。

---

## Product Goals

この初期版の目的は以下です。

- 子どもが iPad で迷わず操作できる
- 親子で5分以内に1話遊べる
- 1タップごとに自然な反応が返る
- 物語が短く、テンポよく進む
- 途中で閉じても localStorage から再開できる
- まずは親子で10回遊んで改善点を見つけられる状態にする

---

## Document Ownership

このリポジトリ内で、以下は `PROJECT.md` を正本として扱います。

- プロダクト制約
- API 契約
- 実装優先順位

他ドキュメントと差分がある場合は `PROJECT.md` を優先してください。

---

## Non-Goals

初期版では以下を実装しません。

- 認証
- ユーザー管理
- 複数ユーザー対応
- DB
- サーバー側セッション保存
- 課金
- 管理画面
- 作品一覧
- 複数端末同期
- 高度な分析基盤
- 将来拡張を見越した過剰な抽象化
- マイクロサービス化

AI は不要な汎用化や抽象化を行わないでください。  
初期版の体験を成立させるために必要な最小構成に留めてください。

---

## Target Users

- 主な利用者: 小さな子ども
- 一緒に見る人: 親
- 利用端末: 主に iPad
- 想定利用シーン: 親子で短時間遊ぶ

---

## UX Principles

このアプリでは以下を重視してください。

- 1画面1役割
- 大きいタップ領域
- 子どもが迷わないシンプルな導線
- テキストは短く
- 反応待ち中は無反応に見せない
- エラー時も子ども向けにやさしい表示にする
- 技術都合より体験を優先する

---

## Initial Scope

初期版で実装する範囲は以下です。

1. ホーム画面
2. テーマ / ことば選択画面
3. 生成中画面
4. おはなし表示画面
5. おしまい画面

機能としては以下を含みます。

- テーマを1つ選ぶ
- ことばを2〜3個選ぶ
- API で次の物語ステップを生成する
- 本文を表示する
- 必要に応じて2択の選択肢を表示する
- localStorage に進行中セッションを保存する
- 再開できる
- 最後まで進んだら終了画面を表示する
- 読み上げボタンを付ける（初期版はブラウザの SpeechSynthesis でよい）

---

## Theme And Keyword Catalog

初期版では、テーマごとに固定キーワード候補（6〜8個）を用意し、ユーザーが 2〜3個選ぶ方式にします。  
テーマごとの候補は以下を正本とします。

### でんしゃ

- あか
- もり
- くま
- えき
- トンネル
- にじ
- ほしぞら
- おべんとう

### うみ

- にんぎょ
- ほうせき
- かいがら
- くじら
- しま
- さんご
- たからばこ
- ひかり

---

## Core Architecture

### Frontend
- React
- iPad 前提の大きいタップ UI
- 状態はフロントエンドで保持する
- localStorage で途中復帰する

### Backend
- API は `POST /api/story/next` の1本のみ
- サーバーは stateless
- DB は使わない
- 認証は不要
- バックエンド内部では責務を分離する
- バックエンドリポジトリはフロントエンドと並列ディレクトリに置く（`../ohanashi-palette-backend/`）

### State Model
- ストーリーの進行状態はフロントエンドで保持する
- API には必要な履歴を毎回送る
- サーバーは永続状態を持たない

---

## Required Screen Flow

アプリの画面遷移は以下です。

1. Home
   - 「はじめる」
   - 進行中セッションがある場合のみ「つづきから」

2. Setup
   - テーマ選択
   - ことば選択
   - 開始ボタン

3. Loading
   - 「おはなしを つくってるよ…」などの短い表示
   - 無反応に見えないことを優先
   - **API 呼び出しのたびに（最初のステップ生成時も、続きのステップ生成時も）表示する**

4. Story
   - 本文表示
   - 読み上げボタン
   - 分岐なしの場合は「つぎへ」→ Loading へ遷移して次ステップを生成
   - 分岐ありの場合は2択ボタン → 選択後 Loading へ遷移して次ステップを生成
   - リセット導線を置いてもよい

5. Ending
   - 「おしまい」
   - もういちど → **Setup 画面に戻る（テーマ・ことばを選び直す）**
   - ホームへ

---

## API Contract

唯一の API は以下です。

### Endpoint

`POST /api/story/next`

### Request shape

start の場合:

```json
{
  "mode": "start",
  "theme": "でんしゃ",
  "keywords": ["あか", "もり", "くま"],
  "history": []
}
```

continue の場合:

```json
{
  "mode": "continue",
  "theme": "でんしゃ",
  "keywords": ["あか", "もり", "くま"],
  "history": [
    {
      "stepIndex": 1,
      "text": "あるひ、あかいでんしゃが もりのなかを はしっていました。",
      "selectedChoiceId": "choice_2",
      "selectedChoiceLabel": "トンネルに はいる"
    }
  ]
}
```

`history` の各要素は、以下のキーを常に含めてください。

- `selectedChoiceId`
- `selectedChoiceLabel`

分岐なしステップ（「つぎへ」進行）の場合は、両方とも `null` を入れます。  
分岐ありステップで選択した場合は、両方に文字列を入れます。

### Response shape

```json
{
  "stepIndex": 2,
  "text": "トンネルのなかは きらきら ひかっていて、むこうから ちいさな こえが きこえました。",
  "choices": [
    {
      "id": "choice_1",
      "label": "こえの ほうへ いく"
    },
    {
      "id": "choice_2",
      "label": "いそいで もどる"
    }
  ],
  "isEnd": false
}
```

終了時は以下。

```json
{
  "stepIndex": 5,
  "text": "あかいでんしゃは くまさんと いっしょに ほしぞらのしたを はしり、おおきな にじを みつけました。おしまい。",
  "choices": [],
  "isEnd": true
}
```

---

## Story Generation Rules

LLM 出力には以下の制約を課してください。

* 3〜6歳向けのやさしい日本語
* text は 1〜3文
* 文は短め
* こわすぎる展開は禁止
* 暴力的、性的、差別的、不適切な内容は禁止
* choices は `[]` または2件
* `isEnd=true` のとき choices は必ず空配列
* 1話は最大5ステップ程度で終わる
* 毎回「次の1ステップだけ」を生成する
* LLM の返答は JSON に限定する

LLM に全文を一気に作らせないでください。
API は「物語全体を返すもの」ではなく、「次の一歩を返すもの」として扱ってください。

---

## Frontend State Requirements

フロントエンドでは以下の状態を持ってください。

* theme
* keywords
* steps
* current progress
* ended / playing status
* `steps[*].selectedChoiceId` と `steps[*].selectedChoiceLabel` は必須キーにする（値は `string | null`）

進行中セッション全体を localStorage に保存してください。
キーは 1個でよいです。例:

`ohanashi-palette.current-session`

セーブタイミングの例:

* セットアップ完了時
* API 応答受信時
* 選択肢決定時
* ステータス変更時

再開ルール:

* `playing` のときは「つづきから」を表示
* `ended` の current session は消してよい

---

## Backend Internal Design Rules

外部 API は1本ですが、内部責務は分離してください。
最低限、以下の責務で分けてください。

* request validation
* prompt building
* llm client call
* llm json parsing
* response validation
* api response shaping

HTTP ハンドラにロジックを詰め込まないでください。

---

## Recommended Directory Structure

### Frontend

```text
ohanashi-palette-frontend/
├─ src/
│  ├─ app/
│  │  ├─ App.tsx
│  │  ├─ routes.ts
│  │  └─ providers.tsx
│  ├─ pages/
│  │  ├─ HomePage.tsx
│  │  ├─ SetupPage.tsx
│  │  ├─ LoadingPage.tsx
│  │  ├─ StoryPage.tsx
│  │  └─ EndingPage.tsx
│  ├─ components/
│  │  ├─ layout/
│  │  ├─ story/
│  │  └─ setup/
│  ├─ features/
│  │  └─ story/
│  │     ├─ api.ts
│  │     ├─ storage.ts
│  │     ├─ session.ts
│  │     ├─ reducers.ts
│  │     ├─ hooks.ts
│  │     ├─ types.ts
│  │     └─ constants.ts
│  ├─ utils/
│  ├─ styles/
│  └─ main.tsx
```

### Backend

```text
ohanashi-palette-backend/
├─ src/
│  ├─ index.ts
│  ├─ routes/
│  │  └─ storyNext.ts
│  ├─ domain/
│  │  └─ story/
│  │     ├─ buildStoryPrompt.ts
│  │     ├─ validateStoryRequest.ts
│  │     ├─ validateStoryResponse.ts
│  │     ├─ storySchemas.ts
│  │     └─ storyTypes.ts
│  ├─ infra/
│  │  └─ llm/
│  │     ├─ client.ts
│  │     └─ generateJson.ts
│  ├─ utils/
│  └─ config/
```

この構成をベースにしてください。
勝手に大きな再設計はしないでください。

---

## UI Requirements

* iPad 前提のレイアウト
* 押せる要素は大きくする
* 余白を広く取る
* 1画面に詰め込みすぎない
* 文字は大きめ
* 子どもが押すボタンを明確に見せる
* ローディング中の無反応感を避ける
* StoryPage が最重要画面

UI はデスクトップ向け業務アプリのようにしないでください。
子ども向けの、やさしく明快な見た目を優先してください。

---

## Error Handling

子ども向けアプリなので、技術的なエラーをそのまま見せないでください。

失敗時の UI は以下のような方針にしてください。

* 短くやさしいメッセージ
* 再試行ボタン
* ホームに戻る導線
* 開発者向け詳細はログに出す

例:

* 「ごめんね、もういちど やってみよう」
* 「はじめにもどる」

---

## Implementation Priorities

実装優先順位は以下です（この順序を正本とします）。

1. 画面骨組み
2. 画面遷移
3. フロント状態管理
4. localStorage 復帰
5. バックエンドのダミー API
6. フロント・バックエンド接続
7. 実際の LLM 接続
8. 読み上げボタン
9. エラー / ローディング改善

過度な最適化や共通化は後回しにしてください。

---

## Coding Rules

* TypeScript を使う
* 型を明示する
* JSON contract を崩さない
* LLM 応答は必ずバリデーションする
* UI と API の責務を混ぜない
* 小さく単純に保つ
* 過剰な抽象化を避ける
* コメントは必要最小限にする
* 読みやすさを優先する
* まず動くものを作る

避けること:

* 未使用の汎用レイヤー
* 未来のためだけの interface 設計
* 初期版で不要な custom hook の乱立
* 目的の薄い state library 導入
* 不必要な design pattern の持ち込み

---

## Definition of Done

初期版の完成条件は以下です。

* ホームから開始できる
* テーマとことばを選べる
* 物語の最初の1ステップを生成できる
* その後の continue が動く
* 2択または「つぎへ」で進める
* 最大5ステップ程度で終了できる
* localStorage から途中再開できる
* エラー時に再試行できる
* 親子で実際に10回試せる最低限の品質になっている

この時点では、拡張性よりも遊べることを優先してください。

---

## Final Instruction To The Coding Agent

このプロジェクトでは、SaaS 的な構成や将来の大規模拡張を前提にしないでください。
価値の中心は、子どもが iPad で気持ちよく物語を進められることです。

重要なのは以下です。

* UI は単純で大きく
* API は1本
* 状態はフロント保持
* サーバーは stateless
* DB なし
* 認証なし
* まず親子で10回遊べる状態まで持っていく

迷ったら、複雑な構造ではなく、より小さく単純な構造を選んでください。

