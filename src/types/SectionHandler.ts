import type { Dispatch } from "react"

import type { AvailableSections } from "@/types/AvailableSections"

export interface SectionHandler {
  get: { name: string; number: number }
  set: Dispatch<AvailableSections>
  is: (comparable: string) => boolean
}
