import { collection, doc, getDoc, getFirestore } from "@firebase/firestore"
import { useEffect, useState } from "react"

export const useTimer = () => {
  const [CTIME, setCT] = useState(0)
  const [OTIME, setOT] = useState(0)
  const [round, setRound] = useState(0)

  useEffect(() => {
    if (true) {
      const getTimer = async () => {
        const timerRef = collection(getFirestore(), "configs")
        const docData = await getDoc(doc(timerRef, "timers"))
        const a = 1704794400000
        const b = docData.get("REG_OPEN_TIMESTAMP").toMillis()
        const r = docData.get("COMP_ROUND")
        setCT(a)
        setOT(b)
        setRound(r)

        localStorage.setItem(
          "CLOSE_T",1704794400000
        )

        localStorage.setItem(
          "OPEN_T",
          docData.get("REG_OPEN_TIMESTAMP").toMillis()
        )
        localStorage.setItem("ROUND_C", docData.get("COMP_ROUND"))
      }

      getTimer()
    }

    const CLOSE_TIMESTAMP = parseInt(localStorage.getItem("CLOSE_T") || "0", 10)
    const OPEN_TIMESTAMP = parseInt(localStorage.getItem("OPEN_T") || "0", 10)
    setCT(CLOSE_TIMESTAMP)
    setOT(OPEN_TIMESTAMP)
    setRound(parseInt(localStorage.getItem("ROUND_C") || "0", 10))
  }, [])

  const isClosed = (byPass: boolean | undefined): boolean => {
    if (byPass === true) {
      return false
    }
    return new Date().getTime() >= CTIME || new Date().getTime() <= OTIME
  }

  const isStarted = () => {
    return new Date().getTime() >= OTIME
  }

  return {
    isStarted,
    isClosed,
    open: new Date(OTIME),
    close: new Date(CTIME),
    round
  }
}
