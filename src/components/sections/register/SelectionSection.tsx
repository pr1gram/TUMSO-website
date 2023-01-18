import { useState } from "react"

import { SelectionInput } from "@/components/inputs/SelectionInput"
import { useFireStore } from "@/contexts/firestore"
import { useRegister } from "@/contexts/RegisterContext"
import { loadAvailableSeatsFactory } from "@/factories/fetchers/selectionSection/loadAvailableSeatsFactory"
import { useTranslationLayerEffect } from "@/hooks/groups/selectionSection/useTranslationLayerEffect"
import { useFetcher } from "@/hooks/useFetcher"
import type { StorableObject } from "@/types/storage/StorableObject"
import {
  availableSelection,
  subjectValidator,
  translateFromEng
} from "@/utils/fixedSelection"

export const SelectionSection = () => {
  // Contexts
  const { Storage, Updater } = useRegister()
  const { getSubjectAvailability } = useFireStore()

  // States
  const [select, setSelect] = useState<string | null>(null)
  const [availability, setAvailability] = useState<StorableObject | undefined>(
    undefined
  )

  // Effects
  const loadAvailability = loadAvailableSeatsFactory(
    getSubjectAvailability,
    setAvailability
  )

  useFetcher(loadAvailability)
  useTranslationLayerEffect(select, Storage)

  return (
    <div>
      <div className="mt-6">
        <h1 className="text-lg font-medium">เลือกวิชาที่ลงสมัคร</h1>
        <p className="leading-4 text-gray-500">เลือกได้เพียง 1 สาขาเท่านั้น</p>
        <div className="mt-4">
          <div className="flex">
            <SelectionInput
              title={"วิชาที่ลงสมัคร"}
              options={availableSelection}
              required={true}
              placeholder={"เลือกวิชาที่ต้องการสมัคร"}
              updateState={setSelect}
              valueValidator={subjectValidator}
              value={select}
              externalValue={
                Updater.receivedData?.selection.subject === undefined
                  ? undefined
                  : translateFromEng(Updater.receivedData?.selection.subject)
              }
              optionComments={availability}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
