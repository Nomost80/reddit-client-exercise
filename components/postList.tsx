import React from 'react'
import { useRouter } from 'next/router'
import { useQuery, gql } from '@apollo/client'
import Link from "next/link"
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from "@material-ui/core/Avatar";

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

  const { loading, error, data } = useQuery(GET_POSTS_QUERY, { variables: { slug }})

  return (
    <List>
      {data && data.posts.map(post => {
        const splits = post.permalink.split('/')
        const postSlug = splits[splits.length - 2]
        return (
          <Link key={post.id} href={`/subreddits/${slug}/posts/${post.id}/${postSlug}`}>
            <ListItem style={{ cursor: 'pointer' }}>
              <ListItemAvatar>
                <Avatar src={post.thumbnail} />
              </ListItemAvatar>
              <ListItemText primary={post.title} secondary={`created by ${post.author}`} />
            </ListItem>
          </Link>
        )
      })}
    </List>
  )
}