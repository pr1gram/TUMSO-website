import type { FC, ReactNode } from "react"
import { createContext, useContext } from "react"

import {
  defaultSectionHandler,
  useSectionHandler
} from "@/contexts/SectionHandler"
import type { SectionHandler } from "@/types/SectionHandler"

interface ContextInterface {
  section: SectionHandler
}

const defaultValue: ContextInterface = {
  section: defaultSectionHandler
}
const RegisterContext = createContext<ContextInterface>(defaultValue)

const useContextAction = (): ContextInterface => {
  const sectionHandler = useSectionHandler()

  const value = {
    section: sectionHandler
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
