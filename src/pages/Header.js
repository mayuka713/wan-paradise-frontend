import React from "react";
import { Link } from "react-router-dom";
import HamburgerMenu from "../HamburgerMenu";
import "./Header.css";
const Header = () => {
    return (<>
    <HamburgerMenu />
   {/* ヘッダー */}
      <header className="App-header">
        <Link to="/top" className="header-link">Wan Paradise</Link>
        <nav className="header-nav">
          <Link to="/dogrun">ドッグラン</Link>
          <Link to="/dogcafe">ドッグカフェ</Link>
          <Link to="/petshop">ペットショップ</Link>
          <Link to="/hospital">動物病院</Link>
          <Link to="/MyPage">マイページ</Link>
        </nav>
      </header>
      </>);
};
export default Header;
