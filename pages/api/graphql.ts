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
  type PostDetail {
    id: ID!
  }
  type Query {
    subReddits(title: String!): [SubReddit]
    posts(subRedditUrl: String!): [Post]
    postDetail(permalink: String!): [PostDetail]
  }
  type Mutation {
    bookmarkSubReddit(id: String!): Boolean
    unbookmarkSubReddit(id: String!): Boolean
  }
`

const resolvers = {
  Query: {
    subReddits: async (root, { title }, { dataSources, user }) => {
      const userId = user.name
      const response = await dataSources.redditAPI.searchSubReddits(title)
      const bookmarkedSrs = (await db('bookmarks').where({ user_id: userId }).select('sr_id')).map(srFields => srFields.sr_id)
      return response.data.children.map(({ data: subReddit }) => ({
        id: subReddit.id,
        url: subReddit.url,
        title: subReddit.title,
        icon: subReddit.icon_img,
        description: subReddit.public_description,
        subscribers: subReddit.subscribers,
        bookmarked: bookmarkedSrs.includes(subReddit.id)
      }))
    },
    posts: async (root, { subRedditUrl }, { dataSources }) => {
      const response = await dataSources.redditAPI.getSubRedditNewPosts(subRedditUrl)
      return response.data.children.map(({ data: post }) => ({
        id: post.id,
        title: post.title,
        thumbnail: post.thumbnail,
        author: post.author,
        permalink: post.permalink,
        commentsNumber: post.num_comments
      }))
    },
    postDetail: async (root,  { permalink }, { dataSources }) => {
      const response = await dataSources.redditAPI.getPostComments(permalink)
      return response.map(a => a)
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
  },
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
  if ((!session || !session.user) && NODE_ENV !== 'development') {
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