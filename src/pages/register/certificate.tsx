import { DocumentTextIcon } from "@heroicons/react/24/outline"
import fontKit from "@pdf-lib/fontkit"
import Router from "next/router"
import { PDFDocument, rgb } from "pdf-lib"
import { useEffect, useState } from "react"

import { IlluminateButton } from "@/components/buttons/animated/illuminated"
import { BluringCurtain } from "@/components/wrapper/BluringCurtain"
import { useFireStore } from "@/contexts/firestore"
import { checkSubmitStatusWatchableFactory } from "@/factories/watchables/status/checkSubmitStatusFactory"
import { useFetcher } from "@/hooks/useFetcher"
import { useWatcher } from "@/hooks/useWatcher"
import type { SubmitStatus } from "@/types/firestore/SubmitStatus"
import { translateFromEng } from "@/utils/fixedSelection"
import { downloadBlob, loadFileUrl, textObjectFactory } from "@/utils/pdf"

const Page = () => {
  const { getSubmitStatus } = useFireStore()
  const [submissionData, setSD] = useState<SubmitStatus | null>(null)

  const checkSubmitStatus = checkSubmitStatusWatchableFactory(
    getSubmitStatus,
    setSD
  )
  const [checkStatus, loading] = useWatcher(checkSubmitStatus, false)

  useFetcher(checkStatus, true, () => {
    Router.push("/register")
  })

  useEffect(() => {
    if (submissionData?.status) {
      if (submissionData?.status !== "accepted") {
        Router.push("/register/status")
      }
    }
  }, [submissionData])

  async function generateCert(
    nameStr: string,
    schoolStr: string,
    subject: string,
    variant: string
  ) {
    const COLOR_BLUE = rgb(43 / 256, 78 / 256, 118 / 256)
    const COLOR_BLACK = rgb(0, 0, 0)
    const template = await loadFileUrl(
      "https://tumso.triam.cc/templates/cert-template.pdf"
    )
    const pdfDoc = await PDFDocument.load(template)

    await pdfDoc.registerFontkit(fontKit)
    const font = await loadFileUrl(
      "https://tumso.triam.cc/templates/NotoSansThai-SemiBold.ttf"
    )
    const notoSansFont = await pdfDoc.embedFont(font, { subset: true })

    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    if (!firstPage) return

    const { create, drawCenteredText } = textObjectFactory(
      notoSansFont,
      firstPage,
      14
    )

    const name = create(nameStr)
    const school = create(schoolStr)
    let prize
    switch (variant) {
      case "1":
        prize = "ได้รับรางวัลชนะเลิศ"
        break
      case "2":
        prize = "ได้รับรางวัลรองชนะเลิศ"
        break
      case "3":
        prize = "ได้รับรางวัลรองชนะเลิศลำดับที่ 2"
        break
      default:
        prize = "ได้รับรางวัลชมเชย"
    }
    const description = create(`${prize} สาขา${translateFromEng(subject)}`)

    drawCenteredText(name, 234, COLOR_BLUE)
    drawCenteredText(school, 256, COLOR_BLUE)

    drawCenteredText(description, 310, COLOR_BLACK)

    const pdfBytes = await pdfDoc.save()
    downloadBlob(pdfBytes, "test.pdf", "application/pdf")
  }

  return (
    <div className="font-noto-sans-thai text-gray-800">
      <BluringCurtain hide={loading} />
      <div className="mx-auto flex max-w-[800px] flex-col items-center py-14 px-6">
        <h1 className="text-center text-2xl font-semibold">
          ดาวน์โหลดใบประกาศ
        </h1>
        <p className="mb-6 max-w-[540px] text-center text-gray-600">
          ดาวน์โหลดเกียรติบัตรสำหรับผู้เข้าร่วมแข่งขัน
          หากพบเกียรติบัตรสะกดชื่อผู้แข่งขันหรือชื่อโรงเรียนไม่ถูกต้อง
          สามารถติดต่อเพื่อขอแก้ไขได้ตามช่องทางการติดต่อ
        </p>
        <div className="flex flex-col space-y-2 rounded-lg border border-gray-500 py-2 px-4">
          <div className="flex min-w-[280px] flex-col items-center rounded-lg border border-gray-400 p-2">
            <h1 className="text-lg font-semibold">
              เกียรติบัตรของนักเรียนคนที่ 1
            </h1>
            <h1 className="mb-2 text-gray-600">
              <span>ผู้สมัคร</span> {submissionData?.ticketData.fs.firstname}{" "}
              {submissionData?.ticketData.fs.lastname}
            </h1>
            <IlluminateButton
              action={() => {
                generateCert(
                  `${submissionData?.ticketData.fs.title}${submissionData?.ticketData.fs.firstname} ${submissionData?.ticketData.fs.lastname}`,
                  submissionData?.ticketData.school,
                  submissionData?.ticketData.subject,
                  submissionData?.ticketData.prize
                )
              }}
            >
              <div className="flex items-center space-x-1">
                <DocumentTextIcon className="-mt-[2px] h-4 w-4" />
                <span>Download</span>
              </div>
            </IlluminateButton>
          </div>
          <div className="flex min-w-[320px] flex-col items-center rounded-lg border border-gray-400 p-2">
            <h1 className="text-lg font-semibold">
              เกียรติบัตรของนักเรียนคนที่ 2
            </h1>
            <h1 className="mb-2 text-gray-600">
              <span>ผู้สมัคร</span> {submissionData?.ticketData.ss.firstname}{" "}
              {submissionData?.ticketData.ss.lastname}
            </h1>
            <IlluminateButton
              action={() => {
                generateCert(
                  `${submissionData?.ticketData.ss.title}${submissionData?.ticketData.ss.firstname} ${submissionData?.ticketData.ss.lastname}`,
                  submissionData?.ticketData.school,
                  submissionData?.ticketData.subject,
                  submissionData?.ticketData.prize
                )
              }}
            >
              <div className="flex items-center space-x-1">
                <DocumentTextIcon className="-mt-[2px] h-4 w-4" />
                <span>Download</span>
              </div>
            </IlluminateButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
