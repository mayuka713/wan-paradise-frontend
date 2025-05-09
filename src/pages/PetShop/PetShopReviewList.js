import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import "./PetShopReviewList.css";
import Header from "../Header";
import Footer from "../Footer";
import Modal from "../../components/Modal";
const PetShopReviewList = () => {
    const { storeId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [storeName, setStoreName] = useState("");
    const { openModal } = useModal();
    useEffect(() => {
        if (!storeId)
            return;
        const fetchReviews = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/reviews/${storeId}`);
                if (!response.ok)
                    throw new Error("口コミの取得に失敗しました");
                const data = await response.json();
                setReviews(data);
                if (data.length > 0) {
                    const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
                    const avgRating = totalRating / data.length;
                    setAverageRating(Math.min(avgRating, 5));
                }
                else {
                    setAverageRating(0);
                }
            }
            catch (err) {
                setError("口コミの取得に失敗しました");
            }
        };
        //店舗名を取得する
        const fetchStoreName = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/stores/store-name/${storeId}`);
                const data = await response.json();
                console.log("取得した店舗データ");
                setStoreName(data.store_name);
            }
            catch (error) {
                setError("店舗情報の取得に失敗しました");
            }
        };
        fetchReviews();
        fetchStoreName();
    }, [storeId]);
    //口コミを取得
    // 口コミを投稿する関数
    const handleReviewSubmit = async (rating, comment) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/reviews`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    store_id: storeId,
                    rating,
                    comment,
                }),
            });
            if (!response.ok) {
                throw new Error("コメント投稿に失敗しました");
            }
            const newReview = await response.json();
            setReviews((prevReviews) => {
                const updatedReviews = [newReview, ...prevReviews]; // 新しい口コミを追加
                const totalRating = updatedReviews.reduce((sum, rev) => sum + rev.rating, 0);
                const newAverageRating = totalRating / updatedReviews.length;
                setAverageRating(Math.min(newAverageRating, 5)); // 平均評価を更新
                return updatedReviews; // 更新されたレビューリストを `setReviews` にセット
            });
        }
        catch (err) {
            setError("コメント投稿に失敗しました");
        }
    };
    return (<>
      <Header />
      <div className="review-container">
        <h1 className="store-name-review">{storeName || "店舗名を取得中"}</h1>
        <div className="review-star-container">
          <div className="review-star-background">★★★★★</div>
          <div className="review-star-filled" style={{
            width: `${(averageRating / 5) * 100}%`,
        }}>
            ★★★★★
            </div>
        </div>
        <span className="average-rating-value">{averageRating.toFixed(1)}</span>
        <h2 className="review-title">{storeName}口コミ一覧</h2>
        <button onClick={() => openModal(storeName)} className="click-review-button">
          投稿
        </button>

        {reviews.map((review) => (<div key={review.id} className="review-card">
            <p className="review-rating">
              {[1, 2, 3, 4, 5].map((value) => (<span key={value} className={`star ${value <= review.rating ? "selected" : ""}`}>
                  ★
                </span>))}
              <strong style={{ marginLeft: "8px" }}>{review.rating.toFixed(1)}</strong>
            </p>
            <p className="review-comment">{review.comment}</p>
          </div>))}
      </div>
      <Footer />
      <Modal onSubmit={handleReviewSubmit}/>
      </>);
};
export default PetShopReviewList;
