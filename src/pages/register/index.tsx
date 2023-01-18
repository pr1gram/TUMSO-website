import { useState } from "react"

import { SectionContainer } from "@/components/sections/register/SectionContainer"
import { FormsHeading } from "@/components/texts/static/group/FormsHeading"
import { useFireStore } from "@/contexts/firestore"
import { RegisterProvider } from "@/contexts/RegisterContext"
import { checkSubmitStatusFactory } from "@/factories/fetchers/checkSubmitStatusFactory"
import { useAdminRedirect } from "@/hooks/groups/register/useAdminRedirect"
import { useFetcher } from "@/hooks/useFetcher"

const Page = ({ query }: any) => {
  const { getSubmitStatus } = useFireStore()
  const [byPass, setBypass] = useState<boolean | undefined>(undefined)

  const checkSubmitStatus = checkSubmitStatusFactory(getSubmitStatus, setBypass)
  useFetcher(checkSubmitStatus, true)

  useAdminRedirect()

  return (
    <div className="font-noto-sans-thai py-16 text-gray-900">
      <div className="mx-auto flex w-full max-w-lg flex-col px-6 sm:max-w-2xl">
        <FormsHeading />
        <RegisterProvider>
          <SectionContainer query={query} byPass={byPass} />
        </RegisterProvider>
      </div>
    </div>
  )
}

Page.getInitialProps = async ({ query }: any) => {
  return { query }
}

export default Page
