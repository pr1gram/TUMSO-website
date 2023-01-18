import type { DocumentData } from "@/types/register/form/DocumentData"
import type { SelectionData } from "@/types/register/form/SelectionData"
import { defaultSelectionData } from "@/types/register/form/SelectionData"
import type { StudentInputGroupData } from "@/types/register/form/StudentInputGroupData"
import { defaultStudentInputGroupData } from "@/types/register/form/StudentInputGroupData"
import type { TeacherInputGroupData } from "@/types/register/form/TeacherInputGroupData"
import { defaultTeacherInputGroupData } from "@/types/register/form/TeacherInputGroupData"

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
