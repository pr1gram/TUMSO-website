import type { Timestamp } from "@firebase/firestore"
import type { FC } from "react"
import { useState } from "react"

import { DocumentSection } from "@/components/sections/register/DocumentSection"
import { LandingSection } from "@/components/sections/register/LandingSection"
import { SelectionSection } from "@/components/sections/register/SelectionSection"
import { StudentSection } from "@/components/sections/register/StudentSection"
import { TeacherSection } from "@/components/sections/register/TeacherSection"
import { SectionHeading } from "@/components/texts/static/group/SectionHeading"
import { BluringCurtain } from "@/components/wrapper/BluringCurtain"
import { HideableWrapper } from "@/components/wrapper/HideableWrapper"
import { useFireStore } from "@/contexts/firestore"
import { useRegister } from "@/contexts/RegisterContext"
import { getDataWatchableFactory } from "@/factories/watchables/sectionContainer/getDataWatchableFactory"
import { saveDataWatchableFactory } from "@/factories/watchables/sectionContainer/saveDataWatchableFactory"
import { usePageRestrictionEffects } from "@/hooks/groups/sectionContainer/usePageRestrictionEffects"
import { useChecksum } from "@/hooks/useChecksum"
import { useFetcher } from "@/hooks/useFetcher"
import { useWatcher } from "@/hooks/useWatcher"

export const SectionContainer: FC<{
  query: any
  byPass: boolean | undefined
}> = ({ query, byPass }) => {
  // Contexts
  const { section, Storage, Updater } = useRegister()
  const { saveStorable, getSavedStorable } = useFireStore()
  const { setLastHash, isDiffer, check } = useChecksum(Storage)

  // States
  const [lastSave, setLastSave] = useState<Timestamp | null>(null)

  // Grouped effects
  usePageRestrictionEffects(query, byPass)

  /* Watchables and Fetchers
  Create and register getData event */
  const getDataWatchable = getDataWatchableFactory(
    getSavedStorable,
    Updater,
    setLastSave,
    setLastHash
  )

  const [getData, loadingData] = useWatcher<boolean>(getDataWatchable, false)

  useFetcher(getData, true)

  // Create saveData event
  const saveDataWatchable = saveDataWatchableFactory(
    saveStorable,
    Storage,
    getSavedStorable,
    check,
    setLastSave,
    setLastHash
  )

  const [saveData, savingStatus] = useWatcher<string>(
    saveDataWatchable,
    "resolved"
  )

  return (
    <div>
      {!section.is("landing") && (
        <>
          <BluringCurtain hide={loadingData || savingStatus === "pending"} />
          <SectionHeading
            saveData={saveData}
            lastSave={lastSave}
            savingStatus={savingStatus}
            isDiffer={isDiffer}
          />
        </>
      )}
      {section.is("landing") && <LandingSection byPass={byPass} />}
      <HideableWrapper hide={section.is("student")}>
        <StudentSection />
      </HideableWrapper>
      <HideableWrapper hide={section.is("teacher")}>
        <TeacherSection />
      </HideableWrapper>
      <HideableWrapper hide={section.is("selection")}>
        <SelectionSection />
      </HideableWrapper>
      <HideableWrapper hide={section.is("document")}>
        <DocumentSection save={saveData} />
      </HideableWrapper>
    </div>
  )
}
