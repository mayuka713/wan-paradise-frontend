import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import ImageSlider from "../../ImageSlider";
import "./DogCafeDetail.css";
const DogCafeDetail = () => {
    const { id } = useParams();
    const [store, setStore] = useState(null);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userId, setUserId] = useState(null);
    const MAP_API_KEY = process.env.REACT_APP_MAP_API_KEY;
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/me`, {
                    method: "GET",
                    credentials: "include", // クッキーを送信
                    headers: { "Content-Type": "application/json" },
                });
                if (!response.ok) {
                    throw new Error("未ログイン");
                }
                const data = await response.json();
                console.log("ユーザーデータ:", data); // 取得したデータを表示
                // `data.user.id` から `user_id` をセット
                if (data.user && data.user.id) {
                    console.log("user_idを取得:", data.user.id);
                    setUserId(data.user.id);
                }
                else {
                    throw new Error("ユーザーデータのフォーマットが不正");
                }
            }
            catch (error) {
                console.error("user_idの取得に失敗:", error);
                setUserId(null);
            }
        };
        fetchUserId();
    }, []);
    useEffect(() => {
        const fetchStoreAndReviews = async () => {
            try {
                const storeResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/stores/detail/${id}`);
                if (!storeResponse.ok)
                    throw new Error("店舗情報の取得に失敗しました");
                const storeData = await storeResponse.json();
                const reviewResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/reviews`);
                if (!reviewResponse.ok)
                    throw new Error("口コミ情報の取得に失敗しました");
                const reviewData = await reviewResponse.json();
                const reviews = reviewData.filter((review) => review.store_id === storeData.store_id);
                setStore({ ...storeData, reviews });
            }
            catch (err) {
                console.error("データ取得エラー:", err);
                setError("データの取得に失敗しました。ページを更新してください。");
            }
        };
        if (id) {
            fetchStoreAndReviews();
        }
    }, [id]);
    useEffect(() => {
        const fetchFavorites = async () => {
            if (userId === null)
                return; // 修正ポイント: userId が取得できるまで実行しない
            try {
                const favoriteResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/favorites/${userId}`);
                if (favoriteResponse.ok) {
                    const favoriteData = await favoriteResponse.json();
                    setIsFavorite(favoriteData.some((fav) => fav.store_id === Number(id)));
                }
            }
            catch (err) {
                console.error("お気に入り情報取得エラー:", err);
            }
        };
        if (id && userId !== null) {
            fetchFavorites();
        }
    }, [id, userId]); // userId の取得後に fetchFavorite を実行
    //----------------------
    const handleFavoriteClick = async () => {
        console.log("お気に入りボタンがクリックされました");
        if (!store || userId === null) {
            console.error("store または userId が未定義:", { store, userId });
            return;
        }
        console.log("現在の `store_id`:", store?.store_id);
        console.log("現在の `user_id`:", userId);
        const url = `${process.env.REACT_APP_BASE_URL}/favorites`;
        const method = isFavorite ? "DELETE" : "POST";
        const body = JSON.stringify({
            user_id: userId,
            store_id: store.store_id,
        });
        console.log("送信リクエスト:", { url, method, body });
        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include", // クッキーを送信するために追加
                body,
            });
            console.log("レスポンスステータス:", response.status);
            console.log("レスポンスボディ:", await response.text()); // エラーメッセージを取得
            if (!response.ok)
                throw new Error("お気に入りの更新に失敗しました");
            setIsFavorite(!isFavorite);
            console.log("お気に入り状態が更新されました:", !isFavorite);
        }
        catch (err) {
            console.error("お気に入りの更新エラー:", err);
        }
    };
    if (error)
        return <div className="container">{error}</div>;
    if (!store)
        return <div className="container">データを読み込んでいます..</div>;
    // 平均評価の計算
    const averageRating = store.reviews && store.reviews.length > 0
        ? store.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
            store.reviews.length
        : 0;
    return (<>
      <Header />
      <div className="detail-container">
        <h1 className="detail-title">{store.store_name}</h1>
        <div className="container">
        {store.store_img.length > 0 ? (<ImageSlider images={store.store_img}/>) : (<p>画像がありません</p>)}
        {store.reviews && store.reviews.length > 0 && (<Link to={`/dogcafe/reviews/${store.store_id}`} className="review-button-detail">
            口コミを見る
          </Link>)}
      </div>
        {/* 平均評価を星で表示 */}
        <div style={{ margin: "20px 0" }}>
          {store.reviews && store.reviews.length > 0 ? (<>
              <div style={{ fontSize: "24px", color: "gray" }}>
                {[1, 2, 3, 4, 5].map((value) => (<span key={value} className={`star ${value <= Math.round(averageRating) ? "selected" : ""}`}>
                    ★
                  </span>))}
              </div>
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                {averageRating.toFixed(1)}
              </p>
            </>) : (<p>まだ口コミはありません</p>)}
        </div>
        {/* 店舗情報 */}
        <p>
          <strong>住所: </strong>
          {store.store_address}
        </p>
        {/* Google Map 埋め込み */}
        {MAP_API_KEY && (<div style={{ margin: "20px 0" }}>
            <iframe title="Google Map" width="100%" height="300" style={{ border: "0", borderRadius: "8px" }} src={`https://www.google.com/maps/embed/v1/place?key=${MAP_API_KEY}&q=${encodeURIComponent(store.store_address)}`} allowFullScreen></iframe>
          </div>)}
        <p>電話番号: {store.store_phone_number}</p>
        <p>営業時間: {store.store_opening_hours}</p>
        
        {/* お気に入りボタン */}
        <button onClick={handleFavoriteClick} className={`favorite-button ${isFavorite ? "active" : ""}`}>
          {isFavorite ? "お気に入り解除" : "お気に入り登録"}
        </button>
        <br />
        <a href={store.store_url} target="_blank" rel="noopener noreferrer" className="official-site">
          店舗の公式サイト
        </a>
      </div>
      <Footer />
    </>);
};
export default DogCafeDetail;
