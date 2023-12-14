import { useEffect } from "react"

import { useFirebaseAuth } from "@/contexts/firebaseAuth"

export type Fetcher = () => Promise<void> | void

export const useFetcher = (
  fetcher: Fetcher,
  awareLogged: boolean = false,
  notLoggedAction?: () => void
) => {
  const { user } = useFirebaseAuth()
  useEffect(() => {
    if (!awareLogged) {
      fetcher()
      return
    }

    if (user.isLoggedIn()) {
      fetcher()
    } else if (notLoggedAction) {
      notLoggedAction()
    }
  }, [user])
}
