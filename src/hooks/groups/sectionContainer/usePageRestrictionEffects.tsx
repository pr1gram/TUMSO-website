import { useEffect } from "react"

import { useFirebaseAuth } from "@/contexts/firebaseAuth"
import { useRegister } from "@/contexts/RegisterContext"
import { useTimer } from "@/hooks/useTimer"

export const usePageRestrictionEffects = (
  query: any,
  byPass: boolean | undefined
) => {
  const { user } = useFirebaseAuth()
  const { section } = useRegister()
  const { isClosed } = useTimer()
  useEffect(() => {
    if (!user.isLoggedIn()) {
      section.set("landing")
    } else if (Object.hasOwn(query, "filling")) {
      if (section.is("landing")) {
        if (isClosed(byPass)) return
        section.set("student")
      }
    }
  }, [user.isLoggedIn(), section])

  useEffect(() => {
    const closed = isClosed(byPass)
    if (!section.is("landing")) {
      if (closed) {
        section.set("landing")
      }
    }
  }, [section])
}
