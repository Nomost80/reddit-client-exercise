import knex from "knex"
import { ApolloServer, gql } from "apollo-server-micro"
import NodeCache from 'node-cache'
import axios from 'axios'
import qs from 'qs'
import { RedditAPI } from '../../lib/reddit'
import auth0 from '../../lib/auth0'

const { NODE_ENV, PG_CONNECTION_STRING, REDDIT_AUTH_HEADER } = process.env

const cache = new NodeCache({ stdTTL: 60 })

const db = knex({
  client: "pg",
  connection: PG_CONNECTION_STRING
})

const typeDefs = gql`
  type SubReddit {
    id: ID!
    slug: String!
    url: String!
    title: String!
    icon: String
    description: String!
    subscribers: Int!
    bookmarked: Boolean!
  }
  type Post {
    id: ID!
    title: String!
    thumbnail: String!
    author: String!
    commentsNumber: Int!
    permalink: String!
  }
  type Comment {
    id: ID!
    ups: Int!
    downs: Int!
    replies: [Comment]
    author: String!
    body: String!
    created: String!
  }
  type Query {
    subReddits(title: String!): [SubReddit]
    posts(slug: String!): [Post]
    comments(subRedditSlug: String!, postSlug: String!): [Comment]
    bookmarkedSubReddits: [SubReddit]
  }
  type Mutation {
    bookmarkSubReddit(id: String!): Boolean
    unbookmarkSubReddit(id: String!): Boolean
  }
`

const mapSubReddit = subReddit => ({
  id: subReddit.name,
  slug: subReddit.display_name,
  url: subReddit.url,
  title: subReddit.title,
  icon: subReddit.icon_img,
  description: subReddit.public_description,
  subscribers: subReddit.subscribers
})

const resolvers = {
  Query: {
    subReddits: async (root, { title }, { dataSources, user }) => {
      const userId = user.name
      const [redditResponse, bookmarkedSrsFields] = await Promise.all([
        dataSources.redditAPI.searchSubReddits(title),
        db('bookmarks').where({ user_id: userId }).select('sr_id')
      ])
      const bookmarkedSrs = bookmarkedSrsFields.map(srFields => srFields.sr_id)
      return redditResponse.data.children.map(({ data: subReddit }) => ({
        ...mapSubReddit(subReddit),
        bookmarked: bookmarkedSrs.includes(subReddit.name)
      }))
    },
    posts: async (root, { slug }, { dataSources }) => {
      const response = await dataSources.redditAPI.getSubRedditNewPosts(slug)
      return response.data.children.map(({ data: post }) => ({
        id: post.id,
        title: post.title,
        thumbnail: post.thumbnail,
        author: post.author,
        permalink: post.permalink,
        commentsNumber: post.num_comments
      }))
    },
    comments: async (root,  { subRedditSlug, postSlug }, { dataSources }) => {
      const response = await dataSources.redditAPI.getPostDetail(subRedditSlug, postSlug)
      const commentListing = response.find(({ data }) => data.children.length && data.children[0].kind === 't1')
      return commentListing ?
        commentListing.data.children
          .filter(({ data }) => data.body )
          .map(({ data: comment }) => ({
            id: comment.id,
            ups: comment.ups,
            downs: comment.downs,
            author: comment.author,
            body: comment.body,
            replies: [],
            created: comment.created_utc
          }))
        : []
    },
    bookmarkedSubReddits: async (root, args, { dataSources, user }) => {
      const userId = user.name
      const bookmarkedIds = await db('bookmarks').where({ user_id: userId }).select('sr_id')
      const response = await dataSources.redditAPI.getItemsInfo(bookmarkedIds.map(fields => fields.sr_id))
      return response.data.children.map(({ data: subReddit }) => ({
        ...mapSubReddit(subReddit),
        bookmarked: true
      }))
    }
  },
  Mutation: {
    bookmarkSubReddit: async (root, { id }, { user }) => {
      const userId = user.name
      const result = await db('bookmarks').insert({ user_id: userId, sr_id: id }, ['id'])
      return result.length
    },
    unbookmarkSubReddit: async (root, { id }, { user }) => {
      const userId = user.name
      const result = await db('bookmarks').where({ user_id: userId, sr_id: id }).del()
      return !!result
    }
  }
}

const getRedditAuthHeader = async () => {
  let redditAuthorizationHeader = cache.get('reddit-auth-header')
  if (redditAuthorizationHeader) return redditAuthorizationHeader
  const headers = {
    authorization: REDDIT_AUTH_HEADER
  }
  const body = qs.stringify({
    grant_type: 'client_credentials',
    scope: 'read'
  })
  const { data } = await axios.post('https://www.reddit.com/api/v1/access_token', body, { headers })
  const { token_type, access_token, expires_in } = data
  redditAuthorizationHeader = `${token_type} ${access_token}`
  cache.set('reddit-auth-header', redditAuthorizationHeader, expires_in)
  return redditAuthorizationHeader
}

const context = async ({ req }) => {
  const redditAuthorizationHeader = await getRedditAuthHeader()
  const session = await auth0.getSession(req)
  if (!session || !session.user) {
    throw Error('You must be logged in')
  }
  return {
    redditAuthorizationHeader,
    user: session && session.user
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    redditAPI: new RedditAPI()
  }),
  context
})

const handler = server.createHandler({ path: "/api/graphql" })

export const config = {
  api: {
    bodyParser: false,
  }
}

export default handler