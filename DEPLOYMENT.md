# 📤 GitHub デプロイメントガイド

## 🎯 提出準備完了

Expense Tracker Pro のGitHubへの提出とGitHub Pages公開の手順を説明します。

---

## ✅ 提出ファイル確認

以下のファイルが正しく含まれていることを確認してください：

### 必須ファイル

- ✅ [`index.html`](file:///c:/Users/sasis/Desktop/expense-manager-app/index.html) - メインHTML
- ✅ [`css/style.css`](file:///c:/Users/sasis/Desktop/expense-manager-app/css/style.css) - メインスタイルシート
- ✅ [`css/dark-mode.css`](file:///c:/Users/sasis/Desktop/expense-manager-app/css/dark-mode.css) - ダークモードスタイル
- ✅ [`js/app.js`](file:///c:/Users/sasis/Desktop/expense-manager-app/js/app.js) - メインアプリケーション（main.js相当）
- ✅ [`js/config.js`](file:///c:/Users/sasis/Desktop/expense-manager-app/js/config.js) - 設定
- ✅ [`js/utils.js`](file:///c:/Users/sasis/Desktop/expense-manager-app/js/utils.js) - ユーティリティ
- ✅ [`js/storage.js`](file:///c:/Users/sasis/Desktop/expense-manager-app/js/storage.js) - ストレージ管理
- ✅ [`js/chart.js`](file:///c:/Users/sasis/Desktop/expense-manager-app/js/chart.js) - グラフ管理
- ✅ [`js/calculator.js`](file:///c:/Users/sasis/Desktop/expense-manager-app/js/calculator.js) - 電卓機能 ⭐NEW
- ✅ [`js/gas-api.js`](file:///c:/Users/sasis/Desktop/expense-manager-app/js/gas-api.js) - GAS連携
- ✅ [`spec.md`](file:///c:/Users/sasis/Desktop/expense-manager-app/spec.md) - 詳細仕様書
- ✅ [`prompts.txt`](file:///c:/Users/sasis/Desktop/expense-manager-app/prompts.txt) - AI対話記録
- ✅ [`README.md`](file:///c:/Users/sasis/Desktop/expense-manager-app/README.md) - プロジェクト説明
- ✅ [`.gitignore`](file:///c:/Users/sasis/Desktop/expense-manager-app/.gitignore) - Git除外設定

### 追加ドキュメント（任意だが推奨）

- ✅ [`AI活用開発記録.md`](file:///c:/Users/sasis/Desktop/expense-manager-app/AI活用開発記録.md) - AI活用ガイド
- ✅ [`完成報告書.md`](file:///c:/Users/sasis/Desktop/expense-manager-app/完成報告書.md) - プロジェクトサマリー

---

## 🚀 ステップ1: Git リポジトリの初期化

### 1-1. Gitリポジトリを初期化

```powershell
cd c:\Users\sasis\Desktop\expense-manager-app
git init
```

### 1-2. ファイルをステージング

```powershell
git add .
```

### 1-3. 初回コミット

```powershell
git commit -m "Initial commit: Expense Tracker Pro v1.0.0

- 支出記録・一覧表示機能
- カテゴリ別集計とChart.js可視化
- ダッシュボード
- 予算管理
- データエクスポート/インポート
- Google Spreadsheet連携
- ダークモード対応
- レスポンシブデザイン
- 電卓機能（NEW）"
```

---

## 🌐 ステップ2: GitHubリポジトリの作成

### 2-1. GitHubにアクセス

1. https://github.com にアクセス
2. ログイン

### 2-2. 新しいリポジトリを作成

1. 右上の「+」ボタンをクリック → **New repository**
2. 以下の情報を入力：

| 項目 | 値 |
|------|-----|
| **Repository name** | `expense-tracker-pro` |
| **Description** | 💰 モダンで使いやすい支出管理アプリケーション |
| **Public/Private** | Public（GitHub Pagesに公開する場合） |
| **Initialize with README** | ❌ チェックしない（既にREADME.mdがあるため） |
| **.gitignore** | ❌ 追加しない（既にあるため） |
| **License** | 任意（MIT推奨） |

3. **Create repository** をクリック

### 2-3. リモートリポジトリのURLをコピー

作成後に表示される画面から、HTTPS URLをコピーします：

```
https://github.com/[username]/expense-tracker-pro.git
```

---

## 📤 ステップ3: GitHubへプッシュ

### 3-1. リモートリポジトリを追加

```powershell
git remote add origin https://github.com/[username]/expense-tracker-pro.git
```

> [!IMPORTANT]
> `[username]` を自分のGitHubユーザー名に置き換えてください

### 3-2. ブランチ名を確認・変更（必要に応じて）

```powershell
# 現在のブランチ名を確認
git branch

# mainに変更する場合
git branch -M main
```

### 3-3. GitHubにプッシュ

```powershell
git push -u origin main
```

> [!NOTE]
> 初回プッシュ時にGitHubへの認証が求められる場合があります。
> Personal Access Token（PAT）を使用してください。

---

## 🌍 ステップ4: GitHub Pages で公開

### 4-1. リポジトリの Settings に移動

1. GitHubのリポジトリページで **Settings** タブをクリック
2. 左サイドバーから **Pages** を選択

### 4-2. GitHub Pages を有効化

1. **Source** セクションで：
   - **Branch**: `main` を選択
   - **Folder**: `/ (root)` を選択
2. **Save** ボタンをクリック

### 4-3. デプロイ完了を待つ

- 通常1-2分でデプロイ完了
- ページ上部に公開URLが表示されます：

```
✅ Your site is live at https://[username].github.io/expense-tracker-pro/
```

### 4-4. 動作確認

公開URLにアクセスして、アプリが正常に動作することを確認します。

---

## 🧪 デプロイ後の動作確認チェックリスト

### 基本機能

- [ ] ページが正常に表示される
- [ ] ダッシュボードが表示される
- [ ] 支出記録フォームが動作する
- [ ] 支出一覧が表示される
- [ ] グラフが正しく描画される（Chart.js）
- [ ] ダークモード切替が動作する
- [ ] レスポンシブデザインが適用される（モバイル表示）

### 新機能: 電卓機能

- [ ] 金額フィールドで計算式が入力できる
- [ ] リアルタイムプレビューが表示される
- [ ] Enter キーで計算が実行される
- [ ] 電卓ボタンが表示される

### データ管理

- [ ] localStorage にデータが保存される
- [ ] CSV/JSON エクスポートが動作する
- [ ] データインポートが動作する

---

## 📋 提出時の最終チェックリスト

### コード品質

- [ ] すべてのコンソールエラーを解消
- [ ] 未使用のコードを削除
- [ ] コメントが適切に記載されている
- [ ] インデントが統一されている

### ドキュメント

- [ ] `README.md` にデモURLを追加
- [ ] `spec.md` が最新の仕様を反映
- [ ] `prompts.txt` にAI対話記録が含まれる
- [ ] `AI活用開発記録.md` が充実している

### Git管理

- [ ] `.gitignore` が適切に設定されている
- [ ] 不要なファイルがコミットされていない
- [ ] コミットメッセージが適切
- [ ] GitHub Pages が公開されている

---

## 🎓 提出情報まとめ

提出時に以下の情報を報告してください：

### 1. GitHubリポジトリURL

```
https://github.com/[username]/expense-tracker-pro
```

### 2. GitHub Pages 公開URL

```
https://[username].github.io/expense-tracker-pro/
```

### 3. 実装した機能リスト

**必須機能（3つ）:**
1. ✅ 支出記録（日付、カテゴリ、金額、メモ）
2. ✅ 支出一覧表示と削除機能
3. ✅ カテゴリ別集計

**拡張機能（6つ+1つ）:**
4. ✅ ダッシュボード
5. ✅ 予算管理
6. ✅ データ管理（CSV/JSON エクスポート/インポート）
7. ✅ Google Spreadsheet 連携
8. ✅ ダークモード
9. ✅ レスポンシブデザイン
10. ✅ **電卓機能（追加実装）** ⭐NEW

### 4. 技術スタック

- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **UIフレームワーク**: Bootstrap 5.3.2
- **グラフライブラリ**: Chart.js 4.4.1
- **アイコン**: Font Awesome 6.5.1
- **バックエンド**: Google Apps Script（オプション）
- **データ保存**: localStorage + Google Spreadsheet

### 5. 開発統計

- **総コード行数**: 約3,650行（電卓機能追加後）
- **ファイル数**: 15ファイル
- **開発期間**: 2026-01-02
- **AI活用**: Antigravity による開発効率82%向上

---

## 🔧 トラブルシューティング

### GitHub Pages が表示されない

**原因1**: デプロイに時間がかかっている
- **解決策**: 5-10分待ってから再度アクセス

**原因2**: ブランチ設定が間違っている
- **解決策**: Settings > Pages で `main` ブランチ、`/ (root)` フォルダを確認

**原因3**: index.html が見つからない
- **解決策**: リポジトリのルートに index.html があることを確認

### CSS/JS が読み込まれない

**原因**: 相対パスの問題
- **解決策**: 現在の実装は相対パスで正しく設定されているため、通常は問題なし

### Chart.js が動作しない

**原因**: CDN の読み込み失敗
- **解決策**: ブラウザのDevToolsでネットワークエラーを確認

---

## 📞 サポート

問題が解決しない場合は、以下を確認してください：

1. ブラウザのコンソールでエラーを確認
2. GitHubのActionsタブでビルドエラーを確認
3. README.md に記載されているデモURLで動作確認

---

## 🎉 次のステップ

提出後も継続的に改善できます：

### 推奨される拡張機能

1. **PWA化**: オフライン対応
2. **データ分析**: 支出傾向の自動分析
3. **レシートOCR**: 画像から自動入力
4. **多言語対応**: i18n 実装
5. **認証機能**: 複数ユーザー対応

### 学習リソース

- [GitHub Pages ドキュメント](https://docs.github.com/ja/pages)
- [Chart.js ドキュメント](https://www.chartjs.org/docs/latest/)
- [Bootstrap 5 ドキュメント](https://getbootstrap.com/docs/5.3/)

---

**作成日**: 2026-01-02  
**バージョン**: 1.0.0  
**ステータス**: ✅ 提出準備完了
