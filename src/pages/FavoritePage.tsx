import React, { useEffect, useState } from "react";
import "../pages/FavoritePage.css";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

interface Favorite {
  store_id: number;
  store_name: string;
  store_address: string;
  store_img: string;
  store_type: string;
}

interface Review {
  store_id: number;
  rating: number;
}

const FavoritePage: React.FC = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<{ id: number; email: string; name: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // **ログインユーザー情報を取得**
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
  
        if (!response.ok) {
          throw new Error("未ログイン");
        }
  
        const data = await response.json();
        console.log("ユーザーデータ:", data);
  
        //`data.user.id` を使って `user_id` を取得
        if (data.user && data.user.id) {
          setUser({ id: data.user.id, email: data.user.email, name: data.user.name });
        } else {
          throw new Error("ユーザーデータのフォーマットが不正");
        }
      } catch (error) {
        console.error("ユーザー情報の取得に失敗:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, []);
  

  // **ユーザーが取得できたら、お気に入りを取得**
  useEffect(() => {
    if (user?.id) { // `user.id` が取得できたらリクエスト実行
      const fetchFavorites = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BASE_URL}/favorites/${user.id}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });
  
          if (!response.ok) {
            throw new Error("エラーが返されました");
          }
  
          const data = await response.json();
          console.log("お気に入りデータ:", data);
          setFavorites(data);
        } catch (error) {
          console.error("お気に入りデータの取得エラー:", error);
        }
      };
  
      fetchFavorites();
    }
  }, [user]); // `user.id` の取得後にリクエストを送る
  

  // **口コミデータを取得**
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/reviews`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("口コミデータの取得に失敗しました");
        }

        const data = await response.json();
        console.log("口コミデータ:", data);
        setReviews(data);
      } catch (error) {
        console.error("口コミデータの取得エラー:", error);
      }
    };

    fetchReviews();
  }, []);

  const categories = [
    { type: "1", name: "ドッグラン" },
    { type: "2", name: "ドッグカフェ" },
    { type: "3", name: "ペットショップ" },
    { type: "4", name: "動物病院" },
  ];

  const categorizedFavorites = categories.map(({ type, name }) => ({
    category: name,
    stores: favorites.filter((favorite) => favorite.store_type === type),
  }));

  return (
    <>
      <Header />
      <div className="favorite-container">
        <header className="app-header">
          <h1 className="favorite-main-title">お気に入り一覧</h1>
        </header>

        {/* ロード中の処理 */}
        {loading ? (
          <p>データを読み込み中...</p>
        ) : user ? (
          // ログイン済み
          categorizedFavorites.map(({ category, stores }) => (
            <div key={category} className="category-section">
              <h2 className="category-title">{category}</h2>
              <ul className="favorite-list">
                {stores.length > 0 ? (
                  stores.map((favorite) => {
                    const storeReviews = reviews.filter(
                      (review) => review.store_id === favorite.store_id
                    );
                    const averageRating =
                      storeReviews.length > 0
                        ? storeReviews.reduce((sum, review) => sum + review.rating, 0) /
                          storeReviews.length
                        : 0;

                    let detailPage = "/";
                    switch (favorite.store_type) {
                      case "1":
                        detailPage = `/dogrun/detail/${favorite.store_id}`;
                        break;
                      case "2":
                        detailPage = `/dogcafe/detail/${favorite.store_id}`;
                        break;
                      case "3":
                        detailPage = `/petshop/detail/${favorite.store_id}`;
                        break;
                      case "4":
                        detailPage = `/hospital/detail/${favorite.store_id}`;
                        break;
                    }
                    return (
                      <Link key={favorite.store_id} to={detailPage} className="favorite-link">
                        <li className="favorite-item">
                          <img
                            src={favorite.store_img || "https://placehold.jp/150x150.png"}
                            alt={favorite.store_name}
                            className="favorite-item-img"
                            onError={(e) => {
                              console.log("🖼 画像URL:", favorite.store_img);
                              e.currentTarget.src = "https://placehold.jp/150x150.png";
                            }}
                          />
                          <h2 className="favorite-title">{favorite.store_name}</h2>
                          <div className="review-average-favorite">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <span
                                key={`star-${favorite.store_id}-${value}`}
                                className={`star ${value <= Math.round(averageRating) ? "selected" : ""}`}
                              >
                                ★
                              </span>
                            ))}
                            <strong>{averageRating.toFixed(1)}</strong>
                          </div>
                        </li>
                      </Link>
                    );
                  })
                ) : (
                  <p className="no-favorites">お気に入りがまだ登録されていません。</p>
                )}
              </ul>
            </div>
          ))
        ) : (
          // 未ログイン時
          <p>お気に入りを表示するにはログインしてください。</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FavoritePage;
