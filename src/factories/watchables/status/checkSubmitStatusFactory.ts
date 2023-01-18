import Router from "next/router"
import type { Dispatch } from "react"

import type { Watchable } from "@/hooks/useWatcher"
import type { SubmitStatus } from "@/types/firestore/SubmitStatus"
import type { GetSubmitStatusType } from "@/types/firestore/UseFirestoreType"

export const checkSubmitStatusWatchableFactory = (
  getSubmitStatus: GetSubmitStatusType,
  setSD: Dispatch<SubmitStatus>
): Watchable<boolean> => {
  return async () => {
    const sd = await getSubmitStatus()
    if (sd) {
      setSD(sd)
    } else {
      Router.push("/register")
    }
  }
}
