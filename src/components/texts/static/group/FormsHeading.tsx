import { useTimer } from "@/hooks/useTimer"
import { pad, THMONTH } from "@/utils/timer"

export const FormsHeading = () => {
  const { close } = useTimer()
  return (
    <div>
      <h1 className="text-2xl font-semibold">ลงทะเบียนสมัครแข่งขัน</h1>
      <h1 className="mt-1 font-medium leading-4 text-gray-600">
        หมดเขตรับสมัคร:{" "}
        <span className="text-red-600">
          {close.getDate()} {THMONTH[close.getMonth()]}{" "}
          {close.getFullYear() + 543} เวลา {pad(close.getHours())}:
          {pad(close.getMinutes())}
          น.
        </span>
      </h1>
      <p className="text-gray-600">
        ขอความร่วมมือผู้สมัคร
        <span className="font-medium text-red-400">
          อ่านคำแนะนำก่อนเริ่มการสมัครอย่างละเอียด
        </span>
        ก่อนเริ่มกรอกใบสมัคร
      </p>
    </div>
  )
}
