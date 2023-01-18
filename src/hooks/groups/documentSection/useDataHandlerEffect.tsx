import { useEffect } from "react"

import type { Updater } from "@/types/register/Updater"
import type { FormStorage } from "@/types/storage/FormStorage"

export const useDataHandlerEffect = (
  Updater: Updater,
  Storage: FormStorage
) => {
  useEffect(() => {
    if (Updater.receivedData?.document) {
      Storage.updateSection("document", Updater.receivedData?.document)
    }
  }, [Updater.receivedData?.document?.filePath])
}
