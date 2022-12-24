import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  Timestamp
} from "@firebase/firestore"
import hash from "object-hash"
import { useState } from "react"

import { useFirebaseAuth } from "@/contexts/firebaseAuth"
import type { StorableObject } from "@/types/StorableObject"

type ResolvableStatus = "pending" | "failed" | "resolved"
type StoredDocument = {
  stored: StorableObject
  checksum: string
  timestamp: Timestamp
}
export const useFireStore = () => {
  const db = getFirestore()
  const { user } = useFirebaseAuth()
  const saveFormsCollRef = collection(db, "savedForms")
  const [saveStorableStatus, setSSS] = useState<ResolvableStatus>("resolved")
  const [getSavedDataStatus, setGSDS] = useState<ResolvableStatus>("resolved")

  const saveStorable = async (value: StorableObject) => {
    setSSS("pending")
    const hashedValue = hash.sha1(value)
    try {
      // Save data
      await setDoc(doc(saveFormsCollRef, user.uid), {
        stored: value,
        checksum: hashedValue,
        timestamp: Timestamp.now()
      })

      setSSS("resolved")
    } catch (_) {
      setSSS("failed")
    }
  }

  const getSavedData = async (): Promise<StoredDocument | null> => {
    setGSDS("pending")
    try {
      const docData = await getDoc(doc(saveFormsCollRef, user.uid))
      setGSDS("resolved")
      return docData.data() as StoredDocument
    } catch (e) {
      setGSDS("failed")
      return null
    }
  }

  return {
    db,
    getSavedStorable: {
      call: getSavedData,
      status: getSavedDataStatus
    },
    saveStorable: {
      call: saveStorable,
      status: saveStorableStatus
    }
  }
}
