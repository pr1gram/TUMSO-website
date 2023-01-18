import type { Timestamp } from "@firebase/firestore"
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import { motion } from "framer-motion"
import Link from "next/link"
import Router from "next/router"
import hash from "object-hash"
import type { FC } from "react"
import { useEffect, useState } from "react"

import { DocumentSection } from "@/components/sections/register/DocumentSection"
import { SelectionSection } from "@/components/sections/register/SelectionSection"
import { StudentSection } from "@/components/sections/register/StudentSection"
import { TeacherSection } from "@/components/sections/register/TeacherSection"
import { useAdminControl } from "@/contexts/admin"
import { useFirebaseAuth } from "@/contexts/firebaseAuth"
import { useFireStore } from "@/contexts/firestore"
import { RegisterProvider, useRegister } from "@/contexts/RegisterContext"
import type { FormData } from "@/types/register/form/FormData"

export const SectionContainer: FC<{ id: string | undefined }> = ({ id }) => {
  const { section, Storage, Updater } = useRegister()
  const { signOut, user } = useFirebaseAuth()
  const { getDocumentLink } = useFireStore()
  const { loadFormData } = useAdminControl()
  const [lastSave, setLastSave] = useState<Timestamp | null>(null)
  const [lastDataHash, setLastDataHash] = useState<string>("")
  const [savingStatus, setSavingStatus] = useState("resolved")
  const [loadingData, setLoadingData] = useState(false)
  const [recheckTimeout, setRecheckTimout] = useState(setTimeout(() => {}, 100))
  const [hasDiffrence, setHD] = useState(false)
  const [doclink, setDoc] = useState("")

  const checkHash = (lastHash?: string) => {
    if (!lastHash) {
      if (!lastDataHash) return
    }
    const objHash = hash.sha1(Storage.data)
    if (lastHash ? objHash !== lastHash : objHash !== lastDataHash) {
      setHD(true)
    } else {
      setHD(false)
    }
  }

  const saveData = async () => {}

  useEffect(() => {
    clearTimeout(recheckTimeout)
    const to = setTimeout(() => {
      checkHash()
    }, 1000)
    setRecheckTimout(to)
  }, [Storage.storageDep, lastDataHash])

  useEffect(() => {
    if (!user.isLoggedIn()) {
      section.set("landing")
    }
  }, [user.isLoggedIn(), section])

  const getData = async () => {
    if (!id) return
    setLoadingData(true)
    const data = await loadFormData(id)
    if (data) {
      Updater.setReceivedData(data.stored as FormData)
      setLastSave(data.timestamp)
      setLastDataHash(data.checksum)
      const dlink = await getDocumentLink(data.stored.document.filePath)
      setDoc(dlink || "")
    }
    setLoadingData(false)
  }

  useEffect(() => {
    if (user.isLoggedIn() === false) {
      Router.push("/register")
      return
    }
    getData()
  }, [id, user])

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={
          loadingData
            ? { opacity: 1, display: "block" }
            : { opacity: 0, display: "none" }
        }
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 z-[100] min-h-screen w-full cursor-not-allowed bg-gray-100 bg-opacity-40 backdrop-blur-sm"
      ></motion.div>
      <StudentSection />
      <TeacherSection />
      <SelectionSection />
      <DocumentSection save={saveData} disabled={true} />
      <div className="mt-4 border-t border-gray-600 pt-6">
        <h1 className="text-xl font-semibold">Document Preview</h1>
        {doclink && (
          <embed
            className="mt-2 h-[800px] w-full rounded-lg border border-gray-400 p-1"
            src={doclink}
          />
        )}
      </div>
    </div>
  )
}

const Page = ({ query }: any) => {
  return (
    <div className="font-noto-sans-thai py-16 text-gray-900">
      <div className="mx-auto flex w-full max-w-lg flex-col px-6 sm:max-w-2xl">
        <Link
          href="/register/status"
          className="mb-1 flex items-center space-x-1 text-gray-500 hover:underline"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>ย้อนกลับ</span>
        </Link>
        <h1 className="text-2xl font-bold">ตรวจสอบแบบฟอร์ม</h1>
        <p className="text-red-400">
          หน้านี้มีไว้สำหรับตรวจสอบแบบฟอร์มที่ส่งไปแล้วเท่านั้น
          ผู้สมัครไม่สามารถแก้ไขข้อมูลหลังส่งฟอร์มไปแล้วได้
        </p>
        <div className="relative">
          <div className="absolute z-[40] h-full w-full cursor-help overflow-hidden">
            {[...Array(24)].map((e, k) => (
              <h1
                key={`eed-${k}`}
                className="mb-24 -ml-6 rotate-[30deg] whitespace-nowrap text-3xl font-bold text-gray-600 text-opacity-20"
              >
                <span className={k % 2 === 0 ? "mr-16" : "mr-10"}>
                  สำหรับตรวจสอบเท่านั้น
                </span>{" "}
                <span>สำหรับตรวจสอบเท่านั้น</span>
              </h1>
            ))}
          </div>
          <RegisterProvider>
            <SectionContainer id={query.id} />
          </RegisterProvider>
        </div>
      </div>
    </div>
  )
}

Page.getInitialProps = async ({ query }: any) => {
  return { query }
}

export default Page
