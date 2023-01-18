import Router from "next/router"
import type { Dispatch } from "react"

import type { Fetcher } from "@/hooks/useFetcher"
import type { GetSubmitStatusType } from "@/types/firestore/UseFirestoreType"

export const checkSubmitStatusFactory = (
  getSubmitStatus: GetSubmitStatusType,
  setBypass: Dispatch<boolean>
): Fetcher => {
  return async () => {
    const submit = await getSubmitStatus()
    if (submit) {
      if (submit.status !== "editing") {
        setBypass(false)
        Router.push("/register/status")
      } else {
        setBypass(true)
      }
    } else {
      setBypass(false)
    }
  }
}
