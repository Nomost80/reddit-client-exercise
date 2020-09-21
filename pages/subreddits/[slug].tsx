import React from 'react'
import { ApolloProvider } from '@apollo/client'
import ApolloClient from '../../lib/apolloClient'
import { PostList } from "../../components/postList";
import {useRouter} from "next/router";

export default function SubRedditDetail() {
  const router = useRouter()
  const { slug } = router.query
  console.log(slug)
  return (
    <ApolloProvider client={ApolloClient}>
      <PostList />
    </ApolloProvider>
  )
}