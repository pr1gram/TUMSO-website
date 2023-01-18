import type { Timestamp } from "@firebase/firestore"

import type { StorableObject } from "@/types/storage/StorableObject"

export interface StoredDocument {
  stored: StorableObject
  checksum: string
  timestamp: Timestamp
}
