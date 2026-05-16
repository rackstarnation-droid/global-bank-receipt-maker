import { useEffect, useState } from 'react'
import { blink } from '../blink/client'
import type { User } from '@blinkdotnew/sdk'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (!state.isLoading) setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { user, isLoading, isAuthenticated: !!user }
}
