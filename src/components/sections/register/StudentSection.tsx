import type { FC } from "react"
import { useState } from "react"

import { SchoolInputGroup } from "@/components/inputs/group/SchoolInputGroup"
import { StudentInputGroup } from "@/components/inputs/group/StudentInputGroup"
import { useRegister } from "@/contexts/RegisterContext"
import { useDataHandlerEffects } from "@/hooks/groups/studentSection/useDataHandlerEffects"
import { defaultSchoolInputData } from "@/types/register/form/SchoolInputData"
import { defaultStudentInputGroupData } from "@/types/register/form/StudentInputGroupData"

export const StudentSection: FC<{}> = () => {
  // Contexts
  const { Storage, Updater } = useRegister()

  // States
  const [student1, setSTD1] = useState(defaultStudentInputGroupData)
  const [student2, setSTD2] = useState(defaultStudentInputGroupData)
  const [school, setSchool] = useState(defaultSchoolInputData)

  // Effects
  useDataHandlerEffects(student1, student2, school, Storage)

  return (
    <div>
      <div className="mt-6">
        <h1 className="text-lg font-medium">ข้อมูลโรงเรียน</h1>
        <p className="leading-4 text-gray-500">
          หากไม่พบข้อมูลโรงเรียนในระบบ ให้เลือก{" "}
          <span className="font-medium text-gray-800">
            ไม่พบโรงเรียนในช่องค้นหา
          </span>{" "}
          และกรอกชื่อโรงเรียน
        </p>
        <div className="mt-4">
          <SchoolInputGroup updateState={setSchool} />
        </div>
      </div>
      <div className="mt-6">
        <h1 className="text-lg font-medium">ข้อมูลนักเรียน</h1>
        <p className="leading-4 text-gray-500">
          หากมีชื่อกลางให้กรอกในช่อง นามสกุล กรอกข้อมูลเป็นภาษาไทยเท่านั้น
        </p>
        <div className="mt-4">
          <h1 className="font-medium">นักเรียนคนที่ 1</h1>
          <StudentInputGroup
            updateState={setSTD1}
            valueContainer={Updater.receivedData?.students["1"]}
          />
          <h1 className="mt-4 font-medium">นักเรียนคนที่ 2</h1>
          <StudentInputGroup
            updateState={setSTD2}
            valueContainer={Updater.receivedData?.students["2"]}
          />
        </div>
      </div>
    </div>
  )
}
