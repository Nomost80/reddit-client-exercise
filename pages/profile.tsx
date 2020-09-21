import { ApolloProvider } from '@apollo/client'
import ApolloClient from '../lib/apolloClient'
import { useFetchUser } from '../lib/user'
import Layout from '../components/layout'
import { GetBookmarkedSubReddits } from "../components/getBookmarkedSubReddits";

function ProfileCard({ user }) {
  return (
    <>
      <h1>Profile</h1>

      <div>
        <img src={user.picture} alt="user picture" />
        <p>nickname: {user.nickname}</p>
        <p>name: {user.name}</p>
        <GetBookmarkedSubReddits />
      </div>
    </>
  )
}

function Profile() {
  const { user, loading } = useFetchUser({ required: true })

  return (
    <ApolloProvider client={ApolloClient}>
      <Layout user={user} loading={loading}>
        {loading ? <>Loading...</> : <ProfileCard user={user} />}
      </Layout>
    </ApolloProvider>
  )
}

export default Profile
