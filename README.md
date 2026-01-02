# 💰 Expense Tracker Pro

モダンで使いやすい個人向け支出管理Webアプリケーション。日々の支出を簡単に記録・分析・可視化できます。

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 特徴

- 📊 **リアルタイム可視化** - Chart.jsによる美しいグラフ表示
- 💾 **二重保存** - localStorage + Google Spreadsheet（オプション）
- 🌙 **ダークモード** - 目に優しいデザイン
- 📱 **レスポンシブ - モバイルファースト設計
- 🎨 **モダンUI** - Bootstrap 5による洗練されたデザイン
- 🚀 **高速** - サーバー不要、完全にクライアントサイドで動作

## 🎯 主な機能

### 1. 支出記録
- 日付、カテゴリ、金額、メモを入力
- リアルタイムバリデーション
- localStorageに自動保存

### 2. 支出一覧表示
- カード型のモダンな一覧表示
- フィルター機能（日付範囲、カテゴリ）
- メモでの全文検索
- 削除機能

### 3. カテゴリ別集計
- 7つのカテゴリ（食費、交通費、娯楽費、光熱費、通信費、医療費、その他）
- 円グラフで比率を可視化
- 棒グラフで金額を比較
- 期間選択（今週、今月、先月、カスタム）

### 4. ダッシュボード
- 今月の総支出額
- 前月比較
- 予算使用率
- TOP3カテゴリ
- 最近の支出履歴

### 5. 予算管理
- 月間予算設定
- 予算使用率の視覚化
- 予算超過アラート

### 6. データ管理
- CSVエクスポート
- JSONエクスポート
- データインポート
- Google Spreadsheet同期（オプション）

## 🛠 技術スタック

- **HTML5** - セマンティックマークアップ
- **CSS3** - モダンなデザイン、ダークモード対応
- **JavaScript (ES6+)** - バニラJS、クラスベース設計
- **Bootstrap 5** - UIフレームワーク
- **Chart.js** - グラフライブラリ
- **Font Awesome** - アイコン
- **Google Apps Script** - バックエンド連携（オプション）
- **localStorage** - データ永続化

## 🚀 クイックスタート

### 1. ファイルをダウンロード

```bash
git clone https://github.com/[username]/expense-tracker.git
cd expense-tracker
```

### 2. ローカルで実行

Pythonがインストールされている場合:

```bash
python -m http.server 8000
```

または、任意のローカルサーバーを使用してください。

ブラウザで `http://localhost:8000` にアクセス。

### 3. GitHub Pagesで公開

1. GitHubリポジトリを作成
2. コードをプッシュ
3. Settings > Pages で公開設定
4. 公開URLにアクセス！

## 📖 使い方

### 支出を記録する

1. サイドバーから「支出記録」を選択
2. 日付、カテゴリ、金額を入力
3. 必要に応じてメモを追加
4. 「登録」ボタンをクリック

### グラフで分析する

1. 「カテゴリ別集計」を選択
2. 期間を選択（今週、今月、先月、カスタム）
3. 円グラフと棒グラフで支出傾向を確認

### データをエクスポートする

1. 「設定」を選択
2. 「CSV形式でエクスポート」または「JSON形式でエクスポート」をクリック
3. ファイルがダウンロードされます

## ⚙️ Google Spreadsheet連携（オプション）

### 1. Spreadsheetの作成

1. Google Driveで新規Spreadsheetを作成
2. Spreadsheet IDをコピー（URLから取得）

### 2. Google Apps Scriptのデプロイ

1. Spreadsheet > 拡張機能 > Apps Script
2. `gas/Code.gs` の内容をコピー&ペースト
3. `SPREADSHEET_ID` を自分のIDに変更
4. デプロイ > 新しいデプロイ > ウェブアプリ
5. Web App URLをコピー

### 3. アプリの設定

`js/config.js` を編集:

```javascript
const CONFIG = {
    // ... 他の設定 ...
    GAS_WEB_APP_URL: 'YOUR_WEB_APP_URL_HERE',
    SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE'
};
```

### 4. 同期する

「設定」ページから「Spreadsheetに同期」をクリック。

## 📁 ファイル構成

```
expense-tracker/
├── index.html              # メインHTML
├── css/
│   ├── style.css          # メインスタイル
│   └── dark-mode.css      # ダークモード
├── js/
│   ├── config.js          # 設定
│   ├── utils.js           # ユーティリティ関数
│   ├── storage.js         # localStorage管理
│   ├── chart.js           # グラフ描画
│   ├── gas-api.js         # GAS連携
│   └── app.js             # メインアプリケーション
├── gas/
│   └── Code.gs            # Google Apps Script
├── spec.md                # 仕様書
├── prompts.txt            # AI対話記録
└── README.md              # このファイル
```

## 🎨 カスタマイズ

### カテゴリの追加

`js/config.js` の `CATEGORIES` 配列を編集:

```javascript
CATEGORIES: [
    { name: '新カテゴリ', icon: '🎁', color: '#FF6B6B', darkColor: '#FF8787' },
    // ...
]
```

### カラーテーマの変更

`css/style.css` のCSS変数を編集:

```css
:root {
    --primary: #4F46E5;  /* メインカラー */
    --secondary: #10B981; /* セカンダリカラー */
    /* ... */
}
```

## 🔒 プライバシー

- すべてのデータはブラウザのlocalStorageに保存されます
- サーバーへのデータ送信はありません（Google Spreadsheet連携を除く）
- データは完全にあなたの管理下にあります

## 🐛 トラブルシューティング

### データが表示されない

- ブラウザの開発者ツール（F12）でエラーを確認
- localStorageが有効か確認
- プライベートモード/シークレットモードでないか確認

### Spreadsheet同期が失敗する

- GAS Web App URLが正しいか確認
- Spreadsheet IDが正しいか確認
- GASのデプロイ設定を確認

## 📝 ライセンス

MIT License - 自由に使用・改変・配布できます。

## 🤝 貢献

バグ報告、機能リクエスト、プルリクエストを歓迎します！

## 📧 お問い合わせ

質問や提案がありましたら、Issueを作成してください。

---

**開発:** Expense Tracker Pro Team  
**バージョン:** 1.0.0  
**最終更新:** 2026-01-02
