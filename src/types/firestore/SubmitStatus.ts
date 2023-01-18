import type { Timestamp } from "@firebase/firestore"

export interface SubmitStatus {
  status: string
  timestamp: Timestamp
  id: string
  reason?: string
  ticketData: any
}
