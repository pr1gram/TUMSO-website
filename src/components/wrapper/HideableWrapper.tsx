import { motion } from "framer-motion"
import type { FC, ReactNode } from "react"

export const HideableWrapper: FC<{
  children: ReactNode
  hide: boolean
}> = ({ children, hide }) => {
  return (
    <motion.div
      initial={{ display: "none" }}
      animate={hide ? { display: "block" } : { display: "none" }}
    >
      {children}
    </motion.div>
  )
}
