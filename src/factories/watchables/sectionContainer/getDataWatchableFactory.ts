import type { Timestamp } from "@firebase/firestore"
import type { Dispatch } from "react"

import type { Watchable } from "@/hooks/useWatcher"
import type { GetSavedStorableType } from "@/types/firestore/UseFirestoreType"
import type { FormData } from "@/types/register/form/FormData"
import type { Updater } from "@/types/register/Updater"

export const getDataWatchableFactory = (
  getSavedStorable: GetSavedStorableType,
  Updater: Updater,
  setLastSave: Dispatch<Timestamp>,
  setLastHash: Dispatch<string>
): Watchable<boolean> => {
  return async () => {
    const data = await getSavedStorable.call()
    if (data) {
      Updater.setReceivedData(data.stored as FormData)
      setLastSave(data.timestamp)
      setLastHash(data.checksum)
    }
  }
}
