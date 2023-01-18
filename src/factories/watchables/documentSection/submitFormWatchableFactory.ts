import Router from "next/router"

import type { Watchable } from "@/hooks/useWatcher"
import type { SubmitFormsType } from "@/types/firestore/UseFirestoreType"
import type { FormStorage } from "@/types/storage/FormStorage"

export const submitFormWatchableFactory = (
  submitForms: SubmitFormsType,
  Storage: FormStorage
): Watchable<boolean> => {
  return async (setState) => {
    if (!Storage.data) {
      setState(false)
      return
    }
    const response = await submitForms(Storage.data)
    if (response) {
      Router.push("/register/status")
    }
  }
}
