import { useFetchUser } from '../lib/user'

export function withAuthentication(WrappedComponent) {
  const { user } = useFetchUser({ required: true })
  return user ? <WrappedComponent/> : null
}