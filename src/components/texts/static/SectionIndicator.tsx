import { ExclamationTriangleIcon } from "@heroicons/react/20/solid"
import classnames from "classnames"
import type { FC } from "react"

import { useRegister } from "@/contexts/RegisterContext"
import type { AvailableSections } from "@/types/AvailableSections"

export const SectionIndicator: FC<{ title: string; id: string }> = ({
  title,
  id
}) => {
  const { section } = useRegister()
  return (
    <div
      onClick={() => {
        section.set(id as AvailableSections)
      }}
      className="flex items-center space-x-1"
    >
      <h1
        className={classnames(
          section.is(id) ? "text-gray-800 underline" : "text-gray-400",
          "cursor-pointer"
        )}
      >
        {title}
      </h1>
      <ExclamationTriangleIcon
        className={classnames(
          section.is(id) && "mt-2 animate-bounce",
          "h-4 w-4 text-yellow-500"
        )}
      />
    </div>
  )
}
