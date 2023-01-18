import { EyeIcon } from "@heroicons/react/20/solid"
import {
  ArrowPathIcon,
  ArrowUpTrayIcon,
  TrashIcon
} from "@heroicons/react/24/solid"
import type { FC } from "react"
import { useRef } from "react"

import { IlluminateButton } from "@/components/buttons/animated/illuminated"
import { useFireStore } from "@/contexts/firestore"
import { useRegister } from "@/contexts/RegisterContext"
import type { Callable } from "@/types/callables/Callable"

export const FileInput: FC<{
  upload: Callable<void>
}> = ({ upload }) => {
  // Contexts
  const { Storage } = useRegister()
  const { uploadDocument, getDocumentLink } = useFireStore()

  // Refs
  const inputRef = useRef(null)
  const newPageRef = useRef(null)

  const openFile = async () => {
    if (!Storage.data.document?.filePath) return
    const url = await getDocumentLink(Storage.data.document?.filePath)
    if (url) {
      window.location.href = url
    }
  }

  const deleteFile = async () => {
    Storage.updateSection("document", null)
  }

  return (
    <>
      <input
        type="file"
        accept={".pdf"}
        multiple={false}
        onChange={(event) => {
          upload(event.target.files)
        }}
        className="hidden"
        ref={inputRef}
      />
      <a target="_blank" ref={newPageRef} className="hidden" />
      {Storage.data.document?.filePath ? (
        <div className="flex items-center space-x-2">
          <a
            onClick={openFile}
            className="flex cursor-pointer items-center space-x-2 border-r border-gray-800 pr-2 hover:text-green-600 hover:underline"
          >
            <EyeIcon className="h-4 w-4" /> <span>ตรวจสอบไฟล์</span>
          </a>
          <a
            onClick={deleteFile}
            className="flex cursor-pointer items-center hover:text-red-500"
          >
            <TrashIcon className="h-4 w-4" />
            <span>ลบ</span>
          </a>
        </div>
      ) : (
        <IlluminateButton
          action={() => {
            if (inputRef.current) {
              // @ts-ignore
              inputRef.current.click()
            }
          }}
        >
          <div className="flex items-start space-x-2">
            {uploadDocument.status === "pending" ? (
              <ArrowPathIcon className="mt-[2px] h-[18px] w-[18px] animate-spin" />
            ) : (
              <ArrowUpTrayIcon
                className="mt-[2px] h-[18px] w-[18px]"
                stroke={"currentColor"}
                strokeWidth={0.8}
              />
            )}
            <span>อัพโหลดไฟล์</span>
          </div>
        </IlluminateButton>
      )}
    </>
  )
}
