
## App Overview

おはなしパレットは、子どもが iPad でタップしながら進める短い物語アプリです。  
ユーザーはテーマとことばを選び、画面をタップして物語を読み進めます。  
テーマは固定の候補から選ぶほか、選択式のオンボーディングで答えた「すきなもの」から LLM が生成した候補を選べます。  
物語の続きはバックエンド API を通じて LLM が生成します。

このプロジェクトでは、子どもが「また遊びたい」と思い、繰り返し遊べる品質まで持っていくことを目標にします。  
最適化対象は「将来の拡張性」ではなく、「遊べる体験を素早く作ること」です。

---

## Product Goals

この初期版の目的は以下です。

- 子どもが iPad で迷わず操作できる
- 5分以内に1話遊べる（ひとりでも、親子でも）
- 1タップごとに自然な反応が返る
- 物語が短く、テンポよく進む
- 途中で閉じても localStorage から再開できる
- 子どもが繰り返し遊べる（遊ぶたびにちがうテーマ・ちがうおはなしになる）
- 子どもの「すきなもの」に合うテーマにたどり着ける

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

- 主な利用者: 6〜10歳の女の子・男の子
- 一緒に見る人: 親（いなくても遊べる）
- 利用端末: 主に iPad
- 想定利用シーン: ひとりで、または親子で短時間遊ぶ
- 8〜10歳になると女の子と男の子で興味のあるテーマが大きく分かれるため、テーマは固定にせず、子ども自身の「すきなもの」から生成する
- 性別は聞かない。興味の質問への答えだけで、それぞれの子に合うテーマへたどり着けるようにする

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
2. オンボーディング画面（すきなものを選ぶ）
3. テーマ候補画面（生成されたテーマから選ぶ）
4. テーマ / ことば選択画面
5. 生成中画面
6. おはなし表示画面
7. おしまい画面

機能としては以下を含みます。

- 選択式のオンボーディング（3〜4問）で「すきなもの」を答える
- 答えから LLM がテーマ候補を生成する（固定テーマから選ぶこともできる）
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

テーマは2通りの方法で決まります。

1. 生成テーマ（主な導線）: オンボーディングの答えから `POST /api/theme/suggest` が生成する。各テーマはことば候補（6〜8個）を持つ
2. 固定テーマ（すぐ遊ぶ導線、生成失敗時の予備）: 以下のカタログ

どちらの場合も、ユーザーはことばを 2〜3個選びます。  
固定テーマの候補は以下を正本とします。固定テーマの `textStyle` はすべて `hiragana` です。

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
- オンボーディングの答えも localStorage に保存する

### Backend
- API は `POST /api/story/next` と `POST /api/theme/suggest` の2本のみ
- サーバーは stateless
- DB は使わない
- 認証は不要
- バックエンド内部では責務を分離する
- バックエンドリポジトリはフロントエンドと並列ディレクトリに置く（`../ohanashi-palette-backend/`）
- バックエンドは Google Cloud Run で動かす前提にする
- LLM 呼び出しはバックエンドのみで行い、フロントエンドから直接呼ばない

### State Model
- ストーリーの進行状態はフロントエンドで保持する
- API には必要な履歴を毎回送る
- サーバーは永続状態を持たない

---

## Required Screen Flow

アプリの画面遷移は以下です。

1. Home
   - 「すきなものから えらぶ」→ Onboarding
   - 「すぐ あそぶ」→ Setup（固定テーマ）
   - 進行中セッションがある場合のみ「つづきから」

2. Onboarding
   - 保存済みの答えがない場合: 質問に答える
   - 保存済みの答えがある場合: 「まえと おなじ こたえで」（質問を飛ばして ThemeSuggest へ）と「こたえなおす」（毎回答え直す）を選べる
   - 1画面1問、選択式、3〜4問。選択肢はひらがなの答えと漢字入りの答えを混ぜる
   - 最初に、漢字の範囲（小学1〜4年生）を選ぶ。既定は小学2年生。保存し、次回からは変更したいときだけ変える
   - 質問と選択肢は固定でフロントエンドに持つ（正本は本ファイルに追記する）

3. ThemeSuggest
   - Loading を挟んで `POST /api/theme/suggest` を呼び、テーマ候補を4つ表示する
   - 漢字テーマには「小学○年生までの漢字」と表示する
   - 「ほかの テーマ」で、表示中の候補を除外して生成し直せる
   - テーマを選ぶと Setup（そのテーマのことば選択）へ
   - 生成に失敗した場合は固定テーマを代わりに表示する

4. Setup
   - テーマ選択（固定テーマの場合のみ）
   - ことば選択
   - 開始ボタン

5. Loading
   - 「おはなしを つくってるよ…」などの短い表示
   - 無反応に見えないことを優先
   - **API 呼び出しのたびに（テーマ生成時、最初のステップ生成時、続きのステップ生成時）表示する**

6. Story
   - 漢字テーマの場合は「小学○年生までの漢字」と表示する
   - 本文表示
   - 読み上げボタン
   - `stepIndex` が 1〜4 の間は通常進行 UI（「つぎへ」または2択）のみを表示
   - `stepIndex` が 5〜9 かつ `isEnd=false` の間は通常進行 UI に加えて「おしまい」ボタンを表示
   - `stepIndex` が 10 以上かつ `isEnd=false` の場合は通常進行 UI を表示せず、「おしまい」ボタンのみ表示
   - 「おしまい」ボタン押下時は Loading を経由して締めの1ステップを生成し、Story で表示してから Ending へ進める
   - 分岐なしの場合は「つぎへ」→ Loading へ遷移して次ステップを生成
   - 分岐ありの場合は2択ボタン → 選択後 Loading へ遷移して次ステップを生成
   - リセット導線を置いてもよい

7. Ending
   - 「おしまい」
   - もういちど → 生成テーマで遊んだ場合は **ThemeSuggest に戻り新しい候補を生成する**。固定テーマの場合は **Setup に戻る**
   - ホームへ

---

## API Contract

API は以下の2本です。

1. `POST /api/story/next`: 物語の次の1ステップを生成する
2. `POST /api/theme/suggest`: オンボーディングの答えからテーマ候補を生成する

---

### Endpoint

`POST /api/story/next`

### Request shape

`mode` は `start` / `continue` / `finish` の3種類です。

start の場合:

```json
{
  "mode": "start",
  "theme": "でんしゃ",
  "keywords": ["あか", "もり", "くま"],
  "textStyle": "hiragana",
  "kanjiGrade": null,
  "history": []
}
```

continue の場合:

```json
{
  "mode": "continue",
  "theme": "でんしゃ",
  "keywords": ["あか", "もり", "くま"],
  "textStyle": "hiragana",
  "kanjiGrade": null,
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

finish の場合（ユーザーが「おしまい」を押して締め文を要求）:

```json
{
  "mode": "finish",
  "theme": "でんしゃ",
  "keywords": ["あか", "もり", "くま"],
  "textStyle": "hiragana",
  "kanjiGrade": null,
  "history": [
    {
      "stepIndex": 1,
      "text": "あるひ、あかいでんしゃが もりのなかを はしっていました。",
      "selectedChoiceId": null,
      "selectedChoiceLabel": null
    }
  ]
}
```

`textStyle` と `kanjiGrade` は常に含めてください。

- `textStyle`: `"hiragana"` または `"kanji"`。選んだテーマの `textStyle` をそのまま送る
- `kanjiGrade`: `textStyle="kanji"` のとき 1〜4 の整数（小学○年生までの漢字）。`textStyle="hiragana"` のときは `null`

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

### Endpoint

`POST /api/theme/suggest`

### Request shape

```json
{
  "answers": [
    { "questionId": "q1", "choiceId": "q1_c3", "label": "森の 生きもの", "textStyle": "kanji" },
    { "questionId": "q2", "choiceId": "q2_c1", "label": "おかし", "textStyle": "hiragana" },
    { "questionId": "q3", "choiceId": "q3_c4", "label": "夜の 空", "textStyle": "kanji" }
  ],
  "kanjiGrade": 2,
  "excludeThemes": ["きょうりゅうの しま"]
}
```

- `answers`: オンボーディングの答え。1件以上
- `kanjiGrade`: 1〜4 の整数。漢字テーマに使う漢字の範囲
- `excludeThemes`: 「ほかの テーマ」で生成し直すときに、表示中の候補名を入れる。初回は `[]`

### Response shape

```json
{
  "themes": [
    {
      "id": "theme_1",
      "label": "星の 森の きょうりゅう",
      "textStyle": "kanji",
      "kanjiGrade": 2,
      "keywords": ["ロケット", "星", "たまご", "火山", "友だち", "ひみつ"]
    },
    {
      "id": "theme_2",
      "label": "おかしの くに",
      "textStyle": "hiragana",
      "kanjiGrade": null,
      "keywords": ["ケーキ", "あめ", "おしろ", "ようせい", "にじ", "パーティー"]
    }
  ]
}
```

- `themes` は必ず4件
- 漢字テーマとひらがなテーマの数は、答えの `textStyle` で決める
  - 漢字の答えが0件: ひらがな 4
  - 漢字の答えが半分未満: 漢字 2 / ひらがな 2
  - 漢字の答えが半分以上: 漢字 3 / ひらがな 1
- `label` と `keywords` は、そのテーマの `textStyle` と `kanjiGrade` に合う文字で書く（ひらがなテーマには漢字を使わない）
- `keywords` は 6〜8個

---

## Theme Generation Rules

テーマ生成の LLM 出力には以下の制約を課してください。

* 6〜10歳の子どもが楽しめるテーマにする
* 答えた「すきなもの」を1つ以上反映する
* こわすぎる、暴力的、性的、差別的、不適切なテーマは禁止
* 実在の商品名、作品名、キャラクター名は使わない
* `label` は12文字以内、各 `keyword` は10文字以内
* `excludeThemes` と同じ、またはよく似たテーマは出さない
* LLM の返答は JSON に限定する
* 応答は必ずバリデーションし、不正な場合は固定テーマで代替する

---

## Story Generation Rules

LLM 出力には以下の制約を課してください。

* 6〜10歳向けの読みやすい日本語
* 文体は `textStyle` で切り替える
  * `hiragana`: ひらがな中心（カタカナも可）。text は 1〜3文、200文字以内
  * `kanji`: 小学 `kanjiGrade` 年生までに習う漢字を使い、それ以外はひらがなで書く。text は 2〜4文、300文字以内
* 文は短め
* こわすぎる展開は禁止
* 暴力的、性的、差別的、不適切な内容は禁止
* choices は `[]` または2件
* `isEnd=true` のとき choices は必ず空配列
* `mode=start` / `mode=continue` では、原則として 1〜4 ステップ目で終了させない
* 5ステップ目以降は、`mode=finish` が来たら締めの1ステップを生成して終了できる
* 安全上限は 10 ステップとし、上限到達時の `mode=finish` では必ず `isEnd=true` を返す
* 毎回「次の1ステップだけ」を生成する
* LLM の返答は JSON に限定する

LLM に全文を一気に作らせないでください。
API は「物語全体を返すもの」ではなく、「次の一歩を返すもの」として扱ってください。

---

## LLM Runtime And Cost Constraints

Task 7 以降の LLM 連携は、以下を固定方針とします。

* Provider は Gemini Developer API を使う
* モデルは `gemini-2.5-flash-lite` を使う
* `gemini-2.0-flash` 系は 2026-06-01 で停止予定のため新規採用しない
* LLM 実行場所は Cloud Run 上のバックエンド（`../ohanashi-palette-backend/`）に限定する
* API キーはサーバー環境変数で管理し、フロントエンドに渡さない
* 月次コスト上限は 100 円以内を目標にする
* テーマ生成で1話あたりの呼び出しが1回（「ほかの テーマ」を押すとその回数分）増えることを前提に見積もる
* コスト抑制のため、短文出力・小さい `maxOutputTokens`・不要機能無効化（grounding / 音声 / 画像 / Live API 無効）を前提にする
* 上限に近づいた場合は、固定フォールバック文を返して超過を防ぐ

参考単価（2026-04-13 時点、変更される可能性あり）:

* `gemini-2.5-flash-lite` 標準料金は入力 $0.10 / 出力 $0.40（100 万トークンあたり）

---

## Frontend State Requirements

フロントエンドでは以下の状態を持ってください。

* theme
* textStyle / kanjiGrade
* keywords
* steps
* current progress
* ended / playing status
* `steps[*].selectedChoiceId` と `steps[*].selectedChoiceLabel` は必須キーにする（値は `string | null`）

進行中セッション全体を localStorage に保存してください。
キーは 1個でよいです。例:

`ohanashi-palette.current-session`

オンボーディングの答えと漢字の範囲は、別のキーに保存してください。

`ohanashi-palette.preferences`

保存前の古いセッション（`textStyle` がない）を読み込んだ場合は、`textStyle="hiragana"` / `kanjiGrade=null` として扱ってください。

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

外部 API は2本です。どちらも内部責務は分離してください。
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
│  │  ├─ OnboardingPage.tsx
│  │  ├─ ThemeSuggestPage.tsx
│  │  ├─ SetupPage.tsx
│  │  ├─ LoadingPage.tsx
│  │  ├─ StoryPage.tsx
│  │  └─ EndingPage.tsx
│  ├─ components/
│  │  ├─ layout/
│  │  ├─ story/
│  │  └─ setup/
│  ├─ features/
│  │  ├─ theme/
│  │  │  ├─ api.ts
│  │  │  ├─ preferences.ts
│  │  │  ├─ questions.ts
│  │  │  └─ types.ts
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
│  │  ├─ storyNext.ts
│  │  └─ themeSuggest.ts
│  ├─ domain/
│  │  ├─ theme/
│  │  │  ├─ buildThemePrompt.ts
│  │  │  ├─ themeSchemas.ts
│  │  │  └─ themeTypes.ts
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
10. 対象年齢の変更と文体（`textStyle` / `kanjiGrade`）対応
11. テーマ生成 API（ダミー → LLM）
12. オンボーディングとテーマ候補画面

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
* オンボーディングに答えて、生成されたテーマ候補から選べる
* 「ほかの テーマ」で別の候補を出せる
* 固定テーマからも選べる
* テーマとことばを選べる
* 漢字テーマなら漢字入り、ひらがなテーマならひらがなの本文になる
* 物語の最初の1ステップを生成できる
* その後の continue が動く
* 2択または「つぎへ」で進める
* 5ステップ目以降で「おしまい」を押すと締め文を生成して終了できる
* 10ステップ目以降は「おしまい」導線のみで締め文生成に進める
* localStorage から途中再開できる
* エラー時に再試行できる
* 子どもが繰り返し遊べる最低限の品質になっている

この時点では、拡張性よりも遊べることを優先してください。

---

## Final Instruction To The Coding Agent

このプロジェクトでは、SaaS 的な構成や将来の大規模拡張を前提にしないでください。
価値の中心は、子どもが iPad で気持ちよく物語を進められることです。

重要なのは以下です。

* UI は単純で大きく
* API は2本（story/next と theme/suggest）
* 状態はフロント保持
* サーバーは stateless
* DB なし
* 認証なし
* まず子どもが繰り返し遊べる状態まで持っていく

迷ったら、複雑な構造ではなく、より小さく単純な構造を選んでください。
