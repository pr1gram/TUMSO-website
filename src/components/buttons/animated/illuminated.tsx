import classnames from "classnames"
import { motion } from "framer-motion"
import type { FC } from "react"
import { useState } from "react"

export const IlluminateButton: FC<{
  children: any
  action: () => void
  width?: number
  disabled?: boolean
}> = ({ children, action, width = 200, disabled }) => {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => {
        if (disabled) return
        setHover(true)
      }}
      onMouseLeave={() => {
        setHover(false)
      }}
      onClick={action}
      style={{ width: `${width}px` }}
      className={classnames(
        "relative flex h-[34px] items-center justify-center rounded-md border border-gray-400 font-medium text-gray-600",
        !disabled ? "cursor-pointer" : "cursor-not-allowed"
      )}
    >
      <motion.div
        initial={{ clipPath: "inset(0 100% 100% 0)" }}
        animate={
          hover
            ? {
                clipPath: ["inset(0 0.01% 100% 0)", "inset(0 0.01% 0.01% 0)"]
              }
            : { clipPath: "inset(0 100% 100% 0)" }
        }
        style={{ width: `${width}px` }}
        className="absolute h-[34px] rounded-md border border-green-700"
      />
      <motion.div
        initial={{ clipPath: "inset(0 100% 100% 0)" }}
        animate={
          hover
            ? {
                clipPath: ["inset(0 0.01% 100% 0)", "inset(0 0.01% 0.01% 0)"]
              }
            : { clipPath: "inset(0 100% 100% 0)" }
        }
        style={{ width: `${width}px` }}
        className="absolute flex h-[34px] items-center justify-center rounded-md text-green-700"
      >
        {children}
      </motion.div>
      {children}
    </div>
  )
}
