import { TeacherInputGroup } from "@/components/inputs/group/TeacherInputGroup"

export const TeacherSection = () => {
  return (
    <div>
      <div className="mt-6">
        <h1 className="text-lg font-medium">ข้อมูลครูที่ปรึกษา</h1>
        <p className="leading-4 text-gray-500">
          หากมีชื่อกลางให้กรอกในช่อง นามสกุล กรอกข้อมูลเป็นภาษาไทยเท่านั้น
        </p>
        <div className="mt-4">
          <TeacherInputGroup />
        </div>
      </div>
    </div>
  )
}
