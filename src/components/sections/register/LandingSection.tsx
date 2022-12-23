import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion"
import { useState } from "react"

import { IlluminateButton } from "@/components/buttons/animated/illuminated"
import { SignInWithGoogle } from "@/components/buttons/animated/SignInWithGoogle"
import { useFirebaseAuth } from "@/contexts/firebaseAuth"
import { useRegister } from "@/contexts/RegisterContext"

export const LandingSection = () => {
  const { section } = useRegister()
  const [showLogIn, setShowLogin] = useState(false)
  const { user } = useFirebaseAuth()
  return (
    <>
      <div className="mt-8 mb-10">
        <div className="rounded-xl border border-gray-600 border-opacity-60 px-6 pt-4 pb-5">
          <h1 className="font-semibold">ข้อมูลการสมัคร</h1>
          <ol className="list-decimal pl-6">
            <li>
              การแข่งขันคณิตศาสตร์และวิทยาศาสตร์ระหว่างโรงเรียน ครั้งที่ 18
              เป็นการแข่งขันในสาขาวิชา คณิตศาสตร์ ฟิสิกส์ เคมี ชีววิทยา
              และคอมพิวเตอร์ โดยเข้าแข่งขันในลักษณะทีม ทีมละไม่เกิน 2 คน
              เข้าแข่งขันแยกในแต่ละสาขาวิชา
            </li>
            <li>
              ผู้เข้าแข่งขันจะต้องก าลังศึกษาในระดับชั้นมัธยมศึกษา
              ในสถานศึกษาเดียวกัน
            </li>
            <li>
              แต่ละโรงเรียนสามารถส่งนักเรียนเข้าร่วมการแข่งขันได้ไม่เกิน 2
              ทีมในแต่ละวิชา โดยมีผู้บริหาร
              สถานศึกษาหรือหัวหน้ากลุ่มสาระการเรียนรู้ที่เกี่ยวข้องรับรอง
            </li>
          </ol>
          <h1 className="mt-2 font-semibold">ข้อมูลแบบฟอร์มรับสมัคร</h1>
          <ol className="list-decimal pl-6">
            <li>
              แบบฟอร์มนี้มีเอกสารที่ต้องดาวน์โหลดเพื่อให้ผู้บริหารสถานศึกษาลงชื่อ
              จากนั้น
              <span className="text-red-400 underline">
                อัพโหลดขึ้นสู่ระบบพร้อมกับส่งแบบฟอร์ม
              </span>{" "}
              ภายในวันที่ 6 มกราคม 2565
            </li>
            <li>
              ผู้สมัครสามารถบันทึกข้อมูลแบบฟอร์มไว้ส่งในภายหลังได้
              <span className="text-red-400 underline">
                หากผู้สมัครบันทึกแบบฟอร์มไว้แล้วแต่ไม่ได้ส่งแบบฟอร์มภายในเวลาปิดฟอร์ม
                จะถือว่าการสมัครไม่สำเร็จ
              </span>
            </li>
          </ol>
        </div>
      </div>
      <AnimateSharedLayout>
        <AnimatePresence>
          <motion.div
            key={`${showLogIn ? "logable" : "continue"}`}
            initial={{ y: 10, opacity: 0 }}
            exit={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            layout={"position"}
            className="flex justify-center"
          >
            {showLogIn ? (
              <SignInWithGoogle
                successAction={() => {
                  section.set("student")
                }}
              />
            ) : (
              <IlluminateButton
                action={() => {
                  if (user.isLoggedIn()) {
                    section.set("student")
                    return
                  }
                  setShowLogin(true)
                }}
              >
                <span>เริ่มกรอกฟอร์ม</span>
              </IlluminateButton>
            )}
          </motion.div>
        </AnimatePresence>
      </AnimateSharedLayout>
    </>
  )
}
