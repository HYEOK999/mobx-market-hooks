![mobx-hooks](https://user-images.githubusercontent.com/31315644/79090670-5ea1b600-7d85-11ea-81e0-93999c6c18e0.png)

---------

# React Hooks + Mobx 예제 - 슈퍼마켓 구현하기 - 

## 목차

- [소개](#a1)

- [시작](#a2)
  - [데코레이터 설정 X](#a3)
  - [프로젝트 초기화 및 폴더 구조](#a4)

- [카운터 만들기](#a5)
  - [new: src/stores/counter.js](#a6)
  - [new: src/useStore.js](#a7)
  - [edit: src/App.js](#a8)
  - [new: src/components/Counter.jsx](#a9)

- [슈퍼마켓 UI 구현하기](#a10)
  - [new: src/components/SuperMarketTemplate.jsx](#a11)
  - [new: src/components/SuperMarket.jsx](#a12)
  - [edit: src/App.js](#a13)
  - [new: src/components/ShopItem.js](#a14)
  - [new: src/components/ShopItemList.jsx](#a15)
  - [edit: src/components/SuperMarket.js](#a16)
  - [new: src/components/BasketItem.jsx](#a17)
  - [new: src/components/BasketItemList.js](#a18)
  - [edit: src/components/SuperMarket.js](#a19)

- [슈퍼마켓 스토어 구현하기](#a20)
  - [new: src/stores/market.js](#a21)
  - [edit: src/useStore.js](#a22)

- [기능 구현하기 - 아이템 추가](#a23)
  - [edit: src/components/ShopItemList.js](#a24)
  - [edit: src/components/ShopItem.js](#a25)

- [기능 구현하기 - 장바구니에 데이터 반영](#a26)
  - [edit: src/components/BasketItemList.js](#a27)
  - [edit: src/components/BasketItem.js](#a28)

- [스토어 끼리 관계형성](#a29)

  - [edit: src/stores/market.js - put 액션](#a30)

- [MobX 의 리액트 컴포넌트 최적화](#a31)
  - [규칙](#a32)
  - [리스트를 렌더링 할 땐, 컴포넌트에 리스트 관련 데이터만 props 로 넣기](#a33)
    - [new: src/components/TotalPrice.js](#a34)
    - [edit: src/components/SuperMarket.js](#a35)
    - [edit: src/components/SuperMarketTemplate.js](#a36)
  - [세부참조 (dereference)는 최대한 늦게하자](#a37)
    - [edit: src/components/BracketItemList.js](#a38)
    - [edit: src/components/BracketItem.js](#a39)
  - [완성](#a40)

- [추가 : Context를 이용하는 방법](#43)
- [edit: src/index.jsx](#a44)
  - [edit: src/useStore.jsx](#a45)
- [new: src/Context.jsx](#a46)

- [느낀점](#a41)

- [Reference](#a42)

----------------

## 소개 <a id="a1"></a>

 2019년에 들어서면서 React 측에서 Hooks를 소개했습니다. Hooks는 React 생태계에서 적지 않은 파생을 일으켰고 많은 코드들이 마이그레이션되었습니다. 

 오늘 소개할 예제는 기존의 `velopert` 님께서 작성하신 [Mobx 슈퍼마켓 구현하기](https://velog.io/@velopert/MobX-3-심화적인-사용-및-최적화-방법-tnjltay61n) 를 Hooks 형태로 마이그레이션 하는 작업을 해보도록하겠습니다.

 시작하기 전에 다음과 사항을 읽어주세요.

1. 저는 주니어 개발자입니다. 미흡한 점이 많으니 잘못된 부분은 지적 부탁드립니다.
2. Mobx는 정말 자유롭습니다. 기존 코드나 공식홈페이지에서 제공하는 코드와 양식이 다소 다를 수 있습니다.

<br/>

우선, 저는 원래 React에서는 Hooks를 즐겨 사용하였고 상태 관련 라이브러리는 Redux + Redux Saga를 사용하였습니다. 

이번에 Mobx를 공부하면서 Mobx에 대한 대부분의 레퍼런스들은 여전히 Class 기반의 데코레이터를 많이 사용하는 것을 확인하였고 레퍼런스 등록 날짜도 대부분이 2018년에서 19년 초였습니다... 😞

여러가지 강좌나 레퍼런스를 읽으며 Mobx를 사용하는 방법들을 익혔고 `velopert`님이 작성하신 [Mobx 슈퍼마켓 구현하기](https://velog.io/@velopert/MobX-3-심화적인-사용-및-최적화-방법-tnjltay61n)를 Hooks와 Function형태로 변경해보도록 하겠습니다. 

클래스의 형태와 쉽게 비교하기 위해서 `velopert`님이 작성하신 순서를 그대로 따라가도록 하겠습니다.

<br/>

## 시작 <a id="a2"></a>

```bash
$ npx create-react-app mobx-market-hooks
$ npm  i mobx mobx-react
```

<br/>

### 데코레이터 설정 X 🙅‍♀️ <a id="a3"></a>

 JS 기준으로 기존 mobx의 데코레이터를 이용하기 위해서는 `npm run eject`를 해주고 설정해야만 했습니다. Hooks를 이용할 때에는 굳이 데코레이터를 이용하지 않겠습니다. 만약에 별도로 이용하고 싶으시면 다음 코드를 추가합니다. **제가 사용할 예제에서는 데코레이터를 이용하지 않습니다.**

```bash
$ npm i @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators
```

VSC 기준 : VSC 환경설정 : `CMD + ,` 누르고 `TypeScript Decorators` 검색

![VSC환경설정](https://user-images.githubusercontent.com/31315644/78847101-c89a2280-7a48-11ea-8f34-21dd11a80657.jpeg)

<br/>

### 프로젝트 초기화 및 폴더 구조      <a id="a4"></a>

시작하기에 앞서 프로젝트를 초기화하겠습니다.

`src` 폴더 내에 `App.js` 와 `index.js`를 제외한 모든 파일을 삭제합니다. 그 후 `index.js` 와 `App.js`의 파일을 다음처럼 수정합니다.

```jsx
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

```jsx
// src/App.js
import React from 'react';

function App() {
  return <div className="App"></div>;
}

export default App;
```

<br/>

**마지막으로 완성된 폴더구조와 화면은 다음과 같습니다.**

![structure](https://user-images.githubusercontent.com/31315644/79088988-5b0b3080-7d7f-11ea-92d4-57a82d169370.png)

![step01](https://user-images.githubusercontent.com/31315644/79084261-b6ccbe00-7d6d-11ea-9344-b2def1290aff.jpg)

<br/>

## 카운터 만들기      <a id="a5"></a>

### `new`: src/stores/counter.js      <a id="a6"></a>

추후에 `market`관련 데이터도 스토어로 만들 것이기 때문에 `stores`라는 폴더를 생성하고 내부에 `counter` 스토어를 만들어줍니다.

저는 데코레이터를 이용하지 않을 것이기 때문에 `class`가 아니라 객체 형태와 메소드로 작성하고 `observable`로 감싸줍니다.

````js
import { observable } from 'mobx';

const counter = observable({
  number: 1,
  increase() {
    this.number++;
  },
  decrease() {
    this.number--;
  },
});

export { counter };
````

<br/>

### `new`: src/useStore.js      <a id="a7"></a>

`stores` 폴더에 생길 모든 스토어들을 한 곳을 통해서 불러들이게끔 하기 위해서 custom Hook을 다음과 같이 작성합니다.

```js
import { counter } from './stores/counter';

const useStore = () => {
  return { counter };
};

export default useStore;
```

<br/>

### `edit`: src/App.js <a id="a8"></a>

앞으로 만들어진 `Counter` 컴포넌트를 추가하도록 하겠습니다.

```jsx
import React from 'react';
import Counter from './components/Counter';

function App() {
  return (
    <div className="App">
      <Counter />
    </div>
  );
}

export default App;
```

<br/>

### `new`: src/components/Counter.jsx <a id="a9"></a>

게속해서 컴포넌트가 많아질 것입니다. 따라서 `components` 폴더를 생성하고 안에 `Counter.jsx`파일을 생성합니다.

기존 `class`에서는 `@`나 `decorate`를 이용하고서 `observer`로 컴포넌트를 감싸주는 방식을 이용했었습니다.

`mobx`가 6.xxx 버전 이상으로 올라오게 됨에 따라 Hook관련 기능이 추가되었습니다. (그 전에는 mobx-react-lite 를 이용)

사용방법은 정말 간단합니다. 

그냥 `return` 할 때 `useObserver`를 반환하고 실제 JSX코드는 콜백으로 넣어주시면 됩니다.

```jsx
import React from 'react';
import { useObserver } from 'mobx-react';
import useStore from '../useStore';

const Counter = () => {
  const { counter } = useStore();

  const increase = () => {
    counter.increase();
  };

  const decrease = () => {
    counter.decrease();
  };

  return useObserver(() => (
    <div>
      <h1>{counter.number}</h1>
      <button onClick={increase}>+1</button>
      <button onClick={decrease}>-1</button>
    </div>
  ));
};

export default Counter;
```

<br/>

## 슈퍼마켓 UI 구현하기 <a id="a10"></a>

우선 기능을 구현하기 전에, 컴포넌트들의 유저인터페이스부터 만들어주겠습니다!

UI 부분은 velopert님과 거의 동일합니다. 더 정확한 소스를 보고 싶으시면 [velopert.log](https://velog.io/@velopert/MobX-3-심화적인-사용-및-최적화-방법-tnjltay61n)를 참고해주세요. 아래의 코드는 전부 벨로퍼트님의 코드를 그대로 가져와서 작성한 것입니다.

<br/>

### `new`: src/components/SuperMarketTemplate.jsx<a id="a11"></a>

```jsx
import React from 'react';
import './SuperMarketTemplate.css';

const SuperMarketTemplate = ({ items, basket }) => {
  return (
    <div className="SuperMarketTemplate">
      <div className="items-wrapper">
        <h2>상품</h2>
        {items}
      </div>
      <div className="basket-wrapper">
        <h2>장바구니</h2>
        {basket}
      </div>
    </div>
  );
};

export default SuperMarketTemplate;

```

```css
/* src/components/SuperMarketTemplate.css */
.SuperMarketTemplate {
  width: 768px;
  display: flex;
  border: 1px solid black;
  margin-left: auto;
  margin-right: auto;
  margin-top: 3rem;
}

.SuperMarketTemplate h2 {
  margin-top: 0;
}

.SuperMarketTemplate>div {
  padding: 1rem;
  flex: 1;
}

.SuperMarketTemplate .items-wrapper {
  background: #f8f9fa;
}

```

SuperMarketTemplate 는 그냥 템플릿 형태의 컴포넌트로서 한쪽에는 상품을, 한쪽에는 장바구니를 props 로 받아와서 보여줍니다.

<br/>

### `new`: src/components/SuperMarket.jsx<a id="a12"></a>

```jsx
import React from 'react';
import SuperMarketTemplate from './SuperMarketTemplate';


const SuperMarket = () => {
  return <SuperMarketTemplate items={null} basket={null} />;
};

export default SuperMarket;

```

SuperMarket 컴포넌트는 SuperMarketTemplate 안에, 나중에 우리가 만들 Basket 과 ShopItemList 를 전달해서 보여줄 것입니다. 지금은 아직 안만들었으니 null 만 넣어주세요.

그리고나서, SuperMarket 를 App 에서 보여주겠습니다.

<br/>

### `edit`: src/App.js<a id="a13"></a>

```jsx
import React, { Component } from 'react';
import Counter from './components/Counter';
import SuperMarket from './components/SuperMarket';

class App extends Component {
  render() {
    return (
      <div>
        <Counter />
        <hr />
        <SuperMarket />
      </div>
    );
  }
}

export default App;

```

![step02](https://user-images.githubusercontent.com/31315644/79086168-1929bc80-7d76-11ea-9cfc-c96ed8c8b432.jpg)

<br/>

**좌측 상품 구현**

### `new`: src/components/ShopItem.js<a id="a14"></a>

```jsx
import React from 'react';
import './ShopItem.css';

const ShopItem = ({ name, price }) => {
  return (
    <div className="ShopItem">
      <h4>{name}</h4>
      <div>{price}원</div>
    </div>
  );
};

export default ShopItem;

```

```css
/* src/components/ShopItem.css */
.ShopItem {
  background: white;
  border: 1px solid #495057;
  padding: 0.5rem;
  border-radius: 2px;
  cursor: pointer;
}

.ShopItem h4 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.ShopItem:hover {
  background: #495057;
  color: white;
}

.ShopItem+.ShopItem {
  margin-top: 1rem;
}

```

<br/>

### `new`: src/components/ShopItemList.jsx <a id="a15"></a>

```jsx
import React from 'react';
import ShopItem from './ShopItem';

const items = [
  {
    name: '생수',
    price: 850,
  },
  {
    name: '신라면',
    price: 900,
  },
  {
    name: '포카칩',
    price: 1500,
  },
  {
    name: '새우깡',
    price: 1000,
  },
];

const ShopItemList = () => {
  const itemList = items.map(item => <ShopItem {...item} key={item.name} />);
  return <div>{itemList}</div>;
};

export default ShopItemList;

```

이렇게 만들어 주고 나서, ShopItemList 를 SuperMarket 에서 보여주겠습니다.

<br/>

### `edit`: src/components/SuperMarket.js <a id="a16"></a>

```jsx
import React from 'react';
import SuperMarketTemplate from './SuperMarketTemplate';
import ShopItemList from './ShopItemList';
import Basket from './BasketItemList';

const SuperMarket = () => {
  return <SuperMarketTemplate items={<ShopItemList />} basket={null} />;
};

export default SuperMarket;

```

![step03](https://user-images.githubusercontent.com/31315644/79086384-cdc3de00-7d76-11ea-9855-8730529955c2.jpg)

이제 우측의 장바구니도 구현해주겠습니다.

<br/>

### `new`: src/components/BasketItem.jsx <a id="a17"></a>

```jsx
import React from 'react';
import './BasketItem.css';

const BasketItem = ({ name, price, count }) => {
  return (
    <div className="BasketItem">
      <div className="name">{name}</div>
      <div className="price">{price}원</div>
      <div className="count">{count}</div>
      <div className="return">갖다놓기</div>
    </div>
  );
};

export default BasketItem;

```

```css
/* src/components/BasketItem.css */
.BasketItem {
  display: flex;
  width: 100%;
}

.BasketItem .name {
  flex: 2;
}

.BasketItem .price {
  flex: 1;
}

.BasketItem .count {
  flex: 1;
}

.BasketItem .return {
  margin-left: auto;
  color: #f06595;
  cursor: pointer;
}

.BasketItem .return:hover {
  text-decoration: underline;
}

.BasketItem+.BasketItem {
  margin-top: 1rem;
}

```

<br/>

### `new`: src/components/BasketItemList.js <a id="a18"></a>

```jsx
import React from 'react';
import BasketItem from './BasketItem';

const BasketItemList = () => {
  return (
    <div>
      <BasketItem name="포카칩" price={1500} count={2} />
      <BasketItem name="생수" price={850} count={1} />
      <hr />
      <p>
        <b>총합: </b> 3850원
      </p>
    </div>
  );
};

export default BasketItemList;

```

지금은, BasketItemList 에서 실제 데이터를 사용하지 않고, 하드코딩하여 가짜 데이터를 보여주었습니다.

다 만드셨다면 이 컴포넌트도 SuperMarket 에서 basket props 로 전달해주세요.

<br/>

### `edit`: src/components/SuperMarket.js <a id="a19"></a>

```jsx
import React from 'react';
import SuperMarketTemplate from './SuperMarketTemplate';
import ShopItemList from './ShopItemList';
import BasketItemList from './BasketItemList';

const SuperMarket = () => {
  return (
    <SuperMarketTemplate items={<ShopItemList />} basket={<BasketItemList />} />
  );
};

export default SuperMarket;

```

여기까지 하고 나면, 다음과같은 UI 가 나타날것입니다

![step04](https://user-images.githubusercontent.com/31315644/79086541-68242180-7d77-11ea-8da2-08d0156b30aa.jpg)

<br/>

##슈퍼마켓 스토어 구현하기  <a id="a20"></a>

`store` 구현부터는 `Hooks`형태로 market 스토어를 만들겠습니다.

참고로, Hooks를 이용할 때에도 Provider 와 같은 Context를 이용할 수 있습니다.

하지만, 저는 이용하지 않겠습니다. Context를 설정을 하게되면 소스량과 복잡도가 증가하는 것을 확인했습니다.

Context를 사용하지 않아도 충분히 Store를 사용할수 있기 때문에 사용을 안하도록 하겠습니다.

<br/>

### `new`: src/stores/market.js <a id="a21"></a>

```js
import { observable } from 'mobx';

const market = observable({
  selectedItems: [],
  put(name, price) {
    const exists = this.selectedItems.find((item) => item.name === name);
    if (!exists) {
      this.selectedItems.push({
        name,
        price,
        count: 1,
      });
      return;
    }
    exists.count++;
  },
  take(name) {
    const itemToTake = this.selectedItems.find((item) => item.name === name);
    itemToTake.count--;
    if (itemToTake.count === 0) {
      // 갯수가 0 이면
      this.selectedItems.remove(itemToTake); // 배열에서 제거처리합니다.
    }
  },
  get total() {
    console.log('총합 계산...');
    return this.selectedItems.reduce((previous, current) => {
      return previous + current.price * current.count;
    }, 0);
  },
});

export { market };

```

<br/>

### `edit`: src/useStore.js<a id="a22"></a>

Counter를 작성하면서 만들어둔 커스텀훅`useStore`에 방금 만든 스토어인 `market`을 추가합니다.

```js
import { counter } from './stores/counter';
import { market } from './stores/market';

const useStore = () => {
  return { counter, market };
};

export default useStore;

```

<br/>

## 기능 구현하기 - 아이템 추가 <a id="a23"></a>

아이템을 추가하는 기능부터 구현하겠습니다!

### `edit`: src/components/ShopItemList.js <a id="a24"></a>

```jsx
import React from 'react';
import ShopItem from './ShopItem';
// **** useStore import
import useStore from '../useStore';

const items = [
  {
    name: '생수',
    price: 850,
  },
  {
    name: '신라면',
    price: 900,
  },
  {
    name: '포카칩',
    price: 1500,
  },
  {
    name: '새우깡',
    price: 1000,
  },
];

const ShopItemList = () => {
  // **** useStore에서 market 연결
  const { market } = useStore();

  const onPut = (name, price) => {
    market.put(name, price);
  };
  
	// **** onPut 함수 추가됨
  return useObserver(() => {
    const itemList = items.map((item) => <ShopItem {...item} key={item.name} onPut={onPut} />);
    return <div>{itemList}</div>;
  });
};

export default ShopItemList;

```

기존 코드에서는 inject, observer를 사용했는데 Hook를 이용할 것이기 때문에 제거해주었습니다.

이제, ShopItem 에서. 클릭시 onPut 에 현재 자신의 name과 price 를 넣어서 호출하도록 설정을 해주겠습니다.

<br/>

### `edit`: src/components/ShopItem.js  <a id="a25"></a>

```jsx
import React from 'react';
import './ShopItem.css';

const ShopItem = ({ name, price, onPut }) => {
  return (
    <div className="ShopItem" onClick={() => onPut(name, price)}>
      <h4>{name}</h4>
      <div>{price}</div>
    </div>
  );
};

export default ShopItem;

```

<br/>

## 기능 구현하기 - 장바구니에 데이터 반영  <a id="a26"></a>

먼저 BasketItemList 부터 구현해보겠습니다.

<br/>

### `edit`: src/components/BasketItemList.js  <a id="a27"></a>

```jsx
import React from 'react';
import BasketItem from './BasketItem';
import { useObserver } from 'mobx-react';
import useStore from '../useStore';

const BasketItemList = () => {
  const { market } = useStore();

  const onTake = (name) => {
    market.take(name);
  };

  return useObserver(() => {
    const itemList = market.selectedItems.map((item) => (
      <BasketItem
        name={item.name}
        price={item.price}
        count={item.count}
        key={item.name}
        onTake={onTake}
      />
    ));
    return (
      <div>
        {itemList}
        <hr />
        <p>
          <b>총합: </b> {market.total}원
        </p>
      </div>
    );
  });
};
export default BasketItemList;

```

그리고 그 내부의 BasketItem 를 구현해줍니다.여기서 주의하실 점은 리스트를 렌더링하시게 될 때에 내부에 있는 컴포넌트에도 useObserver 를 구현해주어야, 성능적으로 최적화가 일어난다는 점 입니다.

<br/>

### `edit`: src/components/BasketItem.js   <a id="a28"></a>

```jsx
import React from 'react';
import './BasketItem.css';
import { useObserver } from 'mobx-react';

const BasketItem = ({ name, price, count, onTake }) => {
  return useObserver(() => (
    <div className="BasketItem">
      <div className="name">{name}</div>
      <div className="price">{price}원</div>
      <div className="count">{count}</div>
      <div className="return" onClick={() => onTake(name)}>
        갖다놓기
      </div>
    </div>
  ));
};

export default BasketItem;

```

![step05](https://user-images.githubusercontent.com/31315644/79087820-88ee7600-7d7b-11ea-8008-559a80a89d86.jpg)

<br/>

## 스토어 끼리 관계형성   <a id="a29"></a>

지금은 counter 와 market 이 전혀 관계가 없기 때문에 서로간의 접근은 불필요 한 상황이지만, 만약에 해야한다면 어떻게 해야하는지 알아봅시다.

기존 코드에서는 Store끼리의 접근을 하기 위해서 RootStore 를 생성하고 클래스 내에 생성자 cunstrutor 를 만든 후 Provider를 통해 조회를 해야했었습니다. Hooks에서도 이와같은 방법을 이용할 수 있겠지만 저는 Provider를 사용하지 않기로 했기 때문에 간단하게 구현을 해보도록 하겠습니다.

우선, 구현하고자하는 방향을 생각해봅니다.

1. 스토어끼리의 데이터 접근 
2. 현재 예제에서는 market에서 counter의 number가 필요한 상황

그렇습니다. 현재 필요한 것은 counter의 number 이기 때문에 market이라는 스토어에서 counter의 number만 가지고오면 해결됩니다.

### `edit`: src/stores/market.js - put 액션  <a id="a30"></a>

```jsx
import { observable } from 'mobx';
// **** import counter 연결
import { counter } from './counter';

const market = observable({
  ...
  put(name, price) {
    const exists = this.selectedItems.find((item) => item.name === name);
    if (!exists) {
      this.selectedItems.push({
        name,
        price,
        // **** counter.number를 사용
        count: counter.number,
      });
      return;
    }
		// **** counter.number만큼 증가
    exists.count += counter.number;
  },
  ...

export { market };

```

이렇게 하면, 예를들어 카운터의 값이 2면, 한번 상품이 클릭 될 때마다 두개씩 받아옵니다.

<br/>

## MobX 의 리액트 컴포넌트 최적화  <a id="a31"></a>

mobx-react 를 사용하게 될 때, 성능이 망가지지 않으려면 [지켜줘야 하는 몇가지 규칙](https://mobx.js.org/best/react-performance.html) 이 있는데 이에 대해서 알아보겠습니다.

<br/>

### 규칙  <a id="a32"></a>

1. 리스트를 렌더링 할 땐, 컴포넌트에 리스트 관련 데이터만 props 로 넣자
2. 세부참조 (dereference)는 최대한 늦게하자
3. 함수는 미리 바인딩하고, 파라미터는 내부에서 넣어주기 ( -이미 개선완료- )

<br/>

### 리스트를 렌더링 할 땐, 컴포넌트에 리스트 관련 데이터만 props 로 넣기  <a id="a33"></a>

기존 코드에서는 total 값을 리스트에서 props 로 받아오게 했습니다.

#### `new`: src/components/TotalPrice.js   <a id="a34"></a>

```jsx
import React from 'react';
import { useObserver } from 'mobx-react';
import useStore from '../useStore';

const TotalPrice = () => {
  const { market } = useStore();
  return useObserver(() => (
    <div>
      <hr />
      <p>
        <b>총합: </b> {market.total}원
      </p>
    </div>
  ));
};

export default TotalPrice;

```

그리고 이 컴포넌트를 SuperMarketTemplate 의 total 이라는 값으로 JSX 형태로 전달해주겠습니다.

<br/>

#### `edit`: src/components/SuperMarket.js   <a id="a35"></a>

```jsx
import React from 'react';
import SuperMarketTemplate from './SuperMarketTemplate';
import ShopItemList from './ShopItemList';
import BasketItemList from './BasketItemList';
import TotalPrice from './TotalPrice';

const SuperMarket = () => {
  return (
    <SuperMarketTemplate
      items={<ShopItemList />}
      basket={<BasketItemList />}
      total={<TotalPrice />}
    />
  );
};

export default SuperMarket;

```

<br/>

#### `edit`: src/components/SuperMarketTemplate.js   <a id="a36"></a>

```jsx
import React from 'react';
import './SuperMarketTemplate.css';

const SuperMarketTemplate = ({ items, basket, total }) => {
  return (
    <div className="SuperMarketTemplate">
      <div className="items-wrapper">
        <h2>상품</h2>
        {items}
      </div>
      <div className="basket-wrapper">
        <h2>장바구니</h2>
        {basket}
        {total}
      </div>
    </div>
  );
};

export default SuperMarketTemplate;

```

그 다음, BracketItemList 에서 props 로 받아오던 total 은 없애고, 세부 참조를 BracketItem 내부에서 하도록 수정해주겠습니다.

<br/>

### 세부참조 (dereference)는 최대한 늦게하자  <a id="a37"></a>

#### `edit`: src/components/BracketItemList.js   <a id="a38"></a>

```jsx
import React from 'react';
import BasketItem from './BasketItem';
import { useObserver } from 'mobx-react';
import useStore from '../useStore';

const BasketItemList = () => {
  const { market } = useStore();

  const onTake = (name) => {
    market.take(name);
  };

  return useObserver(() => {
    const itemList = market.selectedItems.map((item) => (
			// **** props수정
      <BasketItem item={item} key={item.name} onTake={onTake} />
    ));
   	// **** total 관련 코드 제거
    return <div>{itemList}</div>;
  });
};
export default BasketItemList;


```

<br/>

#### `edit`: src/components/BracketItem.js   <a id="a39"></a>

```jsx
import React from 'react';
import './BasketItem.css';
import { useObserver } from 'mobx-react';

// **** 세부참조가 아닌 item자체를 들고옴
const BasketItem = ({ item, onTake }) => {
  return useObserver(() => (
    <div className="BasketItem">
      <div className="name">{item.name}</div>
      <div className="price">{item.price}원</div>
      <div className="count">{item.count}</div>
      <div className="return" onClick={() => onTake(item.name)}>
        갖다놓기
      </div>
    </div>
  ));
};

export default BasketItem;

```

이렇게 하면 최적화가 끝납니다!

<br/>

### 완성  <a id="a40"></a>

![step06](https://user-images.githubusercontent.com/31315644/79088920-24351a80-7d7f-11ea-97f2-5a63ac55bf16.jpg)

<br/>

## 추가 : Context를 이용하는 방법 <a id="a43"></a>

만약에 그래도 Context를 이용하고 싶다! 라고 생각이 드신다면 다음과 같이 수정을 하시면 됩니다.

- `edit`: src/index.jsx
- `edit`: src/useStore.jsx
- `new`: src/Context.jsx

### `edit`: src/index.jsx <a id="a44"></a>

Context를 사용하기 위해서 프로바이더를 추가합니다.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { StoreProvider } from './Context';

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById('root'),
);

```

<br/>

### `edit`: src/useStore.jsx <a id="a45"></a>

useStore에서 Context를 이용합니다. store가 비워있을 경우 분기 처리를 해줍니다.

```jsx
import React from 'react';
import { storeContext } from './Context';

function useStore() 
  //  주석
	//  return { counter, market, getApi };
  
	// Context 이용시
	const store = React.useContext(storeContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return store;
}

export default useStore;

```

<br/>

### `new`: src/Context.jsx <a id="a46"></a>

마지막으로 Context를 만들고 value값으로 넘길 값들을 `useLocalStore`를 이용하여 한 곳에 모아서 넘겨줍니다.

```jsx
import React, { createContext } from 'react';
import { counter } from './stores/counter';
import { market } from './stores/market';
import { useLocalStore } from 'mobx-react';

export const storeContext = createContext({});

export const StoreProvider = ({ children }) => {
  const value = useLocalStore(() => ({
    counter,
    market,
  }));
  return <storeContext.Provider value={value}>{children}</storeContext.Provider>;
};

export default StoreProvider;

```

<br/>

## 느낀점 <a id="a41"></a>

  2019년 대에 넘어오면서 Hooks가 나왔고 React 측에서도 class관련 업데이트를 중단한건 아니지만 Hooks에 힘을 더 주고 있기 때문에 velopert님이 기존에 작성하신 Mobx 코드를 Hooks로 변경해보았습니다. Hooks를 사용하니 생각보다 간편했지만, 레퍼런스가 너무 없어서 거의 3~4일은 해메고 게속 수정하고를 반복했습니다. 저는 주니어 개발자고 이게 맞는 방법인지 좋은 패턴인지 알 길이 없는데 더군다나 Hooks 관련 레퍼런스는 없고 대부분의 코드 조차 class 형태로 작성되어있어 코드를 구분하고 변경하며 보기가 너무 힘들었습니다. 저는 아직까지도 틀과 체계가 확실히 잡혀있는 redux를 더 좋아합니다. mobx도 이런 부분에서 mst가 따로 있다고는 들었습니다만, 우선 mobx의 매력을 알아보고자 했습니다. mobx는 낮은 러닝커브 와 사용자가 불변성을 지키지 않아도 상태를 유지해주는 흑마법 같은 점이 가장 큰 장점이라고 생각됩니다. 저는 주니어고 앞으로 시니어가 되기 위해 여러가지를 공부하고 학습할 것입니다. 이번 예제는 redux말고도 또 다른 상태관련 라이브러리를 다뤄보는 좋은 경험이 되었습니다. 왜 러닝커브가 더 낮은지, 왜 흑 마법이라 부른지도 쉽게 깨달을수 있었습니다. 😅😅😅

------------------

## Reference  <a id="a42"></a>

- [velopert.log : MobX (2) 시작하기](https://velog.io/@velopert/MobX-2-리액트-프로젝트에서-MobX-사용하기-oejltas52z)
- [velopert.log : MobX (3) 심화적인 사용 및 최적화 방법](https://velog.io/@velopert/MobX-3-심화적인-사용-및-최적화-방법-tnjltay61n)
- [Migration guide](https://mobx-react.js.org/recipes-migration)
- [Using MobX with React Hooks and TypeScript](https://blog.mselee.com/posts/2019/06/08/using-mobx-with-react-hooks-typescript/)
- [ZeroCho : redux-vs-mobx](https://www.inflearn.com/course/redux-mobx-상태관리-도구)