import { counter } from './stores/counter';
import { market } from './stores/market';
import { getApi } from './stores/getApi';
// import { storeContext } from './context';

const useStore = () => {
  // const store = React.useContext(storeContext);
  // if (!store) {
  //   throw new Error('useStore must be used within a StoreProvider.');
  // }
  // return store;

  return { counter, market, getApi };
};

export default useStore;
