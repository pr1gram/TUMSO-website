import { useState } from "react"

import type { AvailableSections } from "@/types/AvailableSections"
import type { SectionHandler } from "@/types/SectionHandler"

export const useSectionHandler = (): SectionHandler => {
  const [section, setSection] = useState<AvailableSections>("landing")

  const compareSection = (comparable: string) => {
    return comparable === section
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
    is: compareSection
  }
}

export const defaultSectionHandler: SectionHandler = {
  get: { name: "landing", number: 0 },
  set: () => {},
  is: () => false
}
