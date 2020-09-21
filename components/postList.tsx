import React from 'react'
import { useRouter } from 'next/router'
import { useQuery, gql } from '@apollo/client'
import Link from "next/link";

const GET_POSTS_QUERY = gql`
  query GetSubRedditPosts($slug: String!) {
    posts(slug: $slug) {
      id,
      title,
      thumbnail,
      author,
      commentsNumber,
      permalink
    }
  }
`

export function PostList() {
  const router = useRouter()
  const { slug } = router.query
  console.log(slug)

  const { loading, error, data } = useQuery(GET_POSTS_QUERY, { variables: { slug }})
  console.log(data)

  return (
    <>
      {data && data.posts.map(post => {
        const splits = post.permalink.split('/')
        const postSlug = splits[splits.length - 2]
        console.log('split: ', splits, postSlug)
        return (
          <Link href={`/subreddits/${slug}/posts/${post.id}/${postSlug}`}>
            <div>{post.title}</div>
          </Link>
        )
      })}
    </>
  )
}