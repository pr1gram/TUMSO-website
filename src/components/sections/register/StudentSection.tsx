import { SchoolInputGroup } from "@/components/inputs/group/SchoolInputGroup"
import { StudentInputGroup } from "@/components/inputs/group/StudentInputGroup"

export const StudentSection = () => {
  return (
    <div>
      <div className="mt-6">
        <h1 className="text-lg font-medium">ข้อมูลโรงเรียน</h1>
        <p className="leading-4 text-gray-600">
          หากไม่พบข้อมูลโรงเรียนในระบบ ให้เลือก{" "}
          <span className="font-medium text-gray-800">
            ไม่พบโรงเรียนในช่องค้นหา
          </span>{" "}
          และกรอกชื่อโรงเรียน
        </p>
        <div className="mt-4">
          <SchoolInputGroup />
        </div>
      </div>
      <div className="mt-6">
        <h1 className="text-lg font-medium">ข้อมูลนักเรียน</h1>
        <p className="leading-4 text-gray-600">
          หากมีชื่อกลางให้กรอกในช่อง นามสกุล กรอกข้อมูลเป็นภาษาไทยเท่านั้น
        </p>
        <div className="mt-4">
          <h1 className="font-medium">นักเรียนคนที่ 1</h1>
          <StudentInputGroup />
          <h1 className="mt-4 font-medium">นักเรียนคนที่ 2</h1>
          <StudentInputGroup />
        </div>
      </div>
    </div>
  )
}
