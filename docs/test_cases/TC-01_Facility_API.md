# テストケース: 施設管理API

**ドキュメントID:** TC-01_Facility_API
**作成日:** 2025-12-31

## 1. 概要
施設（Facility）モデルに関連するAPIエンドポイントの基本的なCRUD（作成、読み取り、更新、削除）操作が、仕様通りに動作することを確認する。

## 2. 参照ドキュメント
- テスト計画書: `docs/TESTING.md`
- データソース: `backend/facilities/test_data/facilities_test_data.csv`

## 3. テストケース一覧

| テストID | テスト項目 | 事前条件 | 手順 | 期待する結果 |
| :--- | :--- | :--- | :--- | :--- |
| **FAC-API-001** | 新規施設の作成（正常系） | サーバーが起動している | 1. `POST /api/facilities/` を実行<br>2. Payload: `{"facility_name": "CSV Facility", "capacity": 10, "address": "CSV Address"}` | 1. HTTPステータスコード`201 Created`が返る<br>2. レスポンスボディに`"facility_name": "CSV Facility"`が含まれる |
| **FAC-API-002** | 既存施設の取得 | `setUp`により初期施設が1件作成されている | 1. `GET /api/facilities/{TARGET_ID}/` を実行 | 1. HTTPステータスコード`200 OK`が返る<br>2. レスポンスボディに`"facility_name": "初期施設"`が含まれる |
| **FAC-API-003** | 既存施設の更新 | `setUp`により初期施設が1件作成されている | 1. `PATCH /api/facilities/{TARGET_ID}/` を実行<br>2. Payload: `{"capacity": 20}` | 1. HTTPステータスコード`200 OK`が返る<br>2. レスポンスボディに`"capacity": 20`が含まれる |
| **FAC-API-004** | 新規施設の作成（異常系） | サーバーが起動している | 1. `POST /api/facilities/` を実行<br>2. Payload: `{"facility_name": "", "capacity": 5, "address": "Bad Address"}` | 1. HTTPステータスコード`400 Bad Request`が返る |
| **FAC-API-005** | 既存施設の削除 | `setUp`により初期施設が1件作成されている | 1. `DELETE /api/facilities/{TARGET_ID}/` を実行 | 1. HTTPステータスコード`204 No Content`が返る |
| **FAC-API-006** | テストの独立性証明 | `setUp`により初期施設が1件作成されている | 1. `GET /api/facilities/{TARGET_ID}/` を実行 | 1. HTTPステータスコード`200 OK`が返る (FAC-API-005で削除したはずの施設が、テストの独立性により再作成されていることを確認) |
