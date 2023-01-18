import type { Timestamp } from "@firebase/firestore"
import hash from "object-hash"
import type { Dispatch } from "react"

import type { Watchable } from "@/hooks/useWatcher"
import type { CheckHashType } from "@/types/checksum/CheckHashType"
import type {
  GetSavedStorableType,
  SaveStorableType
} from "@/types/firestore/UseFirestoreType"
import type { FormStorage } from "@/types/storage/FormStorage"

export const saveDataWatchableFactory = (
  saveStorable: SaveStorableType,
  Storage: FormStorage,
  getSavedStorable: GetSavedStorableType,
  check: CheckHashType,
  setLastSave: Dispatch<Timestamp>,
  setLastHash: Dispatch<string>
): Watchable<string> => {
  return async (setState) => {
    setState("pending")
    // Save data
    await saveStorable.call(Storage.data)
    // Validate saved checksum
    const currentChecksum = hash.sha1(Storage.data)
    const savedData = await getSavedStorable.call()
    if (!savedData) {
      setState("unexpected_error")
      return
    }
    if (currentChecksum !== savedData.checksum) {
      setState("checksum_mismatch")
      return
    }
    check(savedData.checksum)
    setLastSave(savedData.timestamp)
    setLastHash(savedData.checksum)
    setState("resolved")
  }
}
