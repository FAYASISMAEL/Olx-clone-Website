import { createContext, useState, useContext } from 'react';

const Search = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Search.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </Search.Provider>
  );
};

export const useSearch = () => useContext(Search);











// import React, { createContext, useContext, useState } from 'react'

// const Search = createContext();

// export const SearchProvider = ({ children }) => {
//     const [searchQuery, setSearchQuery] = useState('');

//     return(
//         <Search.Provider value = {{ searchQuery, setSearchQuery }}>
//             {children}
//         </Search.Provider>
//     )
// }

// export const useSearch = () => useContext(Search);
