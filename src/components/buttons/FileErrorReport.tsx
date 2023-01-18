import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import type { FC } from "react"

export const FileErrorReport: FC<{
  invalidSize: boolean
  invalidType: boolean
}> = ({ invalidSize, invalidType }) => {
  return (
    <div className="mt-1">
      {invalidSize && (
        <div className="flex items-center space-x-1 text-red-400">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <span className="text-sm">ไฟล์มีขนาดใหญ่เกินกว่า 10 MB</span>
        </div>
      )}
      {invalidType && (
        <div className="flex items-center space-x-1 text-red-400">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <span className="text-sm">ประเภทไฟล์ไม่ถูกต้อง</span>
        </div>
      )}
    </div>
  )
}
