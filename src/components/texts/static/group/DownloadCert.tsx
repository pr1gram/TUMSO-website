import { CheckBadgeIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

export const DownloadCert = () => {
  return (
    <Link href={"/register/certificate"}>
      <div className="flex cursor-pointer items-center justify-center space-x-1 text-gray-600 hover:underline">
        <CheckBadgeIcon className="h-5 w-5" />
        <h1>รับเกียรติบัตร</h1>
      </div>
    </Link>
  )
}
