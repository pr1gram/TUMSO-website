import classnames from "classnames"
import { motion } from "framer-motion"
import type { FC, ReactNode } from "react"
import { useState } from "react"

export const ExpandableBadge: FC<{
  children: ReactNode
  title: string
  description: string
  hidden?: boolean
}> = ({ children, title, description, hidden = true }) => {
  const [sinfo, setSInfo] = useState(false)
  const [infoHover, setInfoHover] = useState(false)

  return (
    <>
      {sinfo && (
        <div
          onClick={() => {
            setSInfo(false)
          }}
          className="fixed top-0 left-0 z-[16] min-h-screen w-full"
        />
      )}
      <motion.div
        animate={
          hidden
            ? { display: "hidden", opacity: 0 }
            : { display: "block", opacity: 1 }
        }
        transition={{ type: "tween", duration: 0.15 }}
        className={classnames("z-[18] h-4 w-4")}
      >
        <motion.div
          onClick={() => {
            setSInfo(true)
          }}
          onHoverStart={() => {
            setInfoHover(true)
          }}
          onHoverEnd={() => {
            setInfoHover(false)
          }}
          initial={{ width: "100%", height: "100%", borderRadius: "20px" }}
          animate={
            sinfo
              ? { height: "260%", width: "100px", borderRadius: "6px" }
              : { width: "100%", height: "100%", borderRadius: "20px" }
          }
          whileTap={!sinfo ? { width: "200%", height: "140%" } : {}}
          whileHover={!sinfo ? { width: "200%" } : {}}
          className={classnames(
            "relative flex h-4 w-4 cursor-pointer bg-red-400 shadow-sm"
          )}
        >
          {children}
          <motion.div
            initial={{ clipPath: "inset(0 100% 60% 0)" }}
            animate={
              // eslint-disable-next-line no-nested-ternary
              sinfo
                ? { clipPath: "inset(0 1% 1% 0)" }
                : infoHover
                ? { clipPath: "inset(0 70% 60% 0)" }
                : { clipPath: "inset(0 100% 60% 0)" }
            }
            className="absolute flex flex-col text-[11px] font-bold"
          >
            <h1 className="ml-6 mt-[2px] text-white">{title}</h1>
            <p className="w-[100px] px-2 text-center text-[10px] font-medium leading-[11px] text-white">
              {description}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  )
}
