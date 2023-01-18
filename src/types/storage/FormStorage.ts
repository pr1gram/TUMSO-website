import type { Dispatch } from "react"

import type { FormData } from "@/types/register/form/FormData"
import type { UpdateSection } from "@/types/section/UpdateSection"

export interface FormStorage {
  updateSection: UpdateSection
  data: FormData
  setStorage: Dispatch<FormData>
  storageDep: number
}
