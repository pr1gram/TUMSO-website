import { useEffect } from "react"

import type { FormStorage } from "@/types/storage/FormStorage"
import { translateToEng } from "@/utils/fixedSelection"

export const useTranslationLayerEffect = (
  selection: string | null,
  Storage: FormStorage
) => {
  useEffect(() => {
    if (selection) {
      Storage.updateSection("selection", {
        subject: translateToEng(selection)
      })
    }
  }, [selection])
}
