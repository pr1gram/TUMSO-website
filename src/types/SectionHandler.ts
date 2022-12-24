import type { Dispatch } from "react"

import type { AvailableSections } from "@/types/AvailableSections"

interface ValidationResult {
  student: boolean
  teacher: boolean
  selection: boolean
  document: boolean
}

export interface SectionHandler {
  get: { name: string; number: number }
  set: Dispatch<AvailableSections>
  is: (comparable: string) => boolean
  validation: {
    update: (target: AvailableSections, result: boolean) => void
    get: ValidationResult
    getAll: boolean
  }
}
