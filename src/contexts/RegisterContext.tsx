import type { Dispatch, FC, ReactNode } from "react"
import { createContext, useContext, useState } from "react"

import {
  defaultSectionHandler,
  useSectionHandler
} from "@/contexts/SectionHandler"
import type { FormData } from "@/types/FormData"
import { defaultFormData } from "@/types/FormData"
import type { SectionHandler } from "@/types/SectionHandler"

interface ContextInterface {
  section: SectionHandler
  Storage: {
    updateSection: UpdateSection
    data: FormData
    setStorage: Dispatch<FormData>
    storageDep: number
  }
  Updater: {
    setReceivedData: Dispatch<FormData | null>
    receivedData: FormData | null
  }
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

type UpdateSection = (
  section: "school" | "students" | "teacher" | "selection" | "document",
  value: any
) => void

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
