import type { FC } from "react"
import { useState } from "react"

import { ShortTextInput } from "@/components/inputs/ShortTextInput"
import {
  emailValidator,
  emptyStringValidator,
  phoneNumberValidator
} from "@/utils/validators"

export const TeacherInputGroup: FC<{}> = () => {
  const [fname, setFname] = useState("")
  const [lname, setLname] = useState("")
  const [title, setTitle] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div className="shrink">
          <ShortTextInput
            title={<span>คำนำหน้าชื่อ</span>}
            updateState={setFname}
            placeholder={"คำนำหน้าชื่อ"}
            valueValidator={emptyStringValidator}
            required={true}
          />
        </div>
        <div className="shrink-0">
          <ShortTextInput
            title={
              <span>
                ชื่อ <span className="text-gray-600">(ไม่ต้องใส่คำนำหน้า)</span>
              </span>
            }
            updateState={setFname}
            placeholder={"ชื่อ"}
            valueValidator={emptyStringValidator}
            required={true}
          />
        </div>
        <div className="shrink-0">
          <ShortTextInput
            title={
              <span>
                นามสกุล{" "}
                <span className="text-gray-600">
                  (หากมีชื่อกลางให้ใส่ช่องนี้)
                </span>
              </span>
            }
            updateState={setLname}
            placeholder={"นามสกุล"}
            valueValidator={emptyStringValidator}
            required={true}
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <ShortTextInput
          title={"อีเมล"}
          updateState={setEmail}
          type={"email"}
          placeholder={"อีเมล"}
          valueValidator={emailValidator}
          required={true}
        />
        <ShortTextInput
          title={"เบอร์โทรศัพท์"}
          updateState={setPhone}
          blockedChar={["-"]}
          valueValidator={phoneNumberValidator}
          placeholder={"ตัวอย่าง 08XXXXXXXX"}
          required={true}
        />
      </div>
    </div>
  )
}
