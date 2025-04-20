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


このアプリは「犬を飼っているユーザーが必要な情報を探すのに時間がかかる」という実体験から着想を得ました。  
React / Express / PostgreSQL で構成されたフルスタックアプリで、タグ検索・レビュー投稿・お気に入り登録・マイページ機能など、ユーザー中心の設計を意識して作り込みました。  
現在はシーディングで店舗データを登録していますが、今後は店舗オーナー自身が情報を登録・編集できる管理機能の導入を目指しています。

---

## スクリーンショット


<img width="905" alt="2025年4月20日 スクリーンショット" src="https://github.com/user-attachments/assets/627d5860-b6cc-445c-9b53-884d5d1ac826" />　

（タグによる絞り込み機能）

・タグデータはGET/tagsエンドポイントから取得し、tag_typeによって種類別（例：type1=特徴、type2=設備）に分類して表示

・タグをクリックすると、ReactのselectedTagIdsステートにIDを追加または削除（トグル処理）

・取得した店舗情報（画像・住所・評価・営業時間など）をReactでリスト表示し、星評価の平均は review.rating の平均値として計算し視覚化


<img width="700" alt="スクリーンショット 2025年4月20日" src="https://github.com/user-attachments/assets/a3091ebe-22fe-41eb-8aa9-52cedd8da910" />


（レビュー投稿機能）

・特定の店舗ごとにレビューを取得・表示（GET/reviews/:store_id）

・平均評価を計算して表示（フロント側で計算）

・投稿時はモーダルを使用し、コメントと星評価を送信

![Favorites from wan mayuka site](https://github.com/user-attachments/assets/6daae0f1-572e-4280-b301-ad369789add5)

（お気に入り登録機能）

・ログイン中のユーザー情報を/auth/meから取得

・ユーザーIDをもとに、/favorites/:user_idからお気に入り店舗を取得

・お気に入り追加：POST/favoritesにuser_idとstore_idを送信。 お気に入り削除: DELETE/favoritesにuser_idとstore_idを送信。

<img width="441" alt="スクリーンショット 2025年4月20日" src="https://github.com/user-attachments/assets/47a8ef62-bbe9-4231-8f84-4bb7d303296a" />

（マイページの登録）

・　ユーザー情報をGET/auth/meで取得し、ユーザー名・メールアドレスをマイページに表示

・プロフィールの変更はPOST/auth/updateにて送信し、名前・メール・パスワードを更新

・ログアウトはPOST/auth/logoutによりセッション用クッキーを削除してログアウト完了
