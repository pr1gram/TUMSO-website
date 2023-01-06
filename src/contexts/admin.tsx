import type { DocumentSnapshot } from "@firebase/firestore"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where
} from "@firebase/firestore"

export const useAdminControl = () => {
  const db = getFirestore()
  const submittedCol = collection(db, "submitted")

  const getAdditional = async (
    last: DocumentSnapshot,
    status: string
  ): Promise<[any, any]> => {
    const addit = await getDocs(
      query(
        submittedCol,
        where("status", "==", status),
        orderBy("timestamp"),
        limit(10),
        startAfter(last)
      )
    )

    return [
      addit.docs.map((d) => ({ id: d.id, ...d.data() })),
      addit.docs[addit.docs.length - 1]
    ]
  }
  const getSubmitted = async (fullData = false): Promise<[any, any]> => {
    const accepted = await getDocs(
      query(
        submittedCol,
        where("status", "==", "accepted"),
        orderBy("timestamp"),
        limit(fullData ? 9999 : 10)
      )
    )
    const waiting = await getDocs(
      query(
        submittedCol,
        where("status", "==", "waiting"),
        orderBy("timestamp"),
        limit(fullData ? 9999 : 10)
      )
    )

    const rejected = await getDocs(
      query(
        submittedCol,
        where("status", "==", "rejected"),
        orderBy("timestamp"),
        limit(fullData ? 9999 : 10)
      )
    )

    const editing = await getDocs(
      query(
        submittedCol,
        where("status", "==", "editing"),
        orderBy("timestamp"),
        limit(fullData ? 9999 : 10)
      )
    )

    const dataCollection = [
      ...accepted.docs,
      ...editing.docs,
      ...rejected.docs,
      ...waiting.docs
    ]

    return [
      dataCollection.map((d) => ({ id: d.id, ...d.data() })),
      {
        accepted: accepted.docs[accepted.docs.length - 1],
        editing: editing.docs[editing.docs.length - 1],
        rejected: rejected.docs[rejected.docs.length - 1],
        waiting: waiting.docs[waiting.docs.length - 1]
      }
    ]
  }

  const getCount = async () => {
    const count = await getDoc(doc(collection(db, "count"), "subject"))

    return count.data()
  }
  const updateStatus = async (
    status: string,
    docId: string,
    reason?: string
  ) => {
    if (status === "rejected") {
      await updateDoc(doc(collection(db, "submitted"), docId), {
        status,
        reason
      })

      const submittedData = await getDoc(
        doc(collection(db, "submitted"), docId)
      )

      const d = submittedData.get("data")
      const c = submittedData.get("checksum")
      const t = submittedData.get("timestamp")

      await updateDoc(doc(collection(db, "savedForms"), docId), {
        stored: d,
        checksum: c,
        timestamp: t
      })

      return true
    }

    await updateDoc(doc(collection(db, "submitted"), docId), {
      status
    })
    return true
  }

  const loadFormData = async (docId: string) => {
    const docData = await getDoc(doc(collection(db, "submitted"), docId))
    if (docData) {
      const d = docData.data()
      // @ts-ignore
      d.stored = d?.data
      delete d?.data
      return d
    }
    return null
  }
  return {
    getSubmitted,
    loadFormData,
    updateStatus,
    getCount,
    getAdditional
  }
}
