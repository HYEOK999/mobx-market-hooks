import React, { useEffect } from 'react';
import { useObserver } from 'mobx-react';
import { toJS } from 'mobx';
import useStore from '../useStore';

const Test = (props) => {
  const { getApi } = useStore();
  useEffect(() => {
    getApi.getList();
  }, [getApi]);

  console.log('테스트', toJS(getApi.users));

  return useObserver(() => (
    <div>{getApi.users.list && getApi.users.list.map((i) => <div key={i.id}>{i.id}</div>)}</div>
  ));
};

export default Test;
