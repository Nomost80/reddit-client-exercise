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

  async getSubRedditNewPosts(slug: string) {
    return this.get(`/r/${slug}/new`, { limit: 100 })
  }

  async getPostDetail(subRedditSlug: string, postSlug: string) {
    return this.get(`/r/${subRedditSlug}/comments/${postSlug}`, { limit: 3 })
  }
}