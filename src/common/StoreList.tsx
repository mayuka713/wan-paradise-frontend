import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import ImagesSlider from "../ImageSlider";

interface Store {
  store_id: number;
  store_name: string;
  store_description: string;
  store_address: string;
  store_opening_hours: string;
  store_phone_number: string;
  store_img: string[];
  reviews: Review[];
}

interface Review {
  id: number;
  store_id: number;
  rating: number;
  comment: string;
}

interface Tag {
  id: number;
  name: string;
  tag_type: number;
}

interface StoreListProps {
  storeType: number;
  title: string;
  tagType: number;
  noDataMessage: string;
  }

  const generateDetailPageUrl = (storeType: number, storeId: number) => {
    switch (storeType) {
      case 1:
        return `/dogrun/detail/${storeId}`;
      case 2:
        return `/dogcafe/detail/${storeId}`;
      case 3:
        return `/petshop/detail/${storeId}`;
      case 4:
        return `/hospital/detail/${storeId}`;
      default:
        return `/detail/${storeId}`;
    }
  };

const StoreList: React.FC<StoreListProps> = ({
  storeType,
  title,
  tagType,
  noDataMessage,
}) => {
  const { prefectureId } = useParams<{ prefectureId?: string }>();
  const [store, setStore] = useState<Store[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  //タグの取得
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/tags`);
        if (!response.ok) {
          throw new Error("タグ情報の取得に失敗しました");
        }
        const data: Tag[] = await response.json();

        console.log("Fetched tags:", data);

        const filteredTags = data.filter((tag) => tag.tag_type === tagType);
        console.log(`Filtered tags for tagType ${tagType}:`, filteredTags);
        setTags(filteredTags);
      } catch (error) {
        console.error(error);
        setError("タグ情報の取得に失敗しました");
      }
    };
    fetchTags();
  }, [tagType]);

  // タグの選択処理
  const handleTagClick = (tagId: number) => {
    setSelectedTagIds((prev) => {
      const updated = prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId];
      console.log("Selected tags:", updated);
      return updated;
    });
  };
  
  // 都道府県名を設定
  useEffect(() => {
    const prefectureNames: { [key: string]: string } = {
      "1": "北海道",
      "13": "東京",
      "27": "大阪",
    };
    setSelectedPrefecture(prefectureNames[prefectureId ?? ""] || noDataMessage);
  }, [prefectureId]);

  // 店舗データの取得
  useEffect(() => {
    const fetchStores = async () => {
      try {
        let url = `${process.env.REACT_APP_BASE_URL}/stores/list/${prefectureId}/${storeType}`;
        if (selectedTagIds.length > 0) {
          url = `${
            process.env.REACT_APP_BASE_URL
          }/stores/list/tag/${prefectureId}?tagIds=${selectedTagIds.join(",")}`;
        }
        console.log("Fetching stores from URL", url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log("APIレスポンス:", data); // ✅ APIのレスポンスをデバッグ

        setStore(data);
        setError(null);
      } catch (error) {
        console.error("店舗データ取得エラー:", error);
        setError("該当する店舗がありません");
      }
    };
    fetchStores();
  }, [prefectureId, selectedTagIds]);

  return (
    <>
      <Header />
      <div className="content">
        {selectedPrefecture === noDataMessage ? (
          <h2>{selectedPrefecture}</h2>
        ) : (
          <>
            <h2>
              {selectedPrefecture}の{title}
            </h2>
            <p className="search-tags">{title}の条件を選ぶ</p>
            <div className="tags">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagClick(tag.id)}
                  className={`tag-button ${
                    selectedTagIds.includes(tag.id) ? "selected" : ""
                  } `}
                >
                  {tag.name}
                </button>
              ))}
            </div>

            {error ? (
              <p className="error-message">{error}</p>
            ) : (
              <div className="store-list">
                {store && store.length === 0 ? (
                  <p>{noDataMessage}</p>
                ) : (
                  store?.map((storeItem) => {
                    const reviews = storeItem.reviews ?? [];
                    const averageRating =
                      reviews.length > 0
                        ? reviews.reduce(
                            (sum, review) => sum + (review.rating || 0),
                            0
                          ) / reviews.length
                        : 0;

                    return (
                      <Link
                        to={generateDetailPageUrl(storeType, storeItem.store_id)}
                        className="store-item"
                        key={storeItem.store_id}
                      >
                        <ImagesSlider images={storeItem.store_img} />
                        <div className="star-rating-container">
                          <div className="stars-background-storelist">
                            ★★★★★
                          </div>
                          <div
                            className="stars-filled-storelist"
                            style={{ width: `${(averageRating / 5) * 100}%` }}
                          >
                            ★★★★★
                          </div>
                          <span className="average-rating-value-storelist">
                            {averageRating.toFixed(1)}
                          </span>
                        </div>
                        <h3>{storeItem.store_name}</h3>
                        <p>{storeItem.store_description}</p>
                        <p>
                          <strong>住所:</strong> {storeItem.store_address}
                        </p>
                        <p>
                          <strong>電話:</strong> {storeItem.store_phone_number}
                        </p>
                        <p>
                          <strong>営業時間:</strong>{" "}
                          {storeItem.store_opening_hours}
                        </p>
                      </Link>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}
        <Footer />
      </div>
    </>
  );
};

export default StoreList;
