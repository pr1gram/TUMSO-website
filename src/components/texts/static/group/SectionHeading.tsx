import type { Timestamp } from "@firebase/firestore"
import { CloudArrowUpIcon } from "@heroicons/react/24/outline"
import { ArrowPathIcon } from "@heroicons/react/24/solid"
import { motion } from "framer-motion"
import type { FC } from "react"

import { IlluminateButton } from "@/components/buttons/animated/illuminated"
import { SectionIndicator } from "@/components/texts/static/SectionIndicator"
import { useFirebaseAuth } from "@/contexts/firebaseAuth"
import { useRegister } from "@/contexts/RegisterContext"
import { parseTimestamp } from "@/utils/time"

export const SectionHeading: FC<{
  saveData: () => void
  isDiffer: boolean
  lastSave: Timestamp | null
  savingStatus: string
}> = ({ saveData, isDiffer, lastSave, savingStatus }) => {
  const { section } = useRegister()
  const { signOut } = useFirebaseAuth()

  return (
    <div className={"mt-4"}>
      <h1 className="font-medium">ส่วนที่ {section.get.number}/4</h1>
      <SectionIndicator title={"1. ข้อมูลนักเรียน"} id={"student"} />
      <SectionIndicator title={"2. ข้อมูลครูที่ปรึกษา"} id={"teacher"} />
      <SectionIndicator title={"3. วิชาที่ลงสมัคร"} id={"selection"} />
      <SectionIndicator
        title={"4. เอกสารรับรองสถานภาพผู้เรียน"}
        id={"document"}
      />
      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <IlluminateButton width={100} action={saveData}>
            <div className="flex items-center space-x-2">
              {savingStatus === "pending" && (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              )}

              {savingStatus === "resolved" && (
                <CloudArrowUpIcon
                  stroke={"currentColor"}
                  strokeWidth={1.5}
                  className="h-5 w-5"
                />
              )}

              <span className="font-normal">บันทึก</span>
            </div>
          </IlluminateButton>

          <motion.span
            transition={{ duration: 0.1 }}
            animate={{ opacity: isDiffer ? 1 : 0 }}
            className="text-xs text-yellow-600"
          >
            *มีการแก้ไขที่ไม่ได้บันทึก
          </motion.span>
        </div>
        <h1 className="mt-3 text-sm leading-[8px]">
          บันทึกครั้งล่าสุด: {parseTimestamp(lastSave)}
        </h1>
        <a
          onClick={signOut}
          className="cursor-pointer text-sm leading-[4px] hover:underline"
        >
          ออกจากระบบ
        </a>
      </div>
    </div>
  )
}
