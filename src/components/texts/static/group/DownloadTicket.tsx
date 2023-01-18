import { ArrowDownTrayIcon } from "@heroicons/react/20/solid"
import InApp from "detect-inapp"
import type { Dispatch, FC } from "react"

import type { SubmitStatus } from "@/types/firestore/SubmitStatus"

export const DownloadTicket: FC<{
  submissionData: SubmitStatus | null
  setImgLoading: Dispatch<boolean>
}> = ({ submissionData, setImgLoading }) => {
  const downloadImg = async (
    firstname: string,
    lastname: string,
    status: string,
    type: string,
    id?: string
  ) => {
    if (!id) return

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

  return (
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
  )
}
