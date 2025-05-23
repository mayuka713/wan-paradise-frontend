import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register(): JSX.Element {
  // フォームデータの状態を管理する
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // useNavigateを初期化

  // フォーム送信時の処理

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("パスワードが一致しません");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        setErrorMessage("登録に失敗しました");
        return;
      }

      console.log("完了しました");

      const userResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!userResponse.ok) {
        setErrorMessage("ユーザー情報取得に失敗しました");
        return;
      }

      const userData = await userResponse.json();
      const role = userData.user.role;

      console.log(`このユーザーは${role}です`);

      navigate(role === "owner" ? "/owner-page" : "/");

    } catch (error) {
      setErrorMessage("エラー発生");
    }

  };


  return (
    <div className="register-container">
      <header className="register">
        <h1 className="new-register">wan paradise</h1>
        <h2>新規会員登録</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">名前</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="名前"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-label="名前"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="メールアドレス"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              type="password"
              id="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="パスワード"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">パスワード確認</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="パスワードを再入力"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              aria-label="パスワード確認"
            />
          </div>
          <button type="submit">登録</button>
        </form>
        {errorMessage && (
          <p id="errorMessage" style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}
      </header>
    </div>
  );
}

export default Register;