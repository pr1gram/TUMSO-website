import { useEffect, useState } from "react"

import { TeacherInputGroup } from "@/components/inputs/group/TeacherInputGroup"
import { useRegister } from "@/contexts/RegisterContext"
import type { TeacherInputGroupData } from "@/types/TeacherInputGroupData"
import { defaultTeacherInputGroupData } from "@/types/TeacherInputGroupData"

export const TeacherSection = () => {
  const [teacher, setTeacher] = useState<TeacherInputGroupData>(
    defaultTeacherInputGroupData
  )
  const { Storage } = useRegister()

  useEffect(() => {
    Storage.updateSection("teacher", teacher)
  }, [teacher])

  return (
    <div>
      <div className="mt-6">
        <h1 className="text-lg font-medium">ข้อมูลครูที่ปรึกษา</h1>
        <p className="leading-4 text-gray-500">
          หากมีชื่อกลางให้กรอกในช่อง นามสกุล กรอกข้อมูลเป็นภาษาไทยเท่านั้น
        </p>
        <div className="mt-4">
          <TeacherInputGroup updateState={setTeacher} />
        </div>
      </div>
    </div>
  )
}
