import axios from 'axios';

const FEED_API_URL = 'https://dcode-code-test.s3.ap-northeast-2.amazonaws.com';

// https://dcode-code-test.s3.ap-northeast-2.amazonaws.com/feed-list.json
// https://dcode-code-test.s3.ap-northeast-2.amazonaws.com/feed-detail.json
// https://dcode-code-test.s3.ap-northeast-2.amazonaws.com/feed-comments.json

export default class FeedService {
  static getList() {
    return axios.get(`${FEED_API_URL}/feed-list.json`);
  }

  static getDetail() {
    return axios.get(`${FEED_API_URL}/feed-detail.json`);
  }

  static getComments() {
    return axios.get(`${FEED_API_URL}/feed-comments.json`);
  }
}
