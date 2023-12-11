import { PencilIcon } from "@heroicons/react/20/solid"
import Router from "next/router"
import type { Dispatch, FC } from "react"

import { DownloadCert } from "@/components/texts/static/group/DownloadCert"
import { useFireStore } from "@/contexts/firestore"
import { useTimer } from "@/hooks/useTimer"
import type { SubmitStatus } from "@/types/firestore/SubmitStatus"

export const StatusActionStrip: FC<{
  submissionData: SubmitStatus | null
  setImgLoading: Dispatch<boolean>
}> = ({ submissionData, setImgLoading }) => {
  const { enableEditing } = useFireStore()
  const { isClosed } = useTimer()

  const edit = async () => {
    await enableEditing()
    Router.push("/register?filling")
  }

  // eslint-disable-next-line no-nested-ternary
  return submissionData?.status === "rejected" &&
    submissionData?.reason !== "duplicated" ? (
    <h1
      onClick={() => {}}
      className="flex cursor-not-allowed items-center justify-center space-x-1 text-center text-gray-600"
    >
      <PencilIcon className="h-4 w-4" />
      <span>แก้ไขแบบฟอร์ม</span>
    </h1>
  ) : isClosed(false) ? (
    <DownloadCert />
  ) : (
    <></>
  )
}
