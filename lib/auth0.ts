import { initAuth0 } from '@auth0/nextjs-auth0'

const {
  NEXT_PUBLIC_AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  NEXT_PUBLIC_AUTH0_SCOPE = 'openid profile',
  NEXT_PUBLIC_AUTH0_DOMAIN,
  NEXT_PUBLIC_REDIRECT_URI = 'http://localhost:3000/api/callback',
  NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI = 'http://localhost:3000/',
  SESSION_COOKIE_SECRET,
  SESSION_COOKIE_LIFETIME = 7200
} = process.env

export default initAuth0({
  clientId: NEXT_PUBLIC_AUTH0_CLIENT_ID,
  clientSecret: AUTH0_CLIENT_SECRET,
  scope: NEXT_PUBLIC_AUTH0_SCOPE,
  domain: NEXT_PUBLIC_AUTH0_DOMAIN,
  redirectUri: NEXT_PUBLIC_REDIRECT_URI,
  postLogoutRedirectUri: NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI,
  session: {
    cookieSecret: SESSION_COOKIE_SECRET,
    cookieLifetime: Number(SESSION_COOKIE_LIFETIME),
  },
})
