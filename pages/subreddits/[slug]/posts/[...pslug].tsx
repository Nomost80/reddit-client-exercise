import React from 'react'
import { ApolloProvider } from '@apollo/client'
import ApolloClient from '../../../../lib/apolloClient'
import { useFetchUser } from "../../../../lib/user"
import { Layout } from '../../../../components/layout'
import { PostItem } from "../../../../components/postItem"

export default function Post() {
  const { user, loading } = useFetchUser({ required: true })

  return (
    <ApolloProvider client={ApolloClient}>
      <Layout user={user} loading={loading}>
        <PostItem />
      </Layout>
    </ApolloProvider>
  )
}