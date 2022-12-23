import classnames from "classnames"
import type { Transition } from "framer-motion"
import { motion } from "framer-motion"
import type { FC } from "react"

export const RevealText: FC<{
  children: any
  className?: string
  transition?: Transition
}> = ({ children, className = "", transition }) => {
  return (
    <div className="relative">
      <motion.h1
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={transition}
        className={classnames(
          "wrap-all absolute top-0 left-0 w-full overflow-hidden text-clip whitespace-nowrap",
          className
        )}
      >
        {children}
      </motion.h1>
      <h1 className={classnames("mx-1 opacity-0", className)}>{children}</h1>
    </div>
  )
}
