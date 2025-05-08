import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PetShopRegionList.css";
import Header from "../Header";
import Footer from "../Footer";
const PetshopRegionList = () => {
    const navigate = useNavigate();
    const [prefectures, setPrefectures] = useState([]);
    useEffect(() => {
        const fetchPrefectures = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/prefectures/`); // エンドポイントを確認
                if (!response.ok) {
                    throw new Error("Failed to fetch prefectures");
                }
                const data = await response.json();
                console.log("取得したデータ:", data); // デバッグ用ログ
                setPrefectures(data);
            }
            catch (error) {
                console.error("データの取得に失敗しました:", error);
            }
        };
        fetchPrefectures();
    }, []);
    const handleClick = (id) => {
        navigate(`/PetShop/${id}`);
    };
    // 地方ごとに都道府県を分類
    const regions = prefectures.reduce((acc, prefecture) => {
        if (!acc[prefecture.region]) {
            acc[prefecture.region] = [];
        }
        acc[prefecture.region].push(prefecture);
        return acc;
    }, {});
    return (<>
    <Header />
    <div className="region-list-container">
      <h2 className="region-list-title-petshop">全国のペットショップを探す</h2>
      <div className="region-list-content">
        {Object.keys(regions).map((region) => (<div key={region} className="region-section">
            <h3 className="region-content">{region}</h3>
            <div className="dogrun-prefecture-list">
              {regions[region].map((pref) => (<button key={pref.id} onClick={() => handleClick(pref.id)} className="prefecture-button-list">
                  {pref.name}
                </button>))}
            </div>
          </div>))}
      </div>
      <Footer />
    </div>
    </>);
};
export default PetshopRegionList;
