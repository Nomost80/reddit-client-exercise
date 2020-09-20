import knex from "knex"
import { ApolloServer, gql } from "apollo-server-micro"
import { RedditAPI } from '../../lib/reddit'
import auth0 from '../../lib/auth0'

const { NODE_ENV, PG_CONNECTION_STRING } = process.env

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
      console.log(bookmarkedSrs)
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

const context = async ({ req }) => {
  const session = await auth0.getSession(req)
  if ((!session || !session.user) && NODE_ENV !== 'development') {
    throw Error('You must be logged in')
  }
  return {
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