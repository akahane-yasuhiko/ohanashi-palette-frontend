# TASKS.md

## How To Use This File

このファイルは、Claude Code / Codex に実装を段階的に依頼するためのタスクリストです。  
各タスクはできるだけ小さく完了可能な単位に分けています。

実装時の共通ルール:

- `PROJECT.md` を必ず参照すること
- 優先順位と API 契約の正本は `PROJECT.md` とし、差分があれば `PROJECT.md` を優先すること
- 一度に全部を実装しようとしないこと
- まずは最小構成で動くものを作ること
- 不要な抽象化や将来拡張の仕込みはしないこと
- 各タスクの完了条件を満たしたら止まること
- 不明点があっても、初期版の方針に沿って小さく実装すること

---

## Progress

- Task 0-1: DONE（2026-04-09）
- Task 0-2: DONE（2026-04-09）
- Task 1-1〜1-3: DONE（2026-04-10）
- Task 2-1〜2-3: DONE（2026-04-10）
- Task 3-1〜3-3: DONE（2026-04-10）
- Task 4-1〜4-3: DONE（2026-04-13）
- Task 5-1〜5-3: DONE（2026-04-13）
- Task 6-1〜6-2: DONE（2026-04-13）
- Task 7-1〜7-4: DONE（2026-04-14）
- Task 8-1 以降: TODO

---

## Phase 0: Project Setup

### Task 0-1: Create frontend project scaffold [DONE]
目的:
- React + TypeScript ベースのフロントエンドを作る

やること:
- `ohanashi-palette-frontend` を作成
- Vite + React + TypeScript 構成を用意
- 起動確認ができる最小状態にする
- ディレクトリ構成を `PROJECT.md` に近づける

完了条件:
- `npm install`
- `npm run dev`
で開発サーバーが起動する
- 画面に最低限の App が表示される

---

### Task 0-2: Create backend project scaffold [DONE]
目的:
- TypeScript ベースのバックエンド土台を作る

やること:
- `ohanashi-palette-backend` を作成（フロントと並列ディレクトリ: `../ohanashi-palette-backend/`）
- `POST /api/story/next` を受ける最小構成を作る
- まだ LLM 接続は不要
- ダミー JSON を返すだけでよい

完了条件:
- バックエンドがローカル起動できる
- `POST /api/story/next` に対して固定レスポンスを返せる

---

## Phase 1: Frontend Screen Skeleton

### Task 1-1: Create page components [DONE]
目的:
- 主要画面の骨組みを作る

やること:
- 以下のページを作る
  - `HomePage`
  - `SetupPage`
  - `LoadingPage`
  - `StoryPage`
  - `EndingPage`
- 仮の文言でよいので表示確認できるようにする

完了条件:
- 5画面のコンポーネントが存在する
- それぞれが最低限描画される

---

### Task 1-2: Implement simple routing or screen switching [DONE]
目的:
- 各画面を切り替えられるようにする

やること:
- React Router またはシンプルな状態管理で画面遷移を実装
- 初期版では複雑なルーティングは不要
- 画面が順番に遷移できるようにする
- Loading は API 呼び出しのたびに経由する（最初のステップ・続きのステップ両方）

完了条件:
- Home → Setup → Loading → Story → Loading → Story → … → Ending の遷移確認ができる
- 画面間の移動が最低限成立する

---

### Task 1-3: Build iPad-friendly layout primitives [DONE]
目的:
- 子ども向けの大きい UI の土台を作る

やること:
- 共通レイアウトコンポーネントを作る
- 大きいボタン、カード、余白の基本スタイルを作る
- StoryPage を中心に読みやすいレイアウトにする

完了条件:
- ボタンが十分大きい
- 文字が小さすぎない
- 画面が業務アプリっぽくなく、シンプルに見える

---

## Phase 2: Story Session State

### Task 2-1: Define story types [DONE]
目的:
- フロントエンドで使う型を整理する

やること:
- `Theme`
- `StoryChoice`
- `StoryStep`
- `StorySession`
- `StoryNextRequest`
- `StoryNextResponse`
を定義する
- `StoryStep.selectedChoiceId` / `StoryStep.selectedChoiceLabel` は必須キーにし、型は `string | null` にする

完了条件:
- `features/story/types.ts` に必要な型がある
- 以後のコードがそれらの型を使う

---

### Task 2-2: Create session state utilities [DONE]
目的:
- 進行中ストーリーのフロント状態を扱えるようにする

やること:
- セッション初期化関数を作る
- step 追加関数を作る
- choice 選択反映関数を作る
- playing / ended の状態更新関数を作る

完了条件:
- story session をコード上で生成・更新できる
- UI から扱える関数が揃う

---

### Task 2-3: Implement localStorage persistence [DONE]
目的:
- 中断復帰できるようにする

やること:
- current session の保存処理
- current session の読み込み処理
- current session の削除処理
- localStorage key を定数化

完了条件:
- 進行中セッションを localStorage に保存できる
- リロード後に復元できる
- 終了時に消せる

---

## Phase 3: Setup Flow

### Task 3-1: Build theme selector [DONE]
目的:
- テーマ選択を実装する

やること:
- テーマ候補を固定で用意する（PROJECT.md の Theme And Keyword Catalog を正本とする）
  - でんしゃ
  - うみ
- カード型 UI で1つ選べるようにする

完了条件:
- SetupPage でテーマを1つ選べる
- 選択状態が見た目で分かる

---

### Task 3-2: Build keyword selector [DONE]
目的:
- ことば選択を実装する

やること:
- テーマごとのことば候補を用意（PROJECT.md の Theme And Keyword Catalog を正本とする）
- 2〜3個まで選べるようにする
- 選択されたテーマに対応することば候補を表示する

完了条件:
- SetupPage でことばを複数選べる
- 選びすぎを防げる

---

### Task 3-3: Start story session from setup [DONE]
目的:
- Setup からストーリー開始できるようにする

やること:
- テーマとことばを使って `StorySession` を生成
- localStorage に保存
- Loading 画面へ遷移

完了条件:
- Setup の開始ボタンで session が作られる
- Story 開始の準備ができる

---

## Phase 4: Backend Contract and Dummy Integration

### Task 4-1: Define backend request/response schema [DONE]
目的:
- API 契約を固定する

やること:
- request validation 用 schema を作る
- response validation 用 schema を作る
- `start` / `continue` 両方を扱う
- `history[*].selectedChoiceId` / `history[*].selectedChoiceLabel` は必須キーにし、値は `string | null` を許容する

完了条件:
- 不正な request を弾ける
- response shape がコード上で定義されている

---

### Task 4-2: Return deterministic dummy story responses [DONE]
目的:
- LLM 未接続でもフロントから通し確認できるようにする

やること:
- `mode=start` のとき固定の最初の文を返す
- `mode=continue` のとき history に応じて固定文を返す
- 終了ケースも作る

完了条件:
- フロントから叩いて StoryPage が更新される
- 2〜3ステップ分はダミーで進められる

---

### Task 4-3: Connect frontend to backend API [DONE]
目的:
- フロントとバックエンドをつなぐ

やること:
- `features/story/api.ts` を作る
- `POST /api/story/next` を呼ぶ処理を実装
- LoadingPage → StoryPage の流れをつなぐ

完了条件:
- Setup から API を呼べる
- レスポンスを StoryPage に表示できる
- continue でも API を再度呼べる

---

## Phase 5: Story Screen Behavior

### Task 5-1: Render story text and buttons [DONE]
目的:
- StoryPage を本体として成立させる

やること:
- 本文表示コンポーネントを作る
- 選択肢がないときは「つぎへ」ボタンを出す
- 選択肢が2つあるときは2択ボタンを出す

完了条件:
- StoryPage 上で本文が読める
- 「つぎへ」または2択が表示される
- 操作で次ステップへ進める

---

### Task 5-2: Apply step updates to session history [DONE]
目的:
- ストーリー履歴を正しく蓄積する

やること:
- API response を `steps` に追加
- 選択肢を押したら selected choice を保存
- continue request 用 history を作れるようにする

完了条件:
- steps が正しく増える
- 選択内容が履歴に残る
- 続き生成に必要な history が作られる

---

### Task 5-3: Handle story ending [DONE]
目的:
- 最後まで進めたときに終了画面へ行けるようにする

やること:
- `isEnd=true` を検知
- session status を `ended` にする
- EndingPage に遷移
- current session の扱いを整理する
- 「もういちど」は Setup 画面に戻る（テーマ・ことばを選び直す）
- 「ホームへ」は Home 画面に戻る

完了条件:
- 物語終了時に EndingPage が出る
- 「もういちど」で Setup に戻れる
- 「ホームへ」で Home に戻れる

---

## Phase 6: Resume Flow

### Task 6-1: Show continue button on home when resumable session exists [DONE]
目的:
- 中断復帰を UI で使えるようにする

やること:
- localStorage を読んで playing session を判定
- HomePage に「つづきから」を条件表示

完了条件:
- 進行中セッションがある時だけ「つづきから」が出る
- ない時は出ない

---

### Task 6-2: Resume into correct story state [DONE]
目的:
- 途中から遊び直せるようにする

やること:
- current session を読み込み
- 最後の step を表示
- そこから continue できるようにする

完了条件:
- ページ再読み込み後も再開できる
- 中断前の状態が大きく崩れない

---

## Phase 7: LLM Integration

Phase 7 の固定前提:

- Provider は Gemini Developer API を使う
- モデルは `gemini-2.5-flash-lite` を使う
- LLM 呼び出しは Cloud Run 上のバックエンド（`../ohanashi-palette-backend/`）のみで実行する
- API キーはバックエンド環境変数で管理し、フロントエンドに公開しない
- 月次コスト上限は 100 円以内を目標にし、超過防止のガードを実装する

---

### Task 7-1: Create prompt builder [DONE]
目的:
- LLM に渡す指示を明文化する

やること:
- 子ども向け制約を含む prompt builder を実装
- history, theme, keywords を反映する
- JSON only を強く要求する
- 1ステップを短く返すように指示し、トークン消費を抑える

完了条件:
- prompt を関数で生成できる
- ルールがコード上にまとまっている

---

### Task 7-2: Implement LLM client wrapper [DONE]
目的:
- モデル呼び出しをハンドラから分離する

やること:
- `infra/llm/client.ts` を作る
- モデル呼び出し関数を作る
- API key / model / timeout などは env から読む
- 直接 route に埋め込まない
- 既定モデルを `gemini-2.5-flash-lite` にする
- Cloud Run 環境で動く前提（`PORT` 利用、stateless）を崩さない

完了条件:
- route が llm client を呼ぶ形になる
- モデル実装が差し替えやすい
- フロントエンドに秘密情報を渡していない

---

### Task 7-3: Parse and validate LLM JSON output [DONE]
目的:
- LLM の気まぐれ出力を吸収する

やること:
- JSON 抽出処理を作る
- response validation を通す
- 不正なら fallback error にする
- 応答が長すぎる場合は安全側で切り詰めるか失敗扱いにする

完了条件:
- JSON パース失敗時の扱いがある
- response shape の安全性が増す

---

### Task 7-4: Replace dummy response with real LLM generation [DONE]
目的:
- 本物のストーリー生成を有効にする

やること:
- dummy 実装を置き換える
- start / continue の両方を動かす
- 最大5ステップ程度で終わるよう prompt を調整する
- `maxOutputTokens` 等の上限を設定してトークン暴走を防ぐ
- 月次 100 円上限を守るための簡易ガード（上限到達時フォールバック）を入れる

完了条件:
- 実際に物語が生成される
- フロントから end-to-end で遊べる
- 明らかなコスト超過を防ぐ仕組みが入っている

---

## Phase 8: Speech and Polishing

### Task 8-1: Add read aloud button [DONE]
目的:
- 子どもが本文を聞けるようにする

やること:
- SpeechSynthesis を使った読み上げ utility を作る
- StoryPage に読み上げボタンを置く

完了条件:
- ボタン押下で本文を読み上げられる

---

### Task 8-2: Add loading feedback polish [DONE]
目的:
- 子どもに無反応に見えないようにする

やること:
- LoadingPage を調整
- 待ち時間中の短い文言を入れる
- StoryPage から Loading への遷移を自然にする

完了条件:
- 押した後に無反応に見えにくい
- 遷移が不自然でない

---

### Task 8-3: Add friendly error UI [DONE]
目的:
- エラー時の体験を壊しにくくする

やること:
- 再試行ボタン
- ホームに戻る導線
- やさしいメッセージ
- 開発者向けログは console / server log に出す

完了条件:
- API 失敗時に操作継続不能にならない
- 子ども向けに不必要な技術情報を出さない

---

## Phase 9: Trial Readiness

### Task 9-1: Tune content constraints
目的:
- 親子で10回遊べる最低限の品質に寄せる

やること:
- 文が長すぎないか確認
- 選択肢が分かりづらすぎないか確認
- 終わり方が雑すぎないか確認
- 危ない表現が出にくいよう微調整

完了条件:
- ストーリーが短く遊びやすい
- 子ども向けとして大きな違和感が少ない

---

### Task 9-2: Manual trial checklist
目的:
- 実際に試遊できるか最終確認する

やること:
- 以下の観点で確認
  - ホームから始められる
  - Setup が分かりやすい
  - StoryPage が読みやすい
  - 2択で進める
  - 物語が終わる
  - 途中再開できる
  - エラー時に戻れる
  - 読み上げが使える

完了条件:
- 親子で10回試す前の最低限の確認ができている

---

## Suggested Agent Prompts

以下は Claude Code / Codex に投げるときの例です。

### Prompt example 1
`PROJECT.md` と `TASKS.md` を読んでください。  
まずは Task 0-1 と Task 0-2 だけを実装してください。  
不要な機能追加はせず、完了条件を満たしたところで止まってください。

### Prompt example 2
`PROJECT.md` を前提に、Task 1-1 から Task 1-3 までを実装してください。  
iPad 向けの大きいボタンとシンプルな画面を優先し、業務アプリ風のUIにしないでください。

### Prompt example 3
Task 4-1 から Task 4-3 までを実装してください。  
まずは LLM を使わず、固定ダミーレスポンスでフロントとバックエンドの疎通を成立させてください。

### Prompt example 4
Task 7-1 から Task 7-4 を実装してください。  
route にロジックを詰め込まず、prompt builder / llm client / validator を分離してください。

---

## Stop Conditions For The Agent

以下の場合、いったん止まってよいです。

- 指定タスクの完了条件を満たした
- これ以上やると未指示の機能追加になる
- 汎用化や過剰設計に入りそう
- 初期版の非目標に触れそう

---

## Final Reminder

このプロジェクトは、最初から立派なSaaSを作るものではありません。  
目的は、子どもが iPad で気持ちよく触れる、小さくても遊べる体験を作ることです。

迷ったら、以下を優先してください。

- 小さい構造
- 少ない画面責務
- 1本の API
- フロント状態保持
- DB なし
- 認証なし
- まず動くこと
