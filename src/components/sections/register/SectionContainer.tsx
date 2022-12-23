import { LandingSection } from "@/components/sections/register/LandingSection"
import { StudentSection } from "@/components/sections/register/StudentSection"
import { TeacherSection } from "@/components/sections/register/TeacherSection"
import { SectionIndicator } from "@/components/texts/static/SectionIndicator"
import { useRegister } from "@/contexts/RegisterContext"

export const SectionContainer = () => {
  const { section } = useRegister()
  return (
    <div>
      {!section.is("landing") && (
        <div className={"mt-4"}>
          <h1 className="font-medium">ส่วนที่ {section.get.number}/4</h1>
          <SectionIndicator title={"1. ข้อมูลนักเรียน"} id={"student"} />
          <SectionIndicator title={"2. ข้อมูลครูที่ปรึกษา"} id={"teacher"} />
          <SectionIndicator title={"3. วิชาที่ลงสมัคร"} id={"selection"} />
          <SectionIndicator
            title={"4. เอกสารรับรองสถานะภาพผู้เรียน"}
            id={"document"}
          />
        </div>
      )}
      {section.is("landing") && <LandingSection />}
      {section.is("student") && <StudentSection />}
      {section.is("teacher") && <TeacherSection />}
    </div>
  )
}
