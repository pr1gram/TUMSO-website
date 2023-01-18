import { useEffect } from "react"

import type { SchoolInputData } from "@/types/register/form/SchoolInputData"
import type { StudentInputGroupData } from "@/types/register/form/StudentInputGroupData"
import type { FormStorage } from "@/types/storage/FormStorage"

export const useDataHandlerEffects = (
  student1: StudentInputGroupData,
  student2: StudentInputGroupData,
  school: SchoolInputData,
  Storage: FormStorage
) => {
  // Update students data
  useEffect(() => {
    Storage.updateSection("students", {
      1: student1,
      2: student2
    })
  }, [student1, student2])

  // Update school data
  useEffect(() => {
    Storage.updateSection("school", {
      name: school.name
        .trim()
        .replace(/\r/g, "")
        .replace(/\u200B/g, ""),
      notListed: school.notListed
    })
  }, [school.name, school.notListed])
}
