import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion"
import Router from "next/router"
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
              การแข่งขันคณิตศาสตร์และวิทยาศาสตร์ระหว่างโรงเรียน ครั้งที่ 19
              เป็นการแข่งขันในรายวิชาคณิตศาสตร์ ฟิสิกส์ เคมี ชีววิทยา
              และคอมพิวเตอร์ โดยแข่งขันในลักษณะทีม ทีมละไม่เกิน 2 คน
              เข้าแข่งขันแยกกันในแต่ละรายวิชา
              (ในแต่ละรายวิชานักเรียนผู้เข้าแข่งขัน 1 ทีม ต้องมีครูผู้ควบคุมทีม
              1 คน)
            </li>
            <li>
              นักเรียนผู้เข้าแข่งขันต้องกําลังศึกษาอยู่ในระดับมัธยมศึกษาตอนต้นหรือมัธยมศึกษาตอนปลายของปีการศึกษา
              2565 ในสถานศึกษาเดียวกัน
            </li>
            <li>
              แต่ละรายวิชารับสมัครนักเรียนผู้เข้าแข่งขันจํานวน 20 ทีมเท่านั้น
            </li>
            <li>
              ใน 1 รายวิชาสถานศึกษาสามารถส่งนักเรียนเข้าร่วมการแข่งขันได้{" "}
              <span className="underline">1 ทีมเท่านั้น</span>{" "}
              โดยมีผู้บริหารสถานศึกษา
              เป็นผู้รับรองความเป็นนักเรียนของนักเรียนผู้เข้าแข่งขัน
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
              ภายในวันที่ 8 มกราคม 2565 เวลา 18.30 น.
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
                  Router.push(
                    { pathname: "/register", query: { filling: "true" } },
                    undefined,
                    { shallow: true }
                  )
                  section.set("student")
                }}
              />
            ) : (
              <div className="rounded-md bg-gray-600 bg-opacity-40">
                <IlluminateButton
                  disabled={true}
                  action={() => {
                    // if (user.isLoggedIn()) {
                    //   section.set("student")
                    //   return
                    // }
                    // setShowLogin(true)
                  }}
                >
                  <span>เริ่มกรอกฟอร์ม</span>
                </IlluminateButton>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </AnimateSharedLayout>
    </>
  )
}
