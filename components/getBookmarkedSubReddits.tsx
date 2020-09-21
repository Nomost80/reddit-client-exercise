import { useQuery, gql } from '@apollo/client'
import { SubRedditItem } from "./subRedditItem";

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

  return data ? data.bookmarkedSubReddits.map(sr => <SubRedditItem id={sr.id} {...sr} />) : null
}