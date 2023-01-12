import type { Timestamp } from "@firebase/firestore"
import { ArrowDownTrayIcon, PencilIcon } from "@heroicons/react/20/solid"
import InApp from "detect-inapp"
import { motion } from "framer-motion"
import Router from "next/router"
import { useCallback, useEffect, useState } from "react"

import { useFirebaseAuth } from "@/contexts/firebaseAuth"
import { useFireStore } from "@/contexts/firestore"
import { parseTimestamp } from "@/utils/time"

const Page = () => {
  const { user, signOut } = useFirebaseAuth()
  const { getSubmitStatus, enableEditing } = useFireStore()
  const [imgLoading, setImgLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submissionData, setSD] = useState<{
    status: string
    timestamp: Timestamp
    id: string
    reason?: string
    ticketData: any
  } | null>(null)

  const showStatus = useCallback(() => {
    switch (submissionData?.status) {
      case "waiting":
        return <span className="text-yellow-600">รอการตรวจสอบ</span>
      case "rejected":
        return <span className="text-red-500">ถูกปฏิเสธ</span>
      case "editing":
        return <span className="text-orange-500">รอการแก้ไข</span>
      case "accepted":
        return <span className="text-green-600">ตรวจสอบแล้ว</span>
      default:
        return <span className="text-red-400">ไม่พบสถานะ</span>
    }
  }, [submissionData?.status])

  const downloadImg = async (
    firstname: string,
    lastname: string,
    status: string,
    type: string,
    id?: string
  ) => {
    if (!id) return
    if (imgLoading) return

    const imgUrl = `https://openhouse.triamudom.ac.th/api/ticket`

    setImgLoading(true)

    const res = await fetch(imgUrl, {
      method: "POST",
      body: JSON.stringify({
        uid: `TUMSO-${id}`,
        profileIcon: type,
        username: "TUMSO19",
        firstname,
        lastname,
        status,
        account_id: "TUMSO192023"
      })
    })

    if (res.ok) {
      const inapp = new InApp(navigator.userAgent || navigator.vendor)

      if (
        inapp.browser === "line" ||
        inapp.browser === "messenger" ||
        inapp.browser === "facebook"
      ) {
        const a = document.createElement("a")
        a.href = imgUrl
        a.download = `ticket.png`
        document.body.appendChild(a)
        a.click()
        a.remove()
      } else {
        const a = document.createElement("a")
        a.href = window.URL.createObjectURL(await res.blob())
        a.download = `ticket.png`
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
    }

    setImgLoading(false)
  }
  useEffect(() => {
    setLoading(true)
    const load = async () => {
      const sd = await getSubmitStatus()
      if (sd) {
        setSD(sd)
      } else {
        Router.push("/register")
      }
      setLoading(false)
    }
    if (user.uid) {
      load()
      return
    }
    Router.push("/register")
  }, [user.uid])

  const edit = async () => {
    await enableEditing()
    Router.push("/register?filling")
  }

  return (
    <div className="font-noto-sans-thai py-16 text-gray-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={
          loading || imgLoading
            ? { opacity: 1, display: "flex" }
            : { opacity: 0, display: "none" }
        }
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 z-[100] flex min-h-screen w-full cursor-not-allowed flex-col items-center justify-center bg-gray-100 bg-opacity-40 backdrop-blur-sm"
      >
        {imgLoading && (
          <>
            <h1 className="animate-pulse text-xl">กำลังสร้างบัตรเข้าร่วมงาน</h1>
            <p className="text-gray-500">กรุณารอสักครู่...</p>
          </>
        )}
      </motion.div>
      <div className="mx-auto flex w-full max-w-lg flex-col px-6 sm:max-w-2xl">
        <div>
          <h1 className="text-2xl font-semibold">ลงทะเบียนสมัครแข่งขัน</h1>
          <h1 className="mt-1 font-medium leading-4 text-gray-600">
            หมดเขตรับสมัคร:{" "}
            <span className="text-gray-800">11 มกราคม 2565 เวลา 12.00 น.</span>
          </h1>
          <p className="text-gray-600">
            ขอความร่วมมือผู้สมัคร
            <span className="font-medium text-red-400">
              อ่านคำแนะนำก่อนเริ่มการสมัครอย่างละเอียด
            </span>
            ก่อนเริ่มกรอกใบสมัคร
          </p>
          <a
            onClick={signOut}
            className="cursor-pointer text-sm hover:underline"
          >
            ออกจากระบบ
          </a>
        </div>
        <div className="my-4 flex items-center justify-center">
          <div className="max-w-[320px] rounded-md border border-gray-500 border-opacity-50 px-4 py-2">
            <h1 className="mt-1 text-center">สถานะ: {showStatus()}</h1>
            {submissionData?.status === "rejected" ? (
              <h1 className="mb-1 text-center text-sm">
                สาเหตุ :{" "}
                {submissionData?.reason === "duplicated" ? (
                  <span className="font-medium text-yellow-600 underline">
                    1 โรงเรียนสามารถส่งได้เพียง 1 ทีมต่อหนึ่งวิชาเท่านั้น
                  </span>
                ) : (
                  <span className="font-medium text-gray-500">
                    {submissionData?.reason}
                  </span>
                )}
              </h1>
            ) : (
              <h1 className="mb-1 text-center text-sm">
                ส่งเมื่อ:{" "}
                <span className="text-gray-600">
                  {parseTimestamp(submissionData?.timestamp || null)}
                </span>
              </h1>
            )}
            {submissionData?.status === "rejected" &&
            submissionData?.reason !== "duplicated" ? (
              <h1
                onClick={edit}
                className="flex cursor-pointer items-center justify-center space-x-1 text-center text-gray-600 hover:text-blue-600 hover:underline"
              >
                <PencilIcon className="h-4 w-4" />
                <span>แก้ไขแบบฟอร์ม</span>
              </h1>
            ) : (
              <>
                <h1
                  onClick={() => {
                    downloadImg(
                      submissionData?.ticketData.fs.firstname,
                      submissionData?.ticketData.fs.lastname,
                      "student",
                      "1",
                      submissionData?.id
                    )
                  }}
                  className="mt-2 flex cursor-pointer items-center justify-center space-x-1 text-center text-gray-600 hover:text-blue-600 hover:underline"
                >
                  <ArrowDownTrayIcon
                    stroke={"currentColor"}
                    strokeWidth={0.3}
                    className="-mt-[2px] h-4 w-4"
                  />
                  <span>รับบัตรเข้างาน นักเรียนคนที่ 1</span>
                </h1>
                <h1
                  onClick={() => {
                    downloadImg(
                      submissionData?.ticketData.ss.firstname,
                      submissionData?.ticketData.ss.lastname,
                      "student",
                      "1",
                      submissionData?.id
                    )
                  }}
                  className="flex cursor-pointer items-center justify-center space-x-1 text-center text-gray-600 hover:text-blue-600 hover:underline"
                >
                  <ArrowDownTrayIcon
                    stroke={"currentColor"}
                    strokeWidth={0.3}
                    className="-mt-[2px] h-4 w-4"
                  />
                  <span>รับบัตรเข้างาน นักเรียนคนที่ 2</span>
                </h1>
                <h1
                  onClick={() => {
                    downloadImg(
                      submissionData?.ticketData.teacher.firstname,
                      submissionData?.ticketData.teacher.lastname,
                      "teacher",
                      "5",
                      submissionData?.id
                    )
                  }}
                  className="flex cursor-pointer items-center justify-center space-x-1 text-center text-gray-600 hover:text-blue-600 hover:underline"
                >
                  <ArrowDownTrayIcon
                    stroke={"currentColor"}
                    strokeWidth={0.3}
                    className="-mt-[2px] h-4 w-4"
                  />
                  <span>รับบัตรเข้างาน ครูที่ปรึกษา</span>
                </h1>
              </>
            )}
          </div>
        </div>
        <p className="mt-2 text-center text-sm leading-[17px] text-gray-500">
          การสมัครจะถือว่าเสร็จสิ้นโดยสมบูรณ์ก็ต่อเมื่อระบบแสดงสถานะเป็น{" "}
          <span className="text-green-600">ตรวจสอบแล้ว</span>{" "}
          หากใบสมัครถูกปฏิเสธจะแสดงสถานะ{" "}
          <span className="text-red-500">ถูกปฏิเสธ</span>{" "}
          ถ้าผู้สมัครได้รับสถานะนี้ ผู้สมัครจะต้องแก้ไขแบบฟอร์มโดยกดที่ข้อความ
          แก้ไขแบบฟอร์ม ในกล่องแสดงสถานะ
          หากมีข้อสงสัยเพิ่มเติมสามารถสอบถามรายละเอียดเพิ่มเติมตามช่องทางติดต่อที่ระบุไว้
        </p>
      </div>
    </div>
  )
}

export default Page
