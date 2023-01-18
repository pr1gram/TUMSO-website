import { motion } from "framer-motion"
import type { FC, ReactNode } from "react"

export const BluringCurtain: FC<{ hide: boolean }> = ({ hide }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={
        hide
          ? { opacity: 1, display: "block" }
          : { opacity: 0, display: "none" }
      }
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 z-[100] min-h-screen w-full cursor-not-allowed bg-gray-100 bg-opacity-40 backdrop-blur-sm"
    ></motion.div>
  )
}

export const BluringCurtainContainer: FC<{
  hide: boolean
  children: ReactNode
}> = ({ hide, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={
        hide ? { opacity: 1, display: "flex" } : { opacity: 0, display: "none" }
      }
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 z-[100] flex min-h-screen w-full cursor-not-allowed flex-col items-center justify-center bg-gray-100 bg-opacity-40 backdrop-blur-sm"
    >
      {children}
    </motion.div>
  )
}
