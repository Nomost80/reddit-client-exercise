import { ApolloProvider } from '@apollo/client'
import ApolloClient from '../lib/apolloClient'
import Layout from '../components/layout'
import { useFetchUser } from '../lib/user'
import { SearchSubReddits } from '../components/searchSubReddits'

function Home() {
  const { user, loading } = useFetchUser()

  return (
    <ApolloProvider client={ApolloClient}>
      <Layout user={user} loading={loading}>
        <h1>Reddit Client Exercise</h1>

        {loading && <p>Loading login info...</p>}

        {user && (
          <>
            <SearchSubReddits/>
          </>
        )}
      </Layout>
    </ApolloProvider>
  )
}

export default Home
