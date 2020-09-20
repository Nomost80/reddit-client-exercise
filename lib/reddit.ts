import { RESTDataSource } from "apollo-datasource-rest"

export class RedditAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://oauth.reddit.com'
  }

  async willSendRequest(request) {
    request.headers.set('Authorization', this.context.redditAuthorizationHeader)
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