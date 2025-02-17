import React, { createContext, useContext, useState, ReactNode } from "react";

export interface FavoriteItem {
  id: number;
  name: string;
  image: string;
}

interface FavoriteContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: number) => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
 //お気に入りを追加
  const addFavorite = (item: FavoriteItem) => {
    setFavorites((prev) => [...prev, item]);
  };
//おき入りを削除
  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter(item => item.id !== id));
  };

  return (
    <FavoriteContext.Provider value={{ favorites, addFavorite,removeFavorite}}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = (): FavoriteContextType => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoriteProvider");
  }
  return context;
};
