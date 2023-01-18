import hash from "object-hash"
import type { Dispatch } from "react"
import { useEffect, useState } from "react"

import type { CheckHashType } from "@/types/checksum/CheckHashType"
import type { FormStorage } from "@/types/storage/FormStorage"

type UseChecksumType = (Storage: FormStorage) => {
  isDiffer: boolean
  setLastHash: Dispatch<string>
  check: CheckHashType
}

export const useChecksum: UseChecksumType = (Storage: FormStorage) => {
  const [recheckTimeout, setRecheckTimout] = useState(setTimeout(() => {}, 100))
  const [isDiffer, setHD] = useState(false)
  const [lastDataHash, setLastHash] = useState<string>("")

  const checkHash: CheckHashType = (lastHash) => {
    if (!lastHash) {
      if (!lastDataHash) return
    }
    const objHash = hash.sha1(Storage.data)
    if (lastHash ? objHash !== lastHash : objHash !== lastDataHash) {
      setHD(true)
    } else {
      setHD(false)
    }
  }

  useEffect(() => {
    clearTimeout(recheckTimeout)
    const to = setTimeout(() => {
      checkHash()
    }, 1000)
    setRecheckTimout(to)
  }, [Storage.storageDep, lastDataHash])

  return {
    isDiffer,
    setLastHash,
    check: checkHash
  }
}
