import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./Mypage.css";

const MyPage: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formUserName, setFormUserName] = useState(userName);
  const [formEmail, setFormEmail] = useState(email);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("ログアウトに失敗しました");
      }
      setUserName("");
      setEmail("");

      console.log("ログアウト成功");
      navigate("/"); // ログインページに遷移
    } catch (error) {
      console.log("ログアウトエラー", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("ユーザー情報の取得に失敗しました");
        }
        const data = await response.json();
        console.log("ユーザーデータ取得:", data);

        if (data.user) {
          setUserName(data.name || "");
          setEmail(data.email || "");
          setFormUserName(data.user.name || "");
          setFormEmail(data.user.email || "");
        } else {
          throw new Error("ユーザーデータが空です");
        }
      } catch (error) {
        console.error("エラー:", error);
      }
    };

    fetchUser();
  }, []);


  const handleSave = async () => {
    const requestData = { name: formUserName, email: formEmail, password };
    console.log("📡 送信データ:", requestData); // デバッグ用ログ
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: formUserName, email: formEmail, password }),
      });
      if (!response.ok) {
        throw new Error("プロフィールの更新に失敗しました");
      }
      const data = await response.json();
      console.log("プロフィール更新成功:", data);

      //サーバーから最新のデータを反映
      setUserName(data.user.name || formUserName);
      setEmail(data.user.email || formEmail);
      setPassword("");
      setIsModalOpen(true);
    } catch (error) {
      console.error("エラー発生:", error);
    }
  };

  return (
    <>
      <div className="mypage-container">
        <Header />
        <h1 className="mypage-title">マイページ</h1>
        <div className="user-info-container">
          <p>ユーザー名：{formUserName}</p>
          <p>メールアドレス:{formEmail}</p>
        </div>
        <Link to="/favorites">
          <div className="favorite-mypage-container">
            <p className="favorite-mypage">お気に入りを見る</p>
          </div>
        </Link>
        <p className="update-info-title">ユーザー名とパスワードを変更する</p>
        <form className="profile-update-form" onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}>
          <label>
            ユーザ名の変更
            <input
              type="text"
              placeholder="新しいユーザー名を入力"
              value={formUserName}
              onChange={(e) => setFormUserName(e.target.value)}
              className="text-input"
            />
          </label>
          <label>
            メールアドレスの変更:
            <input
              type="email"
              placeholder="メールアドレスを入力"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              className="email-input"
            />
          </label>

          <label>
            パスワードの変更
            <input
              type="password"
              placeholder="新しいパスワードを入力"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">保存</button>
        </form>
        <div className="logout-container">
          <button type="button" onClick={handleLogout} className="logout-button">ログアウト</button>
        </div>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <p>プロフィールが新しく更新されました!</p>
              <button onClick={() => setIsModalOpen(false)}>閉じる</button>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default MyPage;
