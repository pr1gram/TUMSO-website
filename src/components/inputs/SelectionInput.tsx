import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/20/solid"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import classnames from "classnames"
import { motion } from "framer-motion"
import type { Dispatch, FC } from "react"
import { useEffect, useState } from "react"

import { ExpandableBadge } from "@/components/buttons/animated/ExpandableBadge"

export const SelectionInput: FC<{
  options: string[]
  required: boolean
  title: string
  placeholder: string
  updateState: Dispatch<string | null>
  valueValidator: (value: string | null) => boolean
  value: string | null
}> = ({
  options,
  required,
  title,
  placeholder,
  updateState,
  valueValidator,
  value
}) => {
  const [selected, setSelected] = useState<string | null>(null)
  const [showall, setShowall] = useState(false)

  useEffect(() => {
    updateState(selected)
    setShowall(false)
  }, [selected])
  return (
    <div className="shrink-0">
      {showall && (
        <div
          onClick={() => {
            setShowall(false)
          }}
          className="fixed top-0 left-0 min-h-screen w-full"
        />
      )}
      <h1>{title}</h1>
      <div className="relative rounded-md border border-gray-500 border-opacity-60 py-1 pl-3 pr-7 outline-none focus:border-[#434894]">
        <div
          onClick={() => {
            setShowall(true)
          }}
          className="flex cursor-pointer items-center text-gray-400"
        >
          <h1 className="">{placeholder}</h1>
          <ChevronDownIcon
            className="ml-1 h-4 w-4"
            stroke={"currentColor"}
            strokeWidth={1.5}
          />
        </div>
        <motion.div
          onClick={() => {
            setShowall(true)
          }}
          initial={{ height: "106%" }}
          animate={{
            height: showall ? `${options.length * 32 + 30}px` : "106%"
          }}
          className={classnames(
            !selected && "text-gray-400",
            "absolute top-0 left-0 z-[12] -ml-[1px] -mt-[1px] flex w-[101.5%] cursor-pointer items-center rounded-md border border-gray-500 border-opacity-60 bg-white px-3"
          )}
        >
          <div className="absolute top-0 flex w-full items-center justify-between py-1 pr-10">
            <h1 className="">{selected || placeholder}</h1>
            <motion.div
              animate={{ rotate: showall ? 180 : 0 }}
              className="ml-1 h-4 w-4"
            >
              <ChevronDownIcon stroke={"currentColor"} strokeWidth={1.5} />
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{
            clipPath: showall ? "inset(0 0 0.1% 0)" : "inset(0 0 100% 0)"
          }}
          className="absolute left-0 z-[13] -mx-[1px] w-[101.5%] rounded-b-md"
        >
          {options.map((v, k) => {
            return (
              <div
                onClick={() => {
                  setSelected(v)
                }}
                key={`option-${k}-${title}`}
                className={classnames(
                  k === options.length - 1 && "rounded-b-md",
                  "border-x border-gray-400 border-opacity-100 px-4 py-1",
                  v === selected
                    ? "bg-gray-200"
                    : "cursor-pointer hover:bg-gray-100"
                )}
              >
                <h1>{v}</h1>
              </div>
            )
          })}
        </motion.div>
        <div className="absolute top-0 right-2 flex h-full items-center">
          {required && (
            <ExpandableBadge
              title={"Required"}
              description={"ผู้สมัครจำเป็นต้องกรอกข้อมูลนี้"}
              hidden={valueValidator(value)}
            >
              <ExclamationCircleIcon className="relative z-[12] ml-[1px] mt-[1px] h-3.5 w-3.5 text-white" />
            </ExpandableBadge>
          )}
          <motion.div
            animate={
              !valueValidator(value)
                ? { display: "hidden", opacity: 0 }
                : { display: "block", opacity: 1 }
            }
            transition={{ type: "tween", duration: 0.15 }}
            className="absolute top-[8px] right-0"
          >
            <CheckIcon
              className="relative z-[12] h-4 w-4 text-green-500"
              stroke="currentColor"
              strokeWidth={1}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
