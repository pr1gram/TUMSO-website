import Router from "next/router"
import { useEffect } from "react"

import { SectionContainer } from "@/components/sections/register/SectionContainer"
import { useFirebaseAuth } from "@/contexts/firebaseAuth"
import { useFireStore } from "@/contexts/firestore"
import { RegisterProvider } from "@/contexts/RegisterContext"

const Page = ({ query }: any) => {
  const { user } = useFirebaseAuth()
  const { getSubmitStatus } = useFireStore()

  useEffect(() => {
    const check = async () => {
      const submit = await getSubmitStatus()
      if (submit) {
        if (submit.status !== "editing") {
          Router.push("/register/status")
        }
      }
    }

    if (user.uid) {
      check()
    }
  }, [user.uid])

  return (
    <div className="font-noto-sans-thai py-16 text-gray-900">
      <div className="mx-auto flex w-full max-w-lg flex-col px-6 sm:max-w-2xl">
        <div>
          <h1 className="text-2xl font-semibold">ลงทะเบียนสมัครแข่งขัน</h1>
          <h1 className="mt-1 font-medium leading-4 text-gray-600">
            หมดเขตรับสมัคร:{" "}
            <span className="text-gray-800">8 มกราคม 2565 เวลา 18.30 น.</span>
          </h1>
          <p className="text-gray-600">
            ขอความร่วมมือผู้สมัคร
            <span className="font-medium text-red-400">
              อ่านคำแนะนำก่อนเริ่มการสมัครอย่างละเอียด
            </span>
            ก่อนเริ่มกรอกใบสมัคร
          </p>
        </div>
        <RegisterProvider>
          <SectionContainer query={query} />
        </RegisterProvider>
      </div>
    </div>
  )
}

Page.getInitialProps = async ({ query }: any) => {
  return { query }
}

export default Page
