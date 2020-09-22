import React, { useState } from 'react'
import { TextField, Button, List } from "@material-ui/core"
import SearchIcon from '@material-ui/icons/Search'
import { useLazyQuery, gql } from '@apollo/client'
import { SubRedditItem } from './subRedditItem'

const SEARCH_SUB_REDDITS_QUERY = gql`
  query SearchSubReddits($title: String!) {
    subReddits(title: $title) {
      id,
      slug
      url,
      title,
      icon,
      description,
      subscribers,
      bookmarked
    }
  }
`

export function SearchSubReddits() {
  const [title, setTitle] = useState('')
  const [searchSubReddits, { loading, data } ] = useLazyQuery(SEARCH_SUB_REDDITS_QUERY)

  const handleChange = event => {
    setTitle(event.target.value)
  }
  const handleClick = event => {
    searchSubReddits({ variables: { title }})
  }

  return (
    <>
      <form noValidate autoComplete="off">
        <TextField label="SubReddit title" value={title} onChange={handleChange} />
        <Button variant="contained" color="primary" startIcon={<SearchIcon />} onClick={handleClick}>
          Rechercher
        </Button>
      </form>
      <List>
        {data && data.subReddits.map(sr => <SubRedditItem key={sr.id} {...sr} />)}
      </List>
    </>
  )
}