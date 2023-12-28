import type { Timestamp } from "@firebase/firestore"
import { motion } from "framer-motion"
import Link from "next/link"
import Router from "next/router"
import hash from "object-hash"
import type { FC } from "react"
import { useEffect, useState } from "react"

import { IlluminateButton } from "@/components/buttons/animated/illuminated"
import { ShortTextInput } from "@/components/inputs/ShortTextInput"
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
    if (
      user.uid !== undefined &&
      user.uid !== "Di08jZL2aTOt31AUjX34FGZyIjv1" &&
      user.uid !== "y8zkDnTgDddHLxGbzOKyFYEIs5H3"
    ) {
      Router.push("/register")
    }
  }, [user.uid])

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
  const { user } = useFirebaseAuth()
  const { updateStatus } = useAdminControl()
  const [reason, setReason] = useState("")
  const updateAStatus = async (type: string) => {
    if (!query.id) return
    const r = await updateStatus(type, query.id, reason)
    if (r) {
      Router.push("/register/admin")
    }
  }

  useEffect(() => {
    if (
      user.uid !== undefined &&
      user.uid !== "Di08jZL2aTOt31AUjX34FGZyIjv1" &&
      user.uid !== "y8zkDnTgDddHLxGbzOKyFYEIs5H3" &&
      user.uid !== "eMvEAdtlmCS3wHMZ2TjcctdLiCu2"
    ) {
      Router.push("/register")
    }
  }, [user.uid])
  return (
    <div className="font-noto-sans-thai py-16 text-gray-900">
      <div className="mx-auto flex w-full max-w-lg flex-col px-6 sm:max-w-2xl">
        <h1 className="text-xl font-bold">Forms Preview</h1>
        <Link href="/register/admin" className="text-gray-500 hover:underline">
          ย้อนกลับ
        </Link>
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
        <h1 className="mt-6 text-xl font-semibold">Update the status</h1>
        <div className="mt-4 flex justify-center space-x-4">
          <IlluminateButton
            action={() => {
              updateAStatus("accepted")
            }}
          >
            Accept
          </IlluminateButton>
          <div className="flex flex-col space-y-2">
            <IlluminateButton
              action={() => {
                updateAStatus("rejected")
              }}
            >
              Reject
            </IlluminateButton>
            <div>
              <ShortTextInput
                placeholder={"Reason"}
                valueValidator={() => true}
                required={true}
                updateState={setReason}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Page.getInitialProps = async ({ query }: any) => {
  return { query }
}

export default Page
