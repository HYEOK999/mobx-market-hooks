// src/Context.js

import React, { createContext } from 'react';
import { counter } from './stores/counter';
import { market } from './stores/market';
import { getApi } from './stores/getApi';
import { useLocalStore } from 'mobx-react';

export const storeContext = createContext({});

export const StoreProvider = ({ children }) => {
  const value = useLocalStore(() => ({
    counter,
    market,
    getApi,
  }));
  return <storeContext.Provider value={value}>{children}</storeContext.Provider>;
};

export default StoreProvider;
