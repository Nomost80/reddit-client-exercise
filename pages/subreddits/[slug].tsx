import React from 'react'
import { ApolloProvider } from '@apollo/client'
import ApolloClient from '../../lib/apolloClient'
import { useFetchUser } from "../../lib/user"
import { Layout } from '../../components/layout'
import { PostList } from "../../components/postList"

export default function SubRedditDetail() {
  const { user, loading } = useFetchUser({ required: true })

  return (
    <ApolloProvider client={ApolloClient}>
      <Layout user={user} loading={loading}>
        <PostList />
      </Layout>
    </ApolloProvider>
  )
}