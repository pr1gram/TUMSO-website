import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/20/solid"
import { motion } from "framer-motion"
import type { FC } from "react"

import { ExpandableBadge } from "@/components/buttons/animated/ExpandableBadge"
import { DownloadFile } from "@/components/buttons/DownloadFile"
import { FileErrorReport } from "@/components/buttons/FileErrorReport"
import { FileInput } from "@/components/buttons/FileInput"
import { FormSubmitButton } from "@/components/buttons/FormSubmitButton"
import { BluringCurtain } from "@/components/wrapper/BluringCurtain"
import { useFireStore } from "@/contexts/firestore"
import { useRegister } from "@/contexts/RegisterContext"
import { submitFormWatchableFactory } from "@/factories/watchables/documentSection/submitFormWatchableFactory"
import { useDataHandlerEffect } from "@/hooks/groups/documentSection/useDataHandlerEffect"
import { useFileUploadHandler } from "@/hooks/groups/documentSection/useFileUploadHandler"
import { useWatcher } from "@/hooks/useWatcher"
import type { Callable } from "@/types/callables/Callable"
import { documentValidator } from "@/utils/validators"

export const DocumentSection: FC<{
  save: Callable<void>
  disabled?: boolean
}> = ({ save, disabled }) => {
  // Contexts
  const { Updater, Storage } = useRegister()
  const { uploadDocument, submitForms } = useFireStore()

  const [invalidType, invalidSize, upload] = useFileUploadHandler(
    save,
    uploadDocument,
    Storage
  )

  // Watchables and effects
  const submitFormWatchable = submitFormWatchableFactory(submitForms, Storage)
  const [submitForm, loading] = useWatcher(submitFormWatchable, false)

  useDataHandlerEffect(Updater, Storage)

  return (
    <div>
      <BluringCurtain hide={uploadDocument.status === "pending" || loading} />
      <div className="mt-6">
        <h1 className="text-lg font-medium">เอกสารรับรองสถานภาพผู้เรียน</h1>
        <p className="leading-4 text-gray-500">
          จำเป็นต้องดาวน์โหลดเอกสารเพื่อพิมพ์ลงบนกระดาษขนาด A4
          กรอกข้อมูลให้ครบถ้วนด้วยปากกา
          จากนั้นอัพโหลดขึ้นสู่ระบบพร้อมกับส่งแบบฟอร์ม
        </p>
        <div className="mt-4">
          <DownloadFile
            text={"ดาวน์โหลดเอกสารที่นี่"}
            path={"/documents/forms-latest.pdf"}
            fileName={"หนังสือรับรองสถานภาพ.pdf"}
          />
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
          <FileInput upload={upload} />
          <FileErrorReport
            invalidSize={invalidSize}
            invalidType={invalidType}
          />
        </div>
      </div>
      {!disabled && <FormSubmitButton submitForm={submitForm} />}
    </div>
  )
}
