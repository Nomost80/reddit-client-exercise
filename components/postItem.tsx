import React from 'react'
import { useRouter } from 'next/router'
import { useQuery, gql } from '@apollo/client'

const GET_COMMENTS_QUERY = gql`
  query GetComments($subRedditSlug: String!, $postSlug: String!) {
    comments(subRedditSlug: $subRedditSlug, postSlug: $postSlug) {
      id,
      ups,
      downs,
      author,
      body,
      created
    }
  }
`

export function PostItem() {
  console.log('post item')
  const router = useRouter()
  const { slug, pslug } = router.query
  const variables = { subRedditSlug: slug, postSlug: pslug.join('/') }
  const { loading, error, data } = useQuery(GET_COMMENTS_QUERY, { variables })
  return (
    <div>{data && data.comments.map(comment => <div>{comment.body}</div>)}</div>
  )
}