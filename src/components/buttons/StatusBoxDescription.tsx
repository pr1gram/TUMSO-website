import type { FC } from "react"

import type { SubmitStatus } from "@/types/firestore/SubmitStatus"
import { parseTimestamp } from "@/utils/time"

export const StatusBoxDescription: FC<{
  submissionData: SubmitStatus | null
}> = ({ submissionData }) => {
  return submissionData?.status === "rejected" ? (
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
  )
}
