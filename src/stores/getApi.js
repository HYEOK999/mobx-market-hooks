import { observable } from 'mobx';
import axios from 'axios';

const FEED_API_URL = 'https://dcode-code-test.s3.ap-northeast-2.amazonaws.com';

const getApi = observable({
  users: {},
  async getList() {
    const { data } = await axios.get(`${FEED_API_URL}/feed-list.json`);
    console.log(data);
    this.users = data.data;
  },
});

export { getApi };
