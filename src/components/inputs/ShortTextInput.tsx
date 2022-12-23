import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/20/solid"
import { motion } from "framer-motion"
import type { FC, ReactNode } from "react"
import { useEffect, useState } from "react"

import { ExpandableBadge } from "@/components/buttons/animated/ExpandableBadge"

export const ShortTextInput: FC<{
  title?: string | ReactNode
  placeholder?: string
  updateState: (value: string) => void
  required?: boolean
  valueValidator?: (value: string) => boolean
  type?: string
  blockedChar?: string[]
}> = ({
  title,
  placeholder = "",
  updateState,
  required = false,
  valueValidator = () => true,
  type = "text",
  blockedChar = []
}) => {
  const [selfVal, setSelfVal] = useState("")

  useEffect(() => {
    updateState(selfVal)
  }, [selfVal])

  return (
    <div>
      {title && <h1>{title}</h1>}
      <div className="relative">
        <input
          onChange={(event) => {
            if (blockedChar.some((v) => event.target.value.includes(v))) {
              return
            }
            setSelfVal(event.target.value)
          }}
          value={selfVal}
          className="w-full rounded-md border border-gray-500 border-opacity-60 py-1 pl-7 pr-3 outline-none focus:border-[#434894]"
          placeholder={placeholder}
          type={type}
        />
        <div className="absolute top-0 left-2 flex h-full items-center">
          {required && (
            <ExpandableBadge
              title={"Required"}
              description={"ผู้สมัครจำเป็นต้องกรอกข้อมูลนี้"}
              hidden={valueValidator(selfVal)}
            >
              <ExclamationCircleIcon className="relative z-[12] ml-[1px] mt-[1px] h-3.5 w-3.5 text-white" />
            </ExpandableBadge>
          )}
          {required && (
            <motion.div
              animate={
                !valueValidator(selfVal)
                  ? { display: "hidden", opacity: 0 }
                  : { display: "block", opacity: 1 }
              }
              transition={{ type: "tween", duration: 0.15 }}
              className="absolute top-[9px] right-0"
            >
              <CheckIcon
                className="relative z-[12] h-4 w-4 text-green-500"
                stroke="currentColor"
                strokeWidth={1}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
