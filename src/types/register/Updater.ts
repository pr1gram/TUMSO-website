import type { Dispatch } from "react"

import type { FormData } from "@/types/register/form/FormData"

export interface Updater {
  setReceivedData: Dispatch<FormData | null>
  receivedData: FormData | null
}
