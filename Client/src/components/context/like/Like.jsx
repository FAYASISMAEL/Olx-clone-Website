import React, { createContext, useContext, useState, useEffect } from 'react';

const LikeContext = createContext();

export const LikeProvider = ({ children }) => {
  const [likedAds, setLikedAds] = useState(() => {
    const saved = localStorage.getItem('likedAds');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('likedAds', JSON.stringify(likedAds));
  }, [likedAds]);

  const toggleLike = (adId) => {
    setLikedAds((prev) => ({
      ...prev,
      [adId]: !prev[adId],
    }));
  };

  return (
    <LikeContext.Provider value={{ likedAds, toggleLike }}>
      {children}
    </LikeContext.Provider>
  );
};

export const useLikes = () => useContext(LikeContext);