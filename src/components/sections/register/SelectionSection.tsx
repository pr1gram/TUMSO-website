import { useEffect, useState } from "react"

import { SelectionInput } from "@/components/inputs/SelectionInput"
import { useRegister } from "@/contexts/RegisterContext"
import {
  availableSelection,
  subjectValidator,
  translateFromEng,
  translateToEng
} from "@/utils/fixedSelection"

export const SelectionSection = () => {
  const { Storage, Updater } = useRegister()

  const [select, setSelect] = useState<string | null>(null)

  useEffect(() => {
    if (select) {
      Storage.updateSection("selection", {
        subject: translateToEng(select)
      })
    }
  }, [select])

  return (
    <div>
      <div className="mt-6">
        <h1 className="text-lg font-medium">เลือกวิชาที่ลงสมัคร</h1>
        <p className="leading-4 text-gray-500">เลือกได้เพียง 1 สาขาเท่านั้น</p>
        <div className="mt-4">
          <div className="flex">
            <SelectionInput
              title={"วิชาที่ลงสมัคร"}
              options={availableSelection}
              required={true}
              placeholder={"เลือกวิชาที่ต้องการสมัคร"}
              updateState={setSelect}
              valueValidator={subjectValidator}
              value={select}
              externalValue={
                Updater.receivedData?.selection.subject === undefined
                  ? undefined
                  : translateFromEng(Updater.receivedData?.selection.subject)
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
