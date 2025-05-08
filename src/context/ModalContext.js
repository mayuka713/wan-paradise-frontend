import React, { createContext, useContext, useState } from "react";
// Context を作成
const ModalContext = createContext(undefined);
// Provider コンポーネント
export const ModalProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [storeName, setStoreName] = useState("");
    const openModal = (name) => {
        setStoreName(name);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setStoreName("");
    };
    return (<ModalContext.Provider value={{ isModalOpen, openModal, closeModal, storeName }}>
      {children}
    </ModalContext.Provider>);
};
// Context を利用するためのカスタムフック
export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};
