import React, { useState } from 'react'
import Link from 'next/link'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { useMutation, gql } from '@apollo/client'

const BOOKMAR_SR_MUTATION = gql`
  mutation BookmarkSubReddit($id: String!) {
    bookmarkSubReddit(id: $id)
  }
`

const UNBOOKMARK_SR_MUTATION = gql`
  mutation UnbookmarkSubReddit($id: String!) {
    unbookmarkSubReddit(id: $id)
  }
`

export function SubRedditItem({ id, slug, url, title, icon, description, subscribers, bookmarked }) {
  console.log(id, bookmarked)
  const [currentlyBookmarked, setBookmark] = useState(bookmarked)
  const setBookmarked = ({ bookmarkSubReddit }) => bookmarkSubReddit && setBookmark(true)
  const setUnbookmarked = ({ unbookmarkSubReddit }) => unbookmarkSubReddit && setBookmark(false)
  const [bookmarkSubReddit ] = useMutation(BOOKMAR_SR_MUTATION, { onCompleted: setBookmarked })
  const [unbookmarkSubReddit ] = useMutation(UNBOOKMARK_SR_MUTATION, { onCompleted: setUnbookmarked })

  const handleBookmarkClick = event => {
    if (currentlyBookmarked) {
      unbookmarkSubReddit({ variables: { id } })
    } else {
      bookmarkSubReddit({ variables: { id } })
    }
  }

  return (
    <Link href={`/subreddits/${slug}`}>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={icon} />
        </ListItemAvatar>
        <ListItemText primary={title} secondary={description} />
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={handleBookmarkClick}>
            {currentlyBookmarked ? <StarIcon/> : <StarBorderIcon/>}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </Link>
  )
}
