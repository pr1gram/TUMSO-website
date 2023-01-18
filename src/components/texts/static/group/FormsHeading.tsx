export const FormsHeading = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold">ลงทะเบียนสมัครแข่งขัน</h1>
      <h1 className="mt-1 font-medium leading-4 text-gray-600">
        หมดเขตรับสมัคร:{" "}
        <span className="text-red-600">11 มกราคม 2565 เวลา 12.00 น.</span>
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
