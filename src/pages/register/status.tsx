import Router from "next/router"
import { useCallback, useState } from "react"

import { StatusActionStrip } from "@/components/buttons/StatusActionStrip"
import { StatusBoxDescription } from "@/components/buttons/StatusBoxDescription"
import { FormsHeading } from "@/components/texts/static/group/FormsHeading"
import { StatusDescription } from "@/components/texts/static/StatusDescription"
import { BluringCurtainContainer } from "@/components/wrapper/BluringCurtain"
import { useFirebaseAuth } from "@/contexts/firebaseAuth"
import { useFireStore } from "@/contexts/firestore"
import { checkSubmitStatusWatchableFactory } from "@/factories/watchables/status/checkSubmitStatusFactory"
import { useFetcher } from "@/hooks/useFetcher"
import { useWatcher } from "@/hooks/useWatcher"
import type { SubmitStatus } from "@/types/firestore/SubmitStatus"

const Page = () => {
  const { signOut } = useFirebaseAuth()
  const { getSubmitStatus } = useFireStore()
  const [imgLoading, setImgLoading] = useState(false)
  const [submissionData, setSD] = useState<SubmitStatus | null>(null)

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

  const checkSubmitStatus = checkSubmitStatusWatchableFactory(
    getSubmitStatus,
    setSD
  )
  const [checkStatus, loading] = useWatcher(checkSubmitStatus, false)
  useFetcher(checkStatus, true, () => {
    Router.push("/register")
  })

  return (
    <div className="font-noto-sans-thai py-16 text-gray-900">
      <BluringCurtainContainer hide={loading || imgLoading}>
        {imgLoading && (
          <>
            <h1 className="animate-pulse text-xl">กำลังสร้างบัตรเข้าร่วมงาน</h1>
            <p className="text-gray-500">กรุณารอสักครู่...</p>
          </>
        )}
      </BluringCurtainContainer>
      <div className="mx-auto flex w-full max-w-lg flex-col px-6 sm:max-w-2xl">
        <div>
          <FormsHeading />
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
            <StatusBoxDescription submissionData={submissionData} />
            <StatusActionStrip
              submissionData={submissionData}
              setImgLoading={setImgLoading}
            />
          </div>
        </div>
        <StatusDescription />
      </div>
    </div>
  )
}

export default Page
