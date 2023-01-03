import type { Timestamp } from "@firebase/firestore"

export const parseTimestamp = (timestamp: Timestamp | null) => {
  if (!timestamp) return <span>-</span>

  const month = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม"
  ]

  function pad(num: number | undefined) {
    if (!num) return ""
    let strNum = num.toString()
    while (strNum.length < 2) {
      strNum = `0${strNum}`
    }
    return strNum
  }

  return (
    <span>
      {pad(timestamp?.toDate().getHours())}:
      {pad(timestamp?.toDate().getMinutes())}
      {" น. "}
      {pad(timestamp?.toDate().getDate())}{" "}
      {month[timestamp?.toDate().getMonth()]}{" "}
      {timestamp?.toDate().getFullYear()}
    </span>
  )
}
