import { CheckIcon } from "@heroicons/react/24/solid"
import classnames from "classnames"
import type { Dispatch, FC } from "react"
import { useEffect, useState } from "react"

export const Checkbox: FC<{ updateState: Dispatch<boolean> }> = ({
  updateState
}) => {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    updateState(checked)
  }, [checked])

  return (
    <div
      onClick={() => {
        setChecked((prev) => !prev)
      }}
      className={classnames(
        checked && "bg-gray-100",
        "flex h-5 w-5 cursor-pointer items-center justify-center rounded-[4px] border border-gray-500 border-opacity-60 text-gray-700"
      )}
    >
      {checked && (
        <CheckIcon className="h-4 w-4" stroke="currentColor" strokeWidth={1} />
      )}
    </div>
  )
}
