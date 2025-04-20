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
・タグ検索機能を実装し、“自然芝生”や“小型犬専用あり”などの条件に基づいて、ユーザーの目的に合ったドッグランを表示できるようにしました。
　UI: React/TypeScriptでタグボタンを実装。選択状態をuseStateで管理し、変更時にfetchでバックエンドへ非同期リクエスト(tagIdsクエリ)を送信。

<img width="700" alt="スクリーンショット 2025年4月20日" src="https://github.com/user-attachments/assets/a3091ebe-22fe-41eb-8aa9-52cedd8da910" />
・レビュー投稿機能(React + Express + PostgreSQL)
UI: 店舗詳細ページに評価+コメント入力用モーダルを実装（React/TypeScript)。送信時にfetchで非同期POST→入力直後に平均評価とレビュー一覧を即時再描画。
API: Node.js(Express)で/review POST/GETエンドポイントを作成。POSTでは必須項目をバリエーションに、INSERT後にstoresとJOINしてsote_name付きで返却。

![Favorites from wan mayuka site](https://github.com/user-attachments/assets/6daae0f1-572e-4280-b301-ad369789add5)
・お気に入り登録機能

<img width="441" alt="スクリーンショット 2025年4月20日" src="https://github.com/user-attachments/assets/47a8ef62-bbe9-4231-8f84-4bb7d303296a" />
・マイページの登録
