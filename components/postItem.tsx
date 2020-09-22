import React from 'react'
import { useRouter } from 'next/router'
import { useQuery, gql } from '@apollo/client'
import List from '@material-ui/core/List'
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";

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
  const router = useRouter()
  const { slug, pslug } = router.query
  const variables = { subRedditSlug: slug, postSlug: pslug.join('/') }
  const { loading, error, data } = useQuery(GET_COMMENTS_QUERY, { variables })
  return (
    <List>
      {data && data.comments.map(comment => (
        <ListItem key={comment.id}>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText primary={`posted by ${comment.author} at ${comment.created}`} secondary={comment.body} />
        </ListItem>
      ))}
    </List>
  )
}