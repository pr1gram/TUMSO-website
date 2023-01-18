import type { Dispatch } from "react"

import type { Fetcher } from "@/hooks/useFetcher"
import type { GetSubjectAvailability } from "@/types/firestore/UseFirestoreType"
import type { StorableObject } from "@/types/storage/StorableObject"

export const loadAvailableSeatsFactory = (
  getSubjectAvailability: GetSubjectAvailability,
  setAvailability: Dispatch<StorableObject | undefined>
): Fetcher => {
  return async () => {
    const d = await getSubjectAvailability()
    if (!d) return
    const constructed: { [key: string]: { text: string; c: number } } = {}
    Object.keys(d).forEach((k) => {
      const val = d[k]
      constructed[k] = {
        text: `(เหลือ ${val.max - val.count} ทีม)`,
        c: val.max - val.count
      }
    })
    setAvailability(constructed)
  }
}
