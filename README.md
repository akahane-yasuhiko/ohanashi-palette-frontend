# おはなしパレット

子どもが iPad でタップしながら短い物語を進める、初期版 MVP 向けアプリです。

## ドキュメント

- `PROJECT.md`: 仕様の正本（制約、API 契約、実装優先順位）
- `TASKS.md`: 段階的な実装タスクと完了条件
- `CLAUDE.md`: コーディングエージェントの行動ルール

差分がある場合は `PROJECT.md` を優先してください。

## Local Development

### Frontend

```bash
cd ohanashi-palette-frontend
npm install
npm run dev
```

### Backend

```bash
cd ohanashi-palette-backend
npm install
npm run dev
```

## Environment Variables

バックエンドで LLM を使う場合は環境変数を設定してください。

```bash
LLM_API_KEY=your_api_key
PORT=8080
```

必要なら `.env.example` を作成してください。

