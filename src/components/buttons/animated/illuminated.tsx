import { motion } from "framer-motion"
import type { FC } from "react"
import { useState } from "react"

export const IlluminateButton: FC<{
  children: any
  action: () => void
}> = ({ children, action }) => {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => {
        setHover(true)
      }}
      onMouseLeave={() => {
        setHover(false)
      }}
      onClick={action}
      className="relative flex h-[34px] w-[200px] cursor-pointer items-center justify-center rounded-md border border-gray-400 font-medium text-gray-600"
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
        className="absolute h-[34px] w-[200px] rounded-md border border-green-700"
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
        className="absolute flex h-[34px] w-[200px] items-center justify-center rounded-md text-green-700"
      >
        {children}
      </motion.div>
      {children}
    </div>
  )
}
