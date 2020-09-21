import React from 'react'
import { useFetchUser } from '../lib/user'

export function WithAuthentication(WrappedComponent) {
  const { user } = useFetchUser({ required: true })
  return user ? <WrappedComponent/> : null
}