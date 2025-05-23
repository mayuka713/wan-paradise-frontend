import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DogCafePage.css";
import Header from "../Header";
import Footer from "../Footer";
import HamburgerMenu from "../../HamburgerMenu";
import dogcafeImage from "../../pages/assets/images/Dogcafe/dogcafe.top.png";

interface Store {
  store_id: number;
  store_name: string;
  description: string;
  store_img: string[];
  address: string;
  phone_number: string;
  opening_hours: string;
  store_url: string;
  prefecture_name: string;
}

const DogCafePage: React.FC = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);
  const slideRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);

  const handleClick = () => {
    navigate("/DogCafeRegionList");
  };

  // 店舗データを取得
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/stores/type/random/2`);
        if (!response.ok) {
          throw new Error(`HTTPエラー: ${response.status}`);
        }
        const data = await response.json();

        // データを3倍に複製
        setStores([...data, ...data, ...data]);
      } catch (error) {
        console.error("データ取得中にエラーが発生しました:", error);
      }
    };
    fetchStoreData(); // 初回レンダリング時のみ実行
  }, []);

  // アニメーションの設定
  useEffect(() => {
    if (!slideRef.current || stores.length === 0) return;

    const slider = slideRef.current;
    let startPosition = 0;

    const animate = () => {
      startPosition -= 1;

      // スライダーをループさせる
      if (Math.abs(startPosition) >= slider.scrollWidth / 2) {
        startPosition = 0;
      }

      slider.style.transform = `translateX(${startPosition}px)`;
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    // クリーンアップ
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [stores]);

  return (
    <>
      <Header />
      <div className="dogcafe-page-container">
        <p onClick={handleClick} className="search-dogcafe">
          全国のドッグカフェを探す→
        </p>
        <div>
          <img src={dogcafeImage} alt="ドッグカフェのイラスト" className="dogcafeImage" />
        </div>
        <div className="store-slider-container">
          <div className="dogrun-slider" ref={slideRef}>
            {stores.map((store, index) => (
              <div
                key={`${store.store_id}-${index}`}
                className="store-card"
                onClick={() => navigate(`/dogcafe/detail/${store.store_id}`)}
              >
                {store.store_img.length > 0 && (
                  <img
                    src={store.store_img[0]}
                    alt={store.store_name}
                    className="store-image"
                  />
                )}
                <h3 className="slider-store-name">{store.store_name}</h3>
                <h3 className="slider-prefecture-name">{store.prefecture_name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DogCafePage;