import React, { createContext, useContext, useState, useEffect } from "react";
const FavoriteContext = createContext(undefined);

export const FavoriteProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem("favorites");
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });
    //お気に入りリストを更新するたびにlocalStorageに保存
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);
    //お気に入りを追加
    const addFavorite = (item) => {
        setFavorites((prev) => {
            //すでにお気に入りがあるときは追加しない
            if (prev.some((fav) => fav.id === item.id)) {
                return prev;
            }
            return [...prev, item];
        });
    };
    //お気入りを削除
    const removeFavorite = (id) => {
        setFavorites((prev) => prev.filter((item) => item.id !== id));
    };
    return (
        <FavoriteContext.Provider
            value={{ favorites, addFavorite, removeFavorite }}
        >
            {children}
        </FavoriteContext.Provider>
    );
};
export const useFavorites = () => {
    const context = useContext(FavoriteContext);
    if (!context) {
        throw new Error("useFavorites must be used within a FavoriteProvider");
    }
    return context;
};
