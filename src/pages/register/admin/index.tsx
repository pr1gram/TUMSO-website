import type { DocumentData } from "@firebase/firestore"
import {
  CheckIcon,
  ExclamationTriangleIcon,
  MinusSmallIcon
} from "@heroicons/react/20/solid"
import Router from "next/router"
import { useEffect, useState } from "react"

import { useAdminControl } from "@/contexts/admin"
import { useFirebaseAuth } from "@/contexts/firebaseAuth"
import { parseTimestamp } from "@/utils/time"

const Page = () => {
  const { user } = useFirebaseAuth()
  const { getSubmitted, getCount } = useAdminControl()
  const [appData, setData] = useState<DocumentData[]>([])
  const [count, setCount] = useState<any>(undefined)
  const [dupedIndex, setDupedIndex] = useState<string[]>([])
  const [indexBySchool, setIndexBySchool] = useState<any>(null)

  const indexByKey = (samples: any[], collector: (s: any) => string) => {
    const indexedByKey: { [key: string]: any[] } = {}
    samples.forEach((s) => {
      const vok = collector(s)
      if (vok in indexedByKey) {
        indexedByKey[vok]?.push(s)
      } else {
        indexedByKey[vok] = [s]
      }
    })

    return indexedByKey
  }

  const analyseData = (
    samples: DocumentData[],
    primaryKey: (s: any) => string,
    secondaryKey: (s: any) => string,
    priorityComparator: (a: DocumentData, b: DocumentData) => number,
    collector: (d: DocumentData) => any = (d) => d.id
  ): [d: any[], i: { [key: string]: any }] => {
    const indexedByPrimary = indexByKey(samples, primaryKey)
    const dupedList: any[] = []
    Object.entries(indexedByPrimary).forEach(([key, val]) => {
      const indexedBySecondary = indexByKey(val, secondaryKey)
      const susList = Object.values(indexedBySecondary).filter(
        (v) => v.length > 1
      )
      susList.forEach((sus) => {
        const duplicates = sus.sort(priorityComparator).slice(1, sus.length)
        duplicates.forEach((d) => {
          dupedList.push(collector(d))
        })
      })
    })

    return [dupedList, indexedByPrimary]
  }

  const fetchData = async () => {
    const data = await getSubmitted()
    const [duped, indexedBySchool] = analyseData(
      data,
      (a) => a.data.school.name,
      (a) => a.data.selection.subject,
      (a, b) => {
        return a.timestamp.seconds - b.timestamp.seconds
      }
    )
    setIndexBySchool(indexedBySchool)
    setDupedIndex(duped)
    setData(data)
    const ccount = await getCount()
    setCount(ccount)
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

  const displayColour = (v: number, max: number) => {
    const percent = (v / max) * 100
    if (percent <= 50) {
      return <span className="text-green-600">{v}</span>
    }
    if (percent <= 70) {
      return <span className="text-yellow-600">{v}</span>
    }
    if (percent <= 85) {
      return <span className="text-orange-600">{v}</span>
    }
    return <span className="text-red-600">{v}</span>
  }

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto flex max-w-[1260px] flex-wrap justify-center p-6 text-gray-800 sm:justify-start">
        <div className="mt-6 mr-4 space-y-2 px-4">
          <h1 className="text-2xl font-semibold">
            Summary{" "}
            <span className="text-base font-normal text-gray-500">
              {`- 
              ${Object.values(count || {}).reduce(
                (p, c: any) => p + c.count,
                0
              )} 
                of
              ${Object.values(count || {}).reduce((p, c: any) => p + c.max, 0)} 
                applicants -`}
            </span>
          </h1>
          <h2 className="font-medium text-gray-500">By Subjects</h2>
          <div className="flex max-w-[276px] flex-wrap">
            {Object.keys(count || {})
              .sort((a, b) =>
                a === "mathematics" || b === "mathematics"
                  ? 1
                  : a.localeCompare(b)
              )
              .map((k) => {
                return (
                  <div
                    className="mr-2 mb-2 rounded-lg border border-gray-600 px-4 py-2"
                    key={k}
                  >
                    <h1 className="font-semibold">{k.toUpperCase()}</h1>
                    <h1 className="font-medium text-gray-600">
                      {displayColour(count[k].count, count[k].max)} of{" "}
                      {count[k].max}
                    </h1>
                  </div>
                )
              })}
          </div>
          <h2 className="font-medium text-gray-500">By Schools</h2>
          <div className="flex h-[80px] items-end text-xs font-semibold">
            <h1 className="ml-[2px] mr-[11px] w-[10px] -rotate-90">PHYSICS</h1>
            <h1 className="mr-[10px] w-[10px] -rotate-90">CHEMISTRY</h1>
            <h1 className="mr-[10px] w-[10px] -rotate-90">BIOLOGY</h1>
            <h1 className="mr-[10px] w-[10px] -rotate-90">MATHS</h1>
            <h1 className="w-[10px] -rotate-90">COMPUTER</h1>
            <h1 className="w-full text-center text-base font-medium">
              School name
            </h1>
          </div>
          <div className="max-h-[216px] overflow-y-auto border-t border-gray-400">
            {Object.entries(indexBySchool || {}).map(([key, val], i) => {
              if (key === "") return <></>
              return (
                <div
                  className="flex items-center border-b border-gray-400 py-1"
                  key={`s-${i}`}
                >
                  <div className="mr-2 flex space-x-1">
                    <h1>
                      {
                        // @ts-ignore
                        val?.some(
                          (s: any) => s.data.selection.subject === "physics"
                        ) ? (
                          <CheckIcon
                            stroke={"currentColor"}
                            strokeWidth={2.4}
                            className="h-4 w-4 text-green-500"
                          />
                        ) : (
                          <MinusSmallIcon
                            stroke={"currentColor"}
                            strokeWidth={2.4}
                            className="h-4 w-4 text-gray-500"
                          />
                        )
                      }
                    </h1>
                    <h1>
                      {
                        // @ts-ignore
                        val?.some(
                          (s: any) => s.data.selection.subject === "chemistry"
                        ) ? (
                          <CheckIcon
                            stroke={"currentColor"}
                            strokeWidth={2.4}
                            className="h-4 w-4 text-green-500"
                          />
                        ) : (
                          <MinusSmallIcon
                            stroke={"currentColor"}
                            strokeWidth={2.4}
                            className="h-4 w-4 text-gray-500"
                          />
                        )
                      }
                    </h1>
                    <h1>
                      {
                        // @ts-ignore
                        val?.some(
                          (s: any) => s.data.selection.subject === "biology"
                        ) ? (
                          <CheckIcon
                            stroke={"currentColor"}
                            strokeWidth={2.4}
                            className="h-4 w-4 text-green-500"
                          />
                        ) : (
                          <MinusSmallIcon
                            stroke={"currentColor"}
                            strokeWidth={2.4}
                            className="h-4 w-4 text-gray-500"
                          />
                        )
                      }
                    </h1>
                    <h1>
                      {
                        // @ts-ignore
                        val?.some(
                          (s: any) => s.data.selection.subject === "mathematics"
                        ) ? (
                          <CheckIcon
                            stroke={"currentColor"}
                            strokeWidth={2.4}
                            className="h-4 w-4 text-green-500"
                          />
                        ) : (
                          <MinusSmallIcon
                            stroke={"currentColor"}
                            strokeWidth={2.4}
                            className="h-4 w-4 text-gray-500"
                          />
                        )
                      }
                    </h1>
                    <h1>
                      {
                        // @ts-ignore
                        val?.some(
                          (s: any) => s.data.selection.subject === "computer"
                        ) ? (
                          <CheckIcon
                            stroke={"currentColor"}
                            strokeWidth={2.4}
                            className="h-4 w-4 text-green-500"
                          />
                        ) : (
                          <MinusSmallIcon
                            stroke={"currentColor"}
                            strokeWidth={2.4}
                            className="h-4 w-4 text-gray-500"
                          />
                        )
                      }
                    </h1>
                  </div>
                  <h1 className="max-w-[250px] overflow-x-scroll whitespace-nowrap">
                    {key}
                  </h1>
                </div>
              )
            })}
          </div>
        </div>
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
                    className="relative flex cursor-pointer flex-col rounded-md border border-gray-400 py-2 px-6 text-gray-700"
                  >
                    {dupedIndex.includes(d.id) && (
                      <div className="absolute top-3 right-3">
                        <ExclamationTriangleIcon className="h-4 w-4 animate-pulse text-yellow-600" />
                      </div>
                    )}
                    <span className="text-sm text-gray-400">
                      App id: {d.id}
                    </span>
                    <h1>
                      Subject:{" "}
                      <span className="font-semibold">
                        {d.data.selection.subject}
                      </span>
                    </h1>
                    <div className="flex items-center space-x-1">
                      <h1>School: </h1>
                      <h1 className="max-w-[260px] overflow-x-auto whitespace-nowrap font-semibold">
                        {d.data.school.name}
                      </h1>
                    </div>
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
                    <div className="flex items-center space-x-1">
                      <h1>School: </h1>
                      <h1 className="max-w-[260px] overflow-x-auto whitespace-nowrap font-semibold">
                        {d.data.school.name}
                      </h1>
                    </div>
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
                    className="relative flex cursor-pointer flex-col rounded-md border border-gray-400 py-2 px-6 text-gray-700"
                  >
                    {dupedIndex.includes(d.id) && (
                      <div className="absolute top-3 right-3">
                        <ExclamationTriangleIcon className="h-4 w-4 animate-pulse text-yellow-600" />
                      </div>
                    )}
                    <span className="text-sm text-gray-400">
                      App id: {d.id}
                    </span>
                    <h1>
                      Subject:{" "}
                      <span className="font-semibold">
                        {d.data.selection.subject}
                      </span>
                    </h1>
                    <div className="flex items-center space-x-1">
                      <h1>School: </h1>
                      <h1 className="max-w-[260px] overflow-x-auto whitespace-nowrap font-semibold">
                        {d.data.school.name}
                      </h1>
                    </div>
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
                    <div className="flex items-center space-x-1">
                      <h1>School: </h1>
                      <h1 className="max-w-[260px] overflow-x-auto whitespace-nowrap font-semibold">
                        {d.data.school.name}
                      </h1>
                    </div>
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
