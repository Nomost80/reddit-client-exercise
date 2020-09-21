import Head from 'next/head'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Header from './header'

function Layout({ user, loading = false, children }) {
  return (
    <>
      <Head>
        <title>Reddit Client</title>
      </Head>

      <Header user={user} loading={loading} />

      <main>
        <CssBaseline />
        <Container maxWidth="sm">
          <Typography component="div">
            {children}
          </Typography>
        </Container>
      </main>
    </>
  )
}

export default Layout
