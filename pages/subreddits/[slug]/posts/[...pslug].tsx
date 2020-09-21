import React from 'react'
import { ApolloProvider } from '@apollo/client'
import ApolloClient from '../../../../lib/apolloClient'
import { PostItem } from "../../../../components/postItem";

export default function Post() {
  return (
    <ApolloProvider client={ApolloClient}>
      <PostItem />
    </ApolloProvider>
  )
}