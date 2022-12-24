import type { DocumentData } from "@/types/DocumentData"
import type { SelectionData } from "@/types/SelectionData"
import { defaultSelectionData } from "@/types/SelectionData"
import type { StudentInputGroupData } from "@/types/StudentInputGroupData"
import { defaultStudentInputGroupData } from "@/types/StudentInputGroupData"
import type { TeacherInputGroupData } from "@/types/TeacherInputGroupData"
import { defaultTeacherInputGroupData } from "@/types/TeacherInputGroupData"

export interface FormData {
  school: {
    name: string
    notListed: boolean
  }
  students: {
    1: StudentInputGroupData
    2: StudentInputGroupData
  }
  teacher: TeacherInputGroupData
  selection: SelectionData
  document: DocumentData | null
}

export const defaultFormData = {
  school: {
    name: "",
    notListed: false
  },
  students: {
    1: defaultStudentInputGroupData,
    2: defaultStudentInputGroupData
  },
  teacher: defaultTeacherInputGroupData,
  selection: defaultSelectionData,
  document: null
}
