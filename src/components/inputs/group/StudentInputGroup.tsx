import type { Dispatch, FC } from "react"
import { useEffect, useState } from "react"

import { SelectionInput } from "@/components/inputs/SelectionInput"
import { ShortTextInput } from "@/components/inputs/ShortTextInput"
import type { StudentInputGroupData } from "@/types/register/form/StudentInputGroupData"
import {
  emailValidator,
  emptyStringValidator,
  generateIncludeValidator,
  phoneNumberValidator
} from "@/utils/validators"

export const StudentInputGroup: FC<{
  updateState: Dispatch<StudentInputGroupData>
  valueContainer?: StudentInputGroupData
}> = ({ updateState, valueContainer }) => {
  const [fname, setFname] = useState("")
  const [lname, setLname] = useState("")
  const [title, setTitle] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  useEffect(() => {
    updateState({
      title: title || "",
      firstname: fname,
      lastname: lname,
      email,
      phone
    })
  }, [fname, lname, title, email, phone])

  const availableTitles = ["ด.ช.", "ด.ญ.", "นาย", "น.ส."]
  const titleValidator = generateIncludeValidator(availableTitles)
  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div className="max-w-[156px] shrink-0 sm:max-w-none">
          <SelectionInput
            title={"คำนำหน้า"}
            options={availableTitles}
            required={true}
            placeholder={"เลือกคำนำหน้า"}
            updateState={setTitle}
            valueValidator={titleValidator}
            value={title}
            externalValue={valueContainer?.title}
          />
        </div>
        <div className="flex flex-wrap items-center space-y-1 xs:space-y-0 sm:flex-row sm:flex-nowrap">
          <div className="min-w-[170px] grow xs:mr-4 sm:shrink">
            <ShortTextInput
              title={
                <span>
                  ชื่อ{" "}
                  <span className="text-gray-600">(ไม่ต้องระบุคำนำหน้า)</span>
                </span>
              }
              updateState={setFname}
              placeholder={"ชื่อ"}
              valueValidator={emptyStringValidator}
              required={true}
              value={valueContainer?.firstname}
            />
          </div>
          <div className="shrink-0 grow">
            <ShortTextInput
              title={
                <span>
                  นามสกุล{" "}
                  <span className="text-gray-600">
                    (หากมีชื่อกลางให้ระบุในช่องนี้)
                  </span>
                </span>
              }
              updateState={setLname}
              placeholder={"นามสกุล"}
              valueValidator={emptyStringValidator}
              required={true}
              value={valueContainer?.lastname}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4">
        <ShortTextInput
          title={"อีเมล"}
          updateState={setEmail}
          type={"email"}
          placeholder={"อีเมล"}
          valueValidator={emailValidator}
          required={true}
          value={valueContainer?.email}
        />
        <div className="max-w-[200px] xs:max-w-none">
          <ShortTextInput
            title={"เบอร์โทรศัพท์"}
            updateState={setPhone}
            blockedChar={["-", " "]}
            valueValidator={phoneNumberValidator}
            placeholder={"ตัวอย่าง 08XXXXXXXX"}
            required={true}
            value={valueContainer?.phone}
          />
        </div>
      </div>
    </div>
  )
}
