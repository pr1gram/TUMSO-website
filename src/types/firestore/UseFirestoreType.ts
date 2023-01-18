import type { DocumentData, Firestore } from "@firebase/firestore"

import type { Callable } from "@/types/callables/Callable"
import type { WatchedCallable } from "@/types/callables/WatchedCallables"
import type { StoredDocument } from "@/types/firestore/StoredDocument"
import type { SubmitStatus } from "@/types/firestore/SubmitStatus"

// Method types
export type GetSavedStorableType = WatchedCallable<StoredDocument | null>
export type SaveStorableType = WatchedCallable<void>
export type UploadDocumentType = WatchedCallable<{ path: string | null }>
export type GetSubjectAvailability = Callable<DocumentData | undefined>
export type SubmitFormsType = Callable<boolean>
export type GetDocumentLinkType = Callable<string | null>
export type GetSubmitStatusType = Callable<SubmitStatus | undefined>
export type EnableEditing = Callable<void>

export interface UseFirestoreType {
  db: Firestore
  getSavedStorable: GetSavedStorableType
  saveStorable: SaveStorableType
  uploadDocument: UploadDocumentType
  getDocumentLink: GetDocumentLinkType
  submitForms: SubmitFormsType
  getSubmitStatus: GetSubmitStatusType
  getSubjectAvailability: GetSubjectAvailability
  enableEditing: EnableEditing
}
