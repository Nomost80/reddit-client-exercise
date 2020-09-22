import { useQuery, gql } from '@apollo/client'
import { SubRedditItem } from "./subRedditItem"
import List from '@material-ui/core/List'

const GET_BOOKMARKED_SUB_REDDITS_QUERY = gql`
  query GetBookmarkedSubReddits {
    bookmarkedSubReddits {
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

export function GetBookmarkedSubReddits() {
  const { loading, error, data } = useQuery(GET_BOOKMARKED_SUB_REDDITS_QUERY)

  return data ? (
    <List>
      {data.bookmarkedSubReddits.map(sr => <SubRedditItem key={sr.id} {...sr} />)}
    </List>
  ) : null
}