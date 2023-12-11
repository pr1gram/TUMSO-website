import { useTimer } from "@/hooks/useTimer"
import { pad, THMONTH } from "@/utils/timer"

export const FormDescription = () => {
  const { open, close, round } = useTimer()

  return (
    <div className="rounded-xl border border-gray-600 border-opacity-60 px-6 pt-4 pb-5">
      <h1 className="font-semibold">ข้อมูลการสมัคร</h1>
      <ol className="list-decimal pl-6">
        <li>
          การแข่งขันคณิตศาสตร์และวิทยาศาสตร์ระหว่างโรงเรียน ครั้งที่ {round}{" "}
          เป็นการแข่งขันในรายวิชาฟิสิกส์ เคมี ชีววิทยา และคอมพิวเตอร์
          โดยแข่งขันในลักษณะทีม ทีมละไม่เกิน 2 คน
          เข้าแข่งขันแยกกันในแต่ละรายวิชา (ในแต่ละรายวิชานักเรียนผู้เข้าแข่งขัน
          1 ทีม ต้องมีครูผู้ควบคุมทีม 1 คน)
        </li>
        <li>
          นักเรียนผู้เข้าแข่งขันต้องกําลังศึกษาอยู่ในระดับมัธยมศึกษาตอนต้นหรือมัธยมศึกษาตอนปลายของปีการศึกษา{" "}
          {open.getFullYear() + 543} ในสถานศึกษาเดียวกัน
        </li>
        <li>แต่ละรายวิชารับสมัครนักเรียนผู้เข้าแข่งขันจํานวน 30 ทีมเท่านั้น</li>
        <li>
          ใน 1 รายวิชาสถานศึกษาสามารถส่งนักเรียนเข้าร่วมการแข่งขันได้{" "}
          <span className="underline">1 ทีมเท่านั้น</span>{" "}
          โดยมีผู้บริหารสถานศึกษา
          เป็นผู้รับรองความเป็นนักเรียนของนักเรียนผู้เข้าแข่งขัน
        </li>
      </ol>
      <h1 className="mt-2 font-semibold">ข้อมูลแบบฟอร์มรับสมัคร</h1>
      <ol className="list-decimal pl-6">
        <li>
          แบบฟอร์มนี้มีเอกสารที่ต้องดาวน์โหลดเพื่อให้ผู้บริหารสถานศึกษาลงชื่อ
          จากนั้น
          <span className="text-red-400 underline">
            อัพโหลดขึ้นสู่ระบบพร้อมกับส่งแบบฟอร์ม
          </span>{" "}
          ภายในวันที่ {close.getDate()} {THMONTH[close.getMonth()]}{" "}
          {close.getFullYear() + 543} เวลา {pad(close.getHours())}:
          {pad(close.getMinutes())} น.
        </li>
        <li>
          ผู้สมัครสามารถบันทึกข้อมูลแบบฟอร์มไว้ส่งในภายหลังได้
          <span className="text-red-400 underline">
            หากผู้สมัครบันทึกแบบฟอร์มไว้แล้วแต่ไม่ได้ส่งแบบฟอร์มภายในเวลาปิดฟอร์ม
            จะถือว่าการสมัครไม่สำเร็จ
          </span>
        </li>
      </ol>
    </div>
  )
}
