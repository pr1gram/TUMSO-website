import Router from "next/router"
import { useEffect } from "react"

import { useFirebaseAuth } from "@/contexts/firebaseAuth"

export const useAdminRedirect = () => {
  const { user } = useFirebaseAuth()

  useEffect(() => {
    if (user.uid) {
      if (
        user.uid === "Di08jZL2aTOt31AUjX34FGZyIjv1" ||
        user.uid === "y8zkDnTgDddHLxGbzOKyFYEIs5H3"
      ) {
        Router.push("/register/admin")
      }
    }
  }, [user.uid])
}
