import type { DocumentData } from "@firebase/firestore"
import Router from "next/router"
import { useEffect, useState } from "react"

import { useAdminControl } from "@/contexts/admin"
import { useFirebaseAuth } from "@/contexts/firebaseAuth"
import { parseTimestamp } from "@/utils/time"

const Page = () => {
  const { user } = useFirebaseAuth()
  const { getSubmitted } = useAdminControl()
  const [appData, setData] = useState<DocumentData[]>([])

  const fetchData = async () => {
    const data = await getSubmitted()
    setData(data)
  }

  useEffect(() => {
    if (user.isLoggedIn() === false) {
      Router.push("/register")
      return
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (
      user.uid !== undefined &&
      user.uid !== "Di08jZL2aTOt31AUjX34FGZyIjv1" &&
      user.uid !== "y8zkDnTgDddHLxGbzOKyFYEIs5H3"
    ) {
      Router.push("/register")
    }
  }, [user.uid])

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto flex max-w-[1670px] flex-wrap justify-center p-6 text-gray-800 sm:justify-start">
        <div className="mt-6 mr-4">
          <h1 className="mb-1 text-2xl font-semibold text-gray-600">
            Waiting{" "}
            <span className="text-base font-normal text-gray-500">
              - {appData.filter((d) => d.status === "waiting").length}{" "}
              applicants -
            </span>
          </h1>
          <div className="flex max-h-[600px] flex-col items-center space-y-2 overflow-y-auto rounded-lg border border-gray-400 px-2 py-4">
            {appData
              .filter((d) => d.status === "waiting")
              .map((d) => {
                return (
                  <div
                    key={d.id}
                    onClick={() => {
                      window.location.replace(
                        `/register/admin/review?id=${d.id}`
                      )
                    }}
                    className="flex cursor-pointer flex-col rounded-md border border-gray-400 py-2 px-6 text-gray-700"
                  >
                    <span className="text-sm text-gray-400">
                      App id: {d.id}
                    </span>
                    <h1>
                      Subject:{" "}
                      <span className="font-semibold">
                        {d.data.selection.subject}
                      </span>
                    </h1>
                    <h1>
                      School:{" "}
                      <span className="font-semibold">
                        {d.data.school.name}
                      </span>
                    </h1>
                    <span>
                      Submission date:{" "}
                      <span className="font-semibold">
                        {parseTimestamp(d.timestamp)}
                      </span>
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
        <div className="mt-6 mr-4">
          <h1 className="mb-1 text-2xl font-semibold text-green-700">
            Accepted{" "}
            <span className="text-base font-normal text-gray-500">
              - {appData.filter((d) => d.status === "accepted").length}{" "}
              applicants -
            </span>
          </h1>
          <div className="flex max-h-[600px] flex-col items-center space-y-2 overflow-y-auto rounded-lg border border-gray-400 px-2 py-4">
            {appData
              .filter((d) => d.status === "accepted")
              .map((d) => {
                return (
                  <div
                    key={d.id}
                    onClick={() => {
                      window.location.replace(
                        `/register/admin/review?id=${d.id}`
                      )
                    }}
                    className="flex cursor-pointer flex-col rounded-md border border-gray-400 py-2 px-6 text-gray-700"
                  >
                    <span className="text-sm text-gray-400">
                      App id: {d.id}
                    </span>
                    <h1>
                      Subject:{" "}
                      <span className="font-semibold">
                        {d.data.selection.subject}
                      </span>
                    </h1>
                    <h1>
                      School:{" "}
                      <span className="font-semibold">
                        {d.data.school.name}
                      </span>
                    </h1>
                    <span>
                      Submission date:{" "}
                      <span className="font-semibold">
                        {parseTimestamp(d.timestamp)}
                      </span>
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
        <div className="mt-6 mr-4">
          <h1 className="mb-1 text-2xl font-semibold text-red-700">
            Rejected{" "}
            <span className="text-base font-normal text-gray-500">
              - {appData.filter((d) => d.status === "rejected").length}{" "}
              applicants -
            </span>
          </h1>
          <div className="flex max-h-[600px] min-h-[121px] min-w-[387px] flex-col items-center space-y-2 overflow-y-auto rounded-lg border border-gray-400 px-2 py-4">
            {appData
              .filter((d) => d.status === "rejected")
              .map((d) => {
                return (
                  <div
                    key={d.id}
                    onClick={() => {
                      window.location.replace(
                        `/register/admin/review?id=${d.id}`
                      )
                    }}
                    className="flex cursor-pointer flex-col rounded-md border border-gray-400 py-2 px-6 text-gray-700"
                  >
                    <span className="text-sm text-gray-400">
                      App id: {d.id}
                    </span>
                    <h1>
                      Subject:{" "}
                      <span className="font-semibold">
                        {d.data.selection.subject}
                      </span>
                    </h1>
                    <h1>
                      School:{" "}
                      <span className="font-semibold">
                        {d.data.school.name}
                      </span>
                    </h1>
                    <span>
                      Submission date:{" "}
                      <span className="font-semibold">
                        {parseTimestamp(d.timestamp)}
                      </span>
                    </span>
                    <div className="flex items-center space-x-1">
                      <h1>Reason: </h1>
                      <h1 className="max-w-[260px] overflow-x-auto whitespace-nowrap font-medium text-gray-500">
                        {d.reason}
                      </h1>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
        <div className="mt-6 mr-4">
          <h1 className="mb-1 text-2xl font-semibold text-yellow-700">
            Editing{" "}
            <span className="text-base font-normal text-gray-500">
              - {appData.filter((d) => d.status === "editing").length}{" "}
              applicants -
            </span>
          </h1>
          <div className="flex max-h-[600px] min-h-[121px] min-w-[387px] flex-col items-center space-y-2 overflow-y-auto rounded-lg border border-gray-400 px-2 py-4">
            {appData
              .filter((d) => d.status === "editing")
              .map((d) => {
                return (
                  <div
                    key={d.id}
                    onClick={() => {
                      window.location.replace(
                        `/register/admin/review?id=${d.id}`
                      )
                    }}
                    className="flex cursor-pointer flex-col rounded-md border border-gray-400 py-2 px-6 text-gray-700"
                  >
                    <span className="text-sm text-gray-400">
                      App id: {d.id}
                    </span>
                    <h1>
                      Subject:{" "}
                      <span className="font-semibold">
                        {d.data.selection.subject}
                      </span>
                    </h1>
                    <h1>
                      School:{" "}
                      <span className="font-semibold">
                        {d.data.school.name}
                      </span>
                    </h1>
                    <span>
                      Submission date:{" "}
                      <span className="font-semibold">
                        {parseTimestamp(d.timestamp)}
                      </span>
                    </span>
                    <div className="flex items-center space-x-1">
                      <h1>Reason: </h1>
                      <h1 className="max-w-[260px] overflow-x-auto whitespace-nowrap font-medium text-gray-500">
                        {d.reason}
                      </h1>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
