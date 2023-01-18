import { ArrowDownTrayIcon } from "@heroicons/react/24/solid"
import type { FC } from "react"

export const DownloadFile: FC<{
  text: string
  path: string
  fileName: string
}> = ({ text, path, fileName }) => {
  return (
    <a
      href={path}
      download={fileName}
      target="_blank"
      className="flex cursor-pointer items-start space-x-1 hover:text-blue-600 hover:underline"
      rel="noreferrer"
    >
      <ArrowDownTrayIcon
        className="mt-[3px] h-4 w-4"
        stroke={"currentColor"}
        strokeWidth={0.8}
      />
      <span>{text}</span>
    </a>
  )
}
