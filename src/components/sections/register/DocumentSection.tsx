import { Timestamp } from "@firebase/firestore"
import { EyeIcon } from "@heroicons/react/20/solid"
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
  TrashIcon
} from "@heroicons/react/24/solid"
import { motion } from "framer-motion"
import { useEffect, useRef } from "react"

import { IlluminateButton } from "@/components/buttons/animated/illuminated"
import { useFireStore } from "@/contexts/firestore"
import { useRegister } from "@/contexts/RegisterContext"

export const DocumentSection = () => {
  const { Updater, Storage } = useRegister()
  const { uploadDocument, getDocumentLink } = useFireStore()
  const inputRef = useRef(null)
  const newPageRef = useRef(null)

  const upload = async (files: FileList | null) => {
    if (!files) return
    const file = files[0]
    if (!file) return
    const path = await uploadDocument.call(file)
    if (path) {
      Storage.updateSection("document", {
        filePath: path.path,
        date: Timestamp.now()
      })
    }
  }

  const openFile = async () => {
    if (!Storage.data.document?.filePath) return
    const url = await getDocumentLink(Storage.data.document?.filePath)
    if (url) {
      if (newPageRef.current) {
        // @ts-ignore
        const element: HTMLAnchorElement = newPageRef.current
        element.href = url
        element.click()
      }
    }
  }

  const deleteFile = async () => {
    Storage.updateSection("document", null)
  }

  useEffect(() => {
    if (Updater.receivedData?.document) {
      Storage.updateSection("document", Updater.receivedData?.document)
    }
  }, [Updater.receivedData?.document?.filePath])

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={
          uploadDocument.status === "pending"
            ? { opacity: 1, display: "block" }
            : { opacity: 0, display: "none" }
        }
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 z-[100] min-h-screen w-full cursor-not-allowed bg-gray-100 bg-opacity-40 backdrop-blur-sm"
      ></motion.div>
      <div className="mt-6">
        <h1 className="text-lg font-medium">เอกสารรับรองสถานภาพผู้เรียน</h1>
        <p className="leading-4 text-gray-500">
          จำเป็นต้องดาวน์โหลดเอกสารเพื่อพิมพ์ลงบนกระดาษขนาด A4
          กรอกข้อมูลให้ครบถ้วนด้วยปากกา
          จากนั้นอัพโหลดขึ้นสู่ระบบพร้อมกับส่งแบบฟอร์ม
        </p>
        <div className="mt-4">
          <a
            href="/documents/forms.pdf"
            download={"หนังสือรับรองสถานภาพ.pdf"}
            className="flex cursor-pointer items-start space-x-1 hover:text-blue-600 hover:underline"
          >
            <ArrowDownTrayIcon
              className="mt-[3px] h-4 w-4"
              stroke={"currentColor"}
              strokeWidth={0.8}
            />
            <span>ดาวน์โหลดเอกสารที่นี่</span>
          </a>
          <h1 className="mt-4">อัพโหลดเอกสาร</h1>
          <p className="mb-2 leading-4 text-gray-500">
            รับเฉพาะไฟล์นามสกุล .pdf เท่านั้น
          </p>
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
        </div>
      </div>
    </div>
  )
}
