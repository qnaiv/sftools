# sftools
## 機能
- Salesforceアカウントをグループ別に管理できる。
- 登録したSalesforceアカウントを検索できる。
- データのインポート・エクスポート(ORganizer for salesforceからのインポートにも対応)
- キーボードのみでアカウントを選択し、組織にログインできる。

## ショートカットキー
- Alt + S: sftoolsを開く(拡張機能>キーボード ショートカットから変更可)
- 上下キー: アカウントを選択
- 左右キー: 開くページを選択(ホーム・設定・開発者コンソール)
- Alt + Enter: 選択したページを開く

# インストール方法
1. zipファイルを解凍する
2. Chrome拡張機能画面で「デベロッパーモード」をオンにする
3. 「パッケージ化されていない拡張機能を読み込む」から拡張機能のディレクトリを読み込む

## 開発

```json
// install dependencies
npm install

// build extension and watch for changes
npm run dev

// build extension zip
npm run build

// lint all source files
npm run lint
```
