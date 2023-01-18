import { Timestamp } from "@firebase/firestore"
import { useState } from "react"

import type { Callable } from "@/types/callables/Callable"
import type { UploadDocumentType } from "@/types/firestore/UseFirestoreType"
import type { FormStorage } from "@/types/storage/FormStorage"

export const useFileUploadHandler = (
  saveAction: Callable<void>,
  uploadDocument: UploadDocumentType,
  Storage: FormStorage
): [boolean, boolean, (files: FileList | null) => Promise<void>] => {
  const [invalidType, setInvalidType] = useState(false)
  const [invalidSize, setInvalidSize] = useState(false)

  const upload = async (files: FileList | null) => {
    setInvalidType(false)
    setInvalidSize(false)
    if (!files) return
    const file = files[0]
    if (!file) return
    if (file.type !== "application/pdf") {
      setInvalidType(true)
      return
    }
    if (file.size > 10000000) {
      setInvalidSize(true)
      return
    }
    const path = await uploadDocument.call(file)
    if (path) {
      Storage.updateSection("document", {
        filePath: path.path,
        date: Timestamp.now().seconds
      })
      saveAction()
    }
  }

  return [invalidType, invalidSize, upload]
}
