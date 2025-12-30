# 民泊における業務管理ツール

## 開発意図
すでに別のレポジトリでバイブコーディングしていたが、それでは全く知識が身につかないため、ハンズオンで実際に手を動かし、施工作で試開発することとする。

### 開発期間
2025年12月31 ~ 2026年3月31日

### 実装機能
- 民泊の売り上げ機能
- 施設情報の登録・変更・削除
- 宿泊者名簿と宿泊税支払い状況の管理・確認
- 宿泊者名簿の提出状況の管理・確認 (Google Sheets API連携)

--- 

## 起動方法
1. 以下を実行し、package.json等を作成
```shell
docker run --rm -it -v "$(pwd)/frontend:/app" -w /app node:24-slim npm create vite@latest . -- --template react
```

2. 以下を実行し、Djangoにappを追加
```shell
docker-compose exec backend python manage.py migrate
```

3. docker-composeを起動
```shell
docker-compose up -d --build
```
