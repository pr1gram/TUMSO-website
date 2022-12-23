import { useEffect } from "react"

import { LandingSection } from "@/components/sections/register/LandingSection"
import { StudentSection } from "@/components/sections/register/StudentSection"
import { TeacherSection } from "@/components/sections/register/TeacherSection"
import { SectionIndicator } from "@/components/texts/static/SectionIndicator"
import { useFirebaseAuth } from "@/contexts/firebaseAuth"
import { useRegister } from "@/contexts/RegisterContext"

export const SectionContainer = () => {
  const { section } = useRegister()
  const { signOut, user } = useFirebaseAuth()

  useEffect(() => {
    if (!user.isLoggedIn()) {
      section.set("landing")
    }
  }, [user.isLoggedIn(), section])
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
          <h1 className="mt-3 text-sm leading-[8px]">
            บันทึกครั้งล่าสุด: 16.00 02/23/22
          </h1>
          <a
            onClick={signOut}
            className="cursor-pointer text-sm leading-[4px] hover:underline"
          >
            ออกจากระบบ
          </a>
        </div>
      )}
      {section.is("landing") && <LandingSection />}
      {section.is("student") && <StudentSection />}
      {section.is("teacher") && <TeacherSection />}
    </div>
  )
}
