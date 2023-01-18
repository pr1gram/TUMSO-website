import {
  collection,
  doc,
  getDoc,
  getFirestore,
  increment,
  runTransaction,
  setDoc,
  Timestamp,
  updateDoc
} from "@firebase/firestore"
import { getDownloadURL, getStorage, ref, uploadBytes } from "@firebase/storage"
import hash from "object-hash"
import { useState } from "react"

import { useFirebaseAuth } from "@/contexts/firebaseAuth"
import type { ResolvableStatus } from "@/types/callables/ResolvableStatus"
import type { StoredDocument } from "@/types/firestore/StoredDocument"
import type { SubmitStatus } from "@/types/firestore/SubmitStatus"
import type { UseFirestoreType } from "@/types/firestore/UseFirestoreType"
import type { FormData } from "@/types/register/form/FormData"
import type { StorableObject } from "@/types/storage/StorableObject"

export const useFireStore = (): UseFirestoreType => {
  const db = getFirestore()
  const storage = getStorage()
  const { user } = useFirebaseAuth()
  const saveFormsCollRef = collection(db, "savedForms")
  const [saveStorableStatus, setSSS] = useState<ResolvableStatus>("resolved")
  const [getSavedDataStatus, setGSDS] = useState<ResolvableStatus>("resolved")
  const [uploadFileStatus, setUFS] = useState<ResolvableStatus>("resolved")

  const submitForms = async (data: FormData) => {
    const hashedValue = hash.sha1(data)
    try {
      if (!data.selection.subject) return false
      await runTransaction(db, async (transaction) => {
        const count = await transaction.get(
          doc(collection(db, "count"), "subject")
        )
        const sd = await transaction.get(
          doc(collection(db, "submitted"), user.uid)
        )
        const userSelected: { count: number; max: number } = count.get(
          data.selection.subject as string
        )

        if (userSelected.count >= userSelected.max) return

        transaction.set(doc(collection(db, "submitted"), user.uid), {
          data,
          checksum: hashedValue,
          timestamp: Timestamp.now(),
          status: "waiting"
        })

        if (!sd.exists() || sd.get("status") !== "editing") {
          transaction.update(
            doc(collection(db, "count"), "subject"),
            `${data.selection.subject}.count`,
            increment(1)
          )
        }
      })
      return true
    } catch (_) {
      return false
    }
  }

  const getSubjectAvailability = async () => {
    try {
      const count = await getDoc(doc(collection(db, "count"), "subject"))
      return count.data()
    } catch (e) {
      return undefined
    }
  }

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

  const uploadDocument = async (file: File) => {
    setUFS("pending")
    const tempName = `${new Date().getTime()}.pdf`
    const destinationRef = ref(storage, `document/${user.uid}/${tempName}`)
    try {
      const result = await uploadBytes(destinationRef, file)
      const path = result.ref.fullPath
      setUFS("resolved")
      return { path }
    } catch (e) {
      setUFS("failed")
      return { path: null }
    }
  }

  const getDocumentLink = async (path: string) => {
    try {
      const url = await getDownloadURL(ref(storage, path))
      return url
    } catch (e) {
      return null
    }
  }

  const enableEditing = async () => {
    await updateDoc(doc(collection(db, "submitted"), user.uid), {
      status: "editing"
    })
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

  const getSubmitStatus = async (): Promise<SubmitStatus | undefined> => {
    if (!user.uid) return undefined
    try {
      const docData = await getDoc(doc(collection(db, "submitted"), user.uid))
      if (docData.exists()) {
        return {
          status: docData.get("status"),
          timestamp: docData.get("timestamp"),
          id: docData.id,
          reason: docData.get("reason"),
          ticketData: {
            fs: {
              firstname: docData.get("data").students[1].firstname,
              lastname: docData.get("data").students[1].lastname
            },
            ss: {
              firstname: docData.get("data").students[2].firstname,
              lastname: docData.get("data").students[2].lastname
            },
            teacher: {
              firstname: docData.get("data").teacher.firstname,
              lastname: docData.get("data").teacher.lastname
            }
          }
        }
      }
      return undefined
    } catch (e) {
      return undefined
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
    },
    uploadDocument: {
      call: uploadDocument,
      status: uploadFileStatus
    },
    getDocumentLink,
    submitForms,
    getSubmitStatus,
    getSubjectAvailability,
    enableEditing
  }
}
