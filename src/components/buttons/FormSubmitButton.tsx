import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import { motion } from "framer-motion"
import type { FC } from "react"
import { useState } from "react"

import { IlluminateButton } from "@/components/buttons/animated/illuminated"
import { Checkbox } from "@/components/inputs/Checkbox"
import { useRegister } from "@/contexts/RegisterContext"
import type { Callable } from "@/types/callables/Callable"

export const FormSubmitButton: FC<{ submitForm: Callable<void> }> = ({
  submitForm
}) => {
  const { section } = useRegister()

  // States
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="mt-6 flex flex-col items-center border-t border-gray-900 border-opacity-50 pt-5">
      <div className="relative w-max">
        <motion.div
          animate={
            confirmed ? { opacity: 0, zIndex: -10 } : { opacity: 1, zIndex: 10 }
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
  )
}
