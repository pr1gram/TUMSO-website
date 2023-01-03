import { Timestamp } from "@firebase/firestore"
import {
  CheckIcon,
  ExclamationCircleIcon,
  EyeIcon
} from "@heroicons/react/20/solid"
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
  ExclamationTriangleIcon,
  TrashIcon
} from "@heroicons/react/24/solid"
import { motion } from "framer-motion"
import Router from "next/router"
import type { FC } from "react"
import { useEffect, useRef, useState } from "react"

import { ExpandableBadge } from "@/components/buttons/animated/ExpandableBadge"
import { IlluminateButton } from "@/components/buttons/animated/illuminated"
import { Checkbox } from "@/components/inputs/Checkbox"
import { useFireStore } from "@/contexts/firestore"
import { useRegister } from "@/contexts/RegisterContext"
import { documentValidator } from "@/utils/validators"

export const DocumentSection: FC<{
  save: () => Promise<void>
  disabled?: boolean
}> = ({ save, disabled }) => {
  const { Updater, Storage, section } = useRegister()
  const { uploadDocument, getDocumentLink, submitForms } = useFireStore()
  const [confirmed, setConfirmed] = useState(false)
  const inputRef = useRef(null)
  const newPageRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [invalidType, setInvalidType] = useState(false)
  const [invalidSize, setInvalidSize] = useState(false)

  const upload = async (files: FileList | null) => {
    setInvalidType(false)
    setInvalidSize(false)
    if (!files) return
    const file = files[0]
    if (!file) return
    if (file.type !== "application/pdf") {
      setInvalidType(true)
      return
    }
    if (file.size > 10000000) {
      setInvalidSize(true)
      return
    }
    const path = await uploadDocument.call(file)
    if (path) {
      Storage.updateSection("document", {
        filePath: path.path,
        date: Timestamp.now().seconds
      })
      save()
    }
  }

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

  useEffect(() => {
    if (Updater.receivedData?.document) {
      Storage.updateSection("document", Updater.receivedData?.document)
    }
  }, [Updater.receivedData?.document?.filePath])

  const submitForm = async () => {
    if (!Storage.data) return
    setLoading(true)
    const response = await submitForms(Storage.data)
    if (response) {
      Router.push("/register/status")
    }
    setLoading(false)
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={
          uploadDocument.status === "pending" || loading
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
            href="/documents/forms-latest.pdf"
            download={"หนังสือรับรองสถานภาพ.pdf"}
            target="_blank"
            className="flex cursor-pointer items-start space-x-1 hover:text-blue-600 hover:underline"
          >
            <ArrowDownTrayIcon
              className="mt-[3px] h-4 w-4"
              stroke={"currentColor"}
              strokeWidth={0.8}
            />
            <span>ดาวน์โหลดเอกสารที่นี่</span>
          </a>
          <div className="relative mt-4 flex items-center space-x-1">
            <h1 className="">อัพโหลดเอกสาร</h1>
            <div className="relative z-[25] flex items-center">
              <ExpandableBadge
                title={"Required"}
                description={"ผู้สมัครจำเป็นต้องกรอกข้อมูลนี้"}
                hidden={documentValidator(Storage.data.document)}
              >
                <ExclamationCircleIcon className="relative z-[23] ml-[1px] mt-[1px] h-3.5 w-3.5 text-white" />
              </ExpandableBadge>
              <motion.div
                animate={
                  !documentValidator(Storage.data.document)
                    ? { display: "hidden", opacity: 0 }
                    : { display: "block", opacity: 1 }
                }
                transition={{ type: "tween", duration: 0.15 }}
                className="absolute top-0 right-0"
              >
                <CheckIcon
                  className="relative z-[23] h-4 w-4 text-green-500"
                  stroke="currentColor"
                  strokeWidth={1}
                />
              </motion.div>
            </div>
          </div>
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
        </div>
      </div>
      {disabled !== true && (
        <div className="mt-6 flex flex-col items-center border-t border-gray-900 border-opacity-50 pt-5">
          <div className="relative w-max">
            <motion.div
              animate={
                confirmed
                  ? { opacity: 0, zIndex: -10 }
                  : { opacity: 1, zIndex: 10 }
              }
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute top-0 left-0 z-[10] h-full w-full cursor-not-allowed rounded-md bg-gray-400 bg-opacity-25 backdrop-blur-[1px]"
            />
            <IlluminateButton action={submitForm}>
              <h1>ส่งฟอร์ม</h1>
            </IlluminateButton>
          </div>
          {!section.validation.getAll ? (
            <div className="mt-1 ml-2 flex items-center space-x-1 text-red-400">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <span className="text-sm">กรุณากรอกข้อมูลให้ครบถ้วน</span>
            </div>
          ) : (
            <div className="mt-2 flex items-center space-x-2">
              <Checkbox updateState={setConfirmed} />
              <h1 className="underline">ข้าพเจ้าได้ตรวจสอบข้อมูลทั้งหมดแล้ว</h1>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
