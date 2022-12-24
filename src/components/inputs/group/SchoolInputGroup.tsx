import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/20/solid"
import { motion } from "framer-motion"
import type { Dispatch, FC } from "react"
import { useEffect, useState } from "react"

import { ExpandableBadge } from "@/components/buttons/animated/ExpandableBadge"
import { Checkbox } from "@/components/inputs/Checkbox"
import { SchoolSearchInput } from "@/components/inputs/SchoolSearchInput"
import { ShortTextInput } from "@/components/inputs/ShortTextInput"
import { useRegister } from "@/contexts/RegisterContext"
import { emptyStringValidator } from "@/utils/validators"

export const SchoolInputGroup: FC<{
  updateState: Dispatch<{ name: string; notListed: boolean }>
}> = ({ updateState }) => {
  const [school, setSchool] = useState("")
  const [notListed, setNotListed] = useState(false)
  const { Updater } = useRegister()

  useEffect(() => {
    updateState({ name: school, notListed })
  }, [school, notListed])

  return (
    <div>
      <h1>
        ชื่อโรงเรียน{" "}
        <span className="text-gray-600">(ค้นหาด้วย 2 ตัวอักษรขึ้นไป)</span>
      </h1>
      <div className="relative flex max-w-[420px] items-center space-x-2">
        <div className="w-full">
          {notListed ? (
            <ShortTextInput
              updateState={setSchool}
              placeholder={"กรุณากรอกชื่อโรงเรียนของท่าน"}
              value={Updater.receivedData?.school.name}
            />
          ) : (
            <SchoolSearchInput
              value={Updater.receivedData?.school.name}
              updateState={setSchool}
            />
          )}
        </div>
        <div className="absolute top-2 left-0 z-[32] flex items-center">
          <ExpandableBadge
            title={"Required"}
            description={"ผู้สมัครจำเป็นต้องกรอกข้อมูลนี้"}
            hidden={emptyStringValidator(school)}
          >
            <ExclamationCircleIcon className="relative z-[12] ml-[1px] mt-[1px] h-3.5 w-3.5 text-white" />
          </ExpandableBadge>
          <motion.div
            animate={
              !emptyStringValidator(school)
                ? { display: "hidden", opacity: 0 }
                : { display: "block", opacity: 1 }
            }
            transition={{ type: "tween", duration: 0.15 }}
            className="absolute top-0 right-0"
          >
            <CheckIcon
              className="relative z-[12] h-4 w-4 text-green-500"
              stroke="currentColor"
              strokeWidth={1}
            />
          </motion.div>
        </div>
      </div>
      <div className="mt-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            updateState={setNotListed}
            externalValue={Updater.receivedData?.school.notListed}
          />
          <span>ไม่พบโรงเรียนในช่องค้นหา</span>
        </div>
      </div>
    </div>
  )
}
