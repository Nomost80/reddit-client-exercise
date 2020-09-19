import { RESTDataSource } from "apollo-datasource-rest"
import qs from 'qs'

const { REDDIT_AUTH_HEADER } = process.env

export class RedditAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://oauth.reddit.com'
  }

  async willSendRequest(request) {
    request.headers.set('Authorization', REDDIT_AUTH_HEADER)
  }

  async searchSubReddits(query: string) {
    return this.get('/api/subreddit_autocomplete_v2', { query, limit: 10 })
  }

  async getSubRedditNewPosts(subRedditUrl: string) {
    return this.get(`${subRedditUrl}/new`, { limit: 100 })
  }

  async getPostComments(permalink: string) {
    return this.get(permalink, { limit: 3 })
  }
}