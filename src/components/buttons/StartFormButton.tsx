import type { Dispatch, FC } from "react"

import { IlluminateButton } from "@/components/buttons/animated/illuminated"
import { useFirebaseAuth } from "@/contexts/firebaseAuth"
import { useRegister } from "@/contexts/RegisterContext"
import { useTimer } from "@/hooks/useTimer"

export const StartFormButton: FC<{
  byPass: boolean | undefined
  setShowLogin: Dispatch<boolean>
}> = ({ byPass, setShowLogin }) => {
  const { user, signOut } = useFirebaseAuth()
  const { isClosed } = useTimer()
  const { section } = useRegister()

  return user.isLoggedIn() && isClosed(false) ? (
    <div className="flex flex-col items-center">
      <p className="mb-2 max-w-[400px] text-center text-sm text-red-400">
        ขณะนี้ระบบได้ปิดรับผู้สมัครแล้ว
        หากต้องการตรวจสอบสถานะของใบสมัครที่ส่งไปแล้ว
        <span className="font-medium">
          ให้เข้าสู่ระบบใหม่ด้วยอีเมลที่เคยใช้ในการสมัคร
        </span>
      </p>
      <IlluminateButton
        action={() => {
          signOut()
        }}
      >
        <span>ออกจากระบบ</span>
      </IlluminateButton>
    </div>
  ) : (
    <IlluminateButton
      action={() => {
        if (user.isLoggedIn()) {
          if (isClosed(byPass)) return
          section.set("student")
          return
        }
        setShowLogin(true)
      }}
    >
      <span>เริ่มกรอกฟอร์ม</span>
    </IlluminateButton>
  )
}
