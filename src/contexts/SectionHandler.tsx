import { useState } from "react"

import type { AvailableSections } from "@/types/AvailableSections"
import type { SectionHandler } from "@/types/SectionHandler"

export const useSectionHandler = (): SectionHandler => {
  const [section, setSection] = useState<AvailableSections>("landing")
  const [validationResult, setValResult] = useState({
    student: false,
    teacher: false,
    selection: false,
    document: false
  })

  const compareSection = (comparable: string) => {
    return comparable === section
  }

  const updateValidationResult = (
    target: AvailableSections,
    result: boolean
  ) => {
    setValResult((prev) => ({ ...prev, [target]: result }))
  }

  const getSectionNumber = () => {
    switch (section) {
      case "student":
        return 1
      case "teacher":
        return 2
      case "selection":
        return 3
      case "document":
        return 4
      default:
        return 0
    }
  }

  return {
    get: { name: section, number: getSectionNumber() },
    set: setSection,
    is: compareSection,
    validation: {
      update: updateValidationResult,
      get: validationResult,
      getAll: Object.values(validationResult).reduce((pre, curr) => pre && curr)
    }
  }
}

export const defaultSectionHandler: SectionHandler = {
  get: { name: "landing", number: 0 },
  set: () => {},
  is: () => false,
  validation: {
    update: () => {},
    getAll: false,
    get: {
      student: false,
      teacher: false,
      selection: false,
      document: false
    }
  }
}
