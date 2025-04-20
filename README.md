# Wan Paradise - 全国の犬関連施設検索アプリ

[アプリを使ってみる](https://wan.mayuka.site)

全国の犬関連施設（ドッグラン、ドッグカフェ、ペットショップ、動物病院）を検索・管理できるWebアプリケーションを開発しました。（現在は、北海道・東京・大阪の店舗情報を表示しています。）

ユーザーが自分のニーズに合った店舗を簡単に見つけられるように、以下のような機能を実装しています。

- タグ検索機能（例：駐車場あり、小型犬専用あり など）
- お気に入り登録機能
- レビュー投稿機能
- スマートフォン対応（レスポンシブデザイン）

---

## 使用技術

| 分野 | 技術 |
|------|------|
| フロントエンド | React / TypeScript |
| バックエンド |TypeScript/  Node.js / Express |
| データベース | PostgreSQL |

---

## 技術選定の理由

- **React**：UIをコンポーネントごとに分けて開発・管理できるため、拡張性が高く保守しやすい。
- **TypeScript**：型安全性を確保し、バグの発生を抑えることができる。
- **Node.js + Express**：シンプルで柔軟なAPIの構築が可能。
- **PostgreSQL**：リレーショナルデータの管理に強く、必要な情報を効率よく扱える。

---

## このアプリを作成した目的

私は犬を飼っているのですが、ドッグラン、ドッグカフェ、ペットショップ、動物病院を探す際に、多くのサイトを行き来したり、Googleで1件ずつ口コミを調べるのが大変だと感じていました。
そこで、犬に関する施設情報を1つのサイトに集約し、使いやすい検索機能を提供できれば便利だと考え、このWebアプリの開発に至りました。
ペットを飼っている方が、必要な情報を手間なく見つけられるような、ユーザー目線のサービスを目指しています。

---

## スクリーンショット


<img width="905" alt="2025年4月20日 スクリーンショット" src="https://github.com/user-attachments/assets/627d5860-b6cc-445c-9b53-884d5d1ac826" />　
非同期タグ検索機能（React + Express + PostgreSQL）

UI：React／TypeScript でタグボタンを実装。選択状態を useState で管理し、変更時に fetch でバックエンドへ非同期リクエスト（tagIds クエリ）を送信。

API：Node.js（Express）で /stores/list/tag/:prefectureId エンドポイントを作成。都道府県 ID と複数タグ ID を受け取り、PostgreSQL の stores と store_tags を JOIN して対象店舗を返却。

結果表示：取得した JSON を即時レンダリングし、タグの付け外しに応じて店舗一覧をリアルタイム更新

<img width="700" alt="スクリーンショット 2025年4月20日" src="https://github.com/user-attachments/assets/a3091ebe-22fe-41eb-8aa9-52cedd8da910" />
・レビュー投稿機能(React + Express + PostgreSQL)
UI：店舗詳細ページに評価＋コメント入力用モーダルを実装（React／TypeScript）。送信時に fetch で非同期 POST → 入力直後に平均評価とレビュー一覧を即時再描画。

API：Node.js（Express）で /reviews POST／GET エンドポイントを作成。POST では必須項目をバリデーションし、INSERT 後に stores と JOIN して store_name 付きで返却。

SQL：PostgreSQL に reviews テーブルを作成し、createdAt・updatedAt を自動登録。平均評価は AVG(rating) OVER() で計算して一覧 API に同梱。

![Favorites from wan mayuka site](https://github.com/user-attachments/assets/6daae0f1-572e-4280-b301-ad369789add5)
・お気に入り登録機能

<img width="441" alt="スクリーンショット 2025年4月20日" src="https://github.com/user-attachments/assets/47a8ef62-bbe9-4231-8f84-4bb7d303296a" />
・マイページの登録
