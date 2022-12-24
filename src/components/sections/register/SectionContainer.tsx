import type { Timestamp } from "@firebase/firestore"
import { CloudArrowUpIcon } from "@heroicons/react/24/outline"
import { motion } from "framer-motion"
import hash from "object-hash"
import type { FC } from "react"
import { useEffect, useState } from "react"

import { IlluminateButton } from "@/components/buttons/animated/illuminated"
import { LandingSection } from "@/components/sections/register/LandingSection"
import { StudentSection } from "@/components/sections/register/StudentSection"
import { TeacherSection } from "@/components/sections/register/TeacherSection"
import { SectionIndicator } from "@/components/texts/static/SectionIndicator"
import { useFirebaseAuth } from "@/contexts/firebaseAuth"
import { useFireStore } from "@/contexts/firestore"
import { useRegister } from "@/contexts/RegisterContext"
import type { FormData } from "@/types/FormData"

export const SectionContainer: FC<{ query: any }> = ({ query }) => {
  const { section, Storage, Updater } = useRegister()
  const { signOut, user } = useFirebaseAuth()
  const { saveStorable, getSavedStorable } = useFireStore()
  const [lastSave, setLastSave] = useState<Timestamp | null>(null)
  const [savingStatus, setSavingStatus] = useState("resolved")
  const [loadingData, setLoadingData] = useState(false)

  const saveData = async () => {
    setSavingStatus("pending")
    // Save data
    await saveStorable.call(Storage.data)
    // Validate saved checksum
    const currentChecksum = hash.sha1(Storage.data)
    const savedData = await getSavedStorable.call()
    if (!savedData) {
      setSavingStatus("unexpected_error")
      return
    }
    if (currentChecksum !== savedData.checksum) {
      setSavingStatus("checksum_mismatch")
      return
    }
    setLastSave(savedData.timestamp)
    setSavingStatus("resolved")
  }

  useEffect(() => {
    if (!user.isLoggedIn()) {
      section.set("landing")
    } else if (Object.hasOwn(query, "filling")) {
      if (section.is("landing")) {
        section.set("student")
      }
    }
  }, [user.isLoggedIn(), section])

  const getData = async () => {
    const data = await getSavedStorable.call()
    if (data) {
      Updater.setReceivedData(data.stored as FormData)
      setLastSave(data.timestamp)
    }
  }

  useEffect(() => {
    if (user.isLoggedIn()) {
      getData()
    }
  }, [user])

  const parseTimestamp = (timestamp: Timestamp | null) => {
    if (!timestamp) return <span>-</span>
    const month = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
      ""
    ]
    function pad(num: number | undefined) {
      if (!num) return ""
      let strNum = num.toString()
      while (strNum.length < 2) {
        strNum = `0${strNum}`
      }
      return strNum
    }

    return (
      <span>
        {pad(timestamp?.toDate().getHours())}:
        {pad(timestamp?.toDate().getMinutes())}
        {"น. "}
        {pad(timestamp?.toDate().getDate())}{" "}
        {month[timestamp?.toDate().getMonth() || 12]}{" "}
        {timestamp?.toDate().getFullYear()}
      </span>
    )
  }

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
          <div className="mt-4">
            <IlluminateButton width={100} action={saveData}>
              <div className="flex items-center space-x-1">
                <CloudArrowUpIcon
                  stroke={"currentColor"}
                  strokeWidth={1.5}
                  className="h-5 w-5"
                />
                <span className="font-normal">บันทึก</span>
              </div>
            </IlluminateButton>
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
      )}
      {section.is("landing") && <LandingSection />}
      <motion.div
        initial={{ display: "none" }}
        animate={
          section.is("student") ? { display: "block" } : { display: "none" }
        }
      >
        <StudentSection />
      </motion.div>
      <motion.div
        initial={{ display: "none" }}
        animate={
          section.is("teacher") ? { display: "block" } : { display: "none" }
        }
      >
        <TeacherSection />
      </motion.div>
    </div>
  )
}
