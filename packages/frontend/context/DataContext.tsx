// src/context/DominantColorsContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";

type DataContextType = {
  dominantColors: number[][];
  setDominantColors: React.Dispatch<React.SetStateAction<number[][]>>;
  videoLink: string;
  setVideoLink: React.Dispatch<React.SetStateAction<string>>;
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [dominantColors, setDominantColors] = useState<number[][]>([]);
  const [videoLink, setVideoLink] = useState(
    typeof window !== "undefined" ? localStorage.getItem("videoLink") || "" : ""
  );
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: null,
    username: "",
  });

  return (
    <DataContext.Provider
      value={{
        dominantColors,
        setDominantColors,
        videoLink,
        setVideoLink,
        userInfo,
        setUserInfo,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataContext");
  }
  return context;
};