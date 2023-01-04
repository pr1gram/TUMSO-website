import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc
} from "@firebase/firestore"

export const useAdminControl = () => {
  const db = getFirestore()
  const submittedCol = collection(db, "submitted")

  const getSubmitted = async () => {
    const dataCollection = await getDocs(submittedCol)
    return dataCollection.docs.map((d) => ({ id: d.id, ...d.data() }))
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
    updateStatus
  }
}
