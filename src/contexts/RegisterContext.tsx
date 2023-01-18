import type { FC, ReactNode } from "react"
import { createContext, useContext, useState } from "react"

import {
  defaultSectionHandler,
  useSectionHandler
} from "@/contexts/SectionHandler"
import type { FormData } from "@/types/register/form/FormData"
import { defaultFormData } from "@/types/register/form/FormData"
import type { Updater } from "@/types/register/Updater"
import type { SectionHandler } from "@/types/section/SectionHandler"
import type { UpdateSection } from "@/types/section/UpdateSection"
import type { FormStorage } from "@/types/storage/FormStorage"

interface ContextInterface {
  section: SectionHandler
  Storage: FormStorage
  Updater: Updater
}

const defaultValue: ContextInterface = {
  section: defaultSectionHandler,
  Storage: {
    updateSection: () => {},
    data: defaultFormData,
    setStorage: () => {},
    storageDep: 0
  },
  Updater: {
    setReceivedData: () => {},
    receivedData: null
  }
}
const RegisterContext = createContext<ContextInterface>(defaultValue)

const useStorable = () => {
  const [storage, setStorage] = useState<FormData>(defaultFormData)
  const [storageDep, setStorageDep] = useState(0)
  const updateSection: UpdateSection = (
    section: "school" | "students" | "teacher" | "selection" | "document",
    value: any
  ) => {
    setStorage((prev) => {
      const d = prev
      d[section] = value
      return d
    })
    setStorageDep(new Date().getTime())
  }

  return {
    updateSection,
    data: storage,
    setStorage,
    storageDep
  }
}

const useContextAction = (): ContextInterface => {
  const sectionHandler = useSectionHandler()
  const { updateSection, data, setStorage, storageDep } = useStorable()
  const [receivedData, setReceivedData] = useState<FormData | null>(null)

  const value = {
    section: sectionHandler,
    Storage: {
      updateSection,
      data,
      setStorage,
      storageDep
    },
    Updater: {
      receivedData,
      setReceivedData
    }
  }

  return value
}

export const RegisterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const context = useContextAction()
  return (
    <RegisterContext.Provider value={context}>
      {children}
    </RegisterContext.Provider>
  )
}

export const useRegister = () => {
  return useContext(RegisterContext)
}
