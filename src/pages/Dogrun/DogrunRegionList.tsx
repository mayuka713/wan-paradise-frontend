import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DogRunRegionList.css";
import Header from "../Header";
import Footer from "../Footer";

interface Prefecture {
  id: number;
  name: string;
  region: string;
}

const DogrunRegionList: React.FC = () => {
  const navigate = useNavigate();
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);

  useEffect(() => {
    const fetchPrefectures = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/prefectures/`);
        if (!response.ok) {
          throw new Error("Failed to fetch prefectures");
        }
        const data: Prefecture[] = await response.json();
        setPrefectures(data);
      } catch (error) {
        console.error("Error to fetch prefectures");
      }
    };

    fetchPrefectures();
  }, []);

  const handleClick = (id: number) => {
    navigate(`/dogrun/${id}`);
  };

  const regions = prefectures.reduce((acc: { [region: string]: Prefecture[] }, prefecture) => {
    if (!acc[prefecture.region]) { //箱（地域）がまだないなら。。。
      acc[prefecture.region] = []; //新しく空の箱を作る
    }
    acc[prefecture.region].push(prefecture);//その箱に都道府県を追加
    return acc; //更新した箱を次の処理に渡す
  }, {}); //最初は空のオブジェクト

  return (
    <>
    <Header/>
    <div className="region-list-container">
      <h2 className="region-search">全国のドッグランを探す</h2>
      <div className="region-list-content">
        {Object.keys(regions).map((region) => (
          <div key={region} className="region-section">
            <h3 className="region-content">{region}</h3>
            <div className="dogrun-prefecture-list">
              {regions[region].map((pref) => (
                <button
                  key={pref.id}
                  onClick={() => handleClick(pref.id)}
                  className= "prefecture-button-list"
                >
                  {pref.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default DogrunRegionList;
