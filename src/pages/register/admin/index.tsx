import type { DocumentData } from "@firebase/firestore"
import {
  CheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MinusSmallIcon,
  PencilIcon
} from "@heroicons/react/20/solid"
import Router from "next/router"
import { useEffect, useState } from "react"
import * as XLSX from "xlsx"

import { useAdminControl } from "@/contexts/admin"
import { useFirebaseAuth } from "@/contexts/firebaseAuth"
import { translateFromEng } from "@/utils/fixedSelection"
import { parseTimestamp } from "@/utils/time"

const Page = () => {
  const { user, signOut } = useFirebaseAuth()
  const { getSubmitted, getCount, getAdditional } = useAdminControl()
  const [appData, setData] = useState<DocumentData[]>([])
  const [count, setCount] = useState<any>(undefined)
  const [dupedIndex, setDupedIndex] = useState<string[]>([])
  const [indexBySchool, setIndexBySchool] = useState<any>(null)
  const [fr, setFR] = useState(false)
  const [latestSnap, setLS] = useState<any>({})

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

  const getAdditionalRecords = async (status: string) => {
    if (!latestSnap[status]) return
    const lastSnap = latestSnap[status]
    const [addD, lastSnapD] = await getAdditional(lastSnap, status)
    setData((prev) => {
      const mixed = [...prev]
      addD.forEach((i: any) => {
        if (!mixed.some((e) => e.id === i.id)) {
          mixed.push(i)
        }
      })

      return mixed.sort((a, b) =>
        a.data.school.name.localeCompare(b.data.school.name)
      )
    })
    setLS((prev: any) => ({
      ...prev,
      [status]: lastSnapD
    }))
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

  const fetchData = async (full = false) => {
    const [data, latestSnapshot] = await getSubmitted(full)
    setLS(latestSnapshot)
    setData(
      data.sort((a: any, b: any) =>
        a.data.school.name.localeCompare(b.data.school.name)
      )
    )
    const ccount = await getCount()
    setCount(ccount)
  }

  function downloadBlob(
    content: string,
    filename: string,
    contentType: string
  ) {
    const arrayOfArrayCsv = content.split("\n").map((row: string) => {
      return row.split(",")
    })
    const wb = XLSX.utils.book_new()
    const newWs = XLSX.utils.aoa_to_sheet(arrayOfArrayCsv)
    newWs["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
      { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } },
      { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } },
      { s: { r: 0, c: 3 }, e: { r: 0, c: 6 } },
      { s: { r: 0, c: 7 }, e: { r: 0, c: 10 } },
      { s: { r: 0, c: 11 }, e: { r: 0, c: 14 } }
    ]
    XLSX.utils.book_append_sheet(wb, newWs)
    const blob = new Blob(
      [new Uint8Array(XLSX.write(wb, { bookType: "xlsx", type: "array" }))],
      {
        type: contentType
      }
    )
    const url = URL.createObjectURL(blob)

    // Create a link to download it
    const pom = document.createElement("a")
    pom.href = url
    pom.setAttribute("download", filename)
    pom.click()
  }

  const exportData = () => {
    if (fr) {
      const counter = {
        mathematics: 1,
        chemistry: 1,
        biology: 1,
        computer: 1,
        physics: 1
      }

      const formatted = appData
        .filter((e) => e.status === "accepted")
        .sort((a, b) =>
          a.data.selection.subject.localeCompare(b.data.selection.subject)
        )
        .map((v) => {
          // @ts-ignore
          const c = counter[v.data.selection.subject]
          // @ts-ignore
          counter[v.data.selection.subject] += 1
          return {
            index: c,
            school: v.data.school.name,
            subject: translateFromEng(v.data.selection.subject),
            s1t: `${v.data.students[1].title}`,
            s1f: `${v.data.students[1].firstname}`,
            s1l: `${v.data.students[1].lastname}`,
            s1p: v.data.students[1].phone,
            s2t: `${v.data.students[2].title}`,
            s2f: `${v.data.students[2].firstname}`,
            s2l: `${v.data.students[2].lastname}`,
            s2p: v.data.students[2].phone,
            teachert: v.data.teacher.title,
            teacherf: v.data.teacher.firstname,
            teacherl: v.data.teacher.lastname,
            phone: v.data.teacher.phone
          }
        })

      const header =
        "ลำดับที่, โรงเรียน, วิชาที่ลงสมัคร, นักเรียนคนที่ 1, , , , นักเรียนคนที่ 2, , , , ครูที่ปรึกษา, , , \n , , , คำนำหน้า, ชื่อ, นามสกุล, เบอร์โทร, คำนำหน้า, ชื่อ, นามสกุล, เบอร์โทร, คำนำหน้า, ชื่อ, นามสกุล, เบอร์โทร"
      const csvContent = `${header}\n${formatted
        .map((e) => Object.values(e).join(", "))
        .join("\n")}`

      downloadBlob(csvContent, "export.xlsx", "text/csv;charset=utf-8;")
    }
  }

  useEffect(() => {
    const [duped, indexedBySchool] = analyseData(
      appData,
      (a) => a.data.school.name,
      (a) => a.data.selection.subject,
      (a, b) => {
        return a.timestamp.seconds - b.timestamp.seconds
      }
    )
    setIndexBySchool(indexedBySchool)
    setDupedIndex(duped)
  }, [appData])
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

  const getDuped = (data: any, subject: string) => {
    const target = data.filter((s: any) => s.data.selection.subject === subject)
    if (target.length > 1) {
      return (
        <span className="absolute top-0 -right-1 z-20 text-[10px] text-yellow-600">
          *
        </span>
      )
    }
    return <></>
  }

  const getIndicator = (data: any, subject: string) => {
    if (data.some((s: any) => s.data.selection.subject === subject)) {
      const target = data.filter(
        (s: any) => s.data.selection.subject === subject
      )[0]
      const stat = target.status
      const { id } = target

      switch (stat) {
        case "accepted":
          return (
            <CheckIcon
              stroke={"currentColor"}
              strokeWidth={2.4}
              onClick={() => {
                Router.push(`/register/admin/review?id=${id}`)
              }}
              className="h-4 w-4 text-green-500"
            />
          )
        case "rejected":
          return (
            <ExclamationTriangleIcon
              onClick={() => {
                Router.push(`/register/admin/review?id=${id}`)
              }}
              className="h-4 w-4 text-red-500"
            />
          )
        case "waiting":
          return (
            <ClockIcon
              onClick={() => {
                Router.push(`/register/admin/review?id=${id}`)
              }}
              className="h-4 w-4 text-gray-600"
            />
          )
        case "editing":
          return (
            <PencilIcon
              onClick={() => {
                Router.push(`/register/admin/review?id=${id}`)
              }}
              className="h-4 w-4 text-yellow-600"
            />
          )
        default:
          return (
            <MinusSmallIcon
              stroke={"currentColor"}
              strokeWidth={2.4}
              className="h-4 w-4 text-gray-500"
            />
          )
      }
    } else {
      return (
        <MinusSmallIcon
          stroke={"currentColor"}
          strokeWidth={2.4}
          className="h-4 w-4 text-gray-500"
        />
      )
    }
  }

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto flex max-w-[1270px] flex-wrap justify-center p-6 text-gray-800 sm:justify-start">
        <div className="mt-6 mr-4 space-y-2 px-4">
          <div>
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
            <h1
              onClick={() => {
                signOut()
                Router.reload()
              }}
              className="-mt-2 cursor-pointer text-gray-500 hover:underline"
            >
              sign out
            </h1>
          </div>
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
          <div className="flex justify-between font-medium text-gray-500">
            <h1>By Schools </h1>
            <span
              className="cursor-pointer font-normal hover:underline"
              onClick={exportData}
            >
              Export
            </span>
          </div>
          <div className="relative">
            {!fr && (
              <div className="absolute top-0 left-0 z-[20] flex h-full w-full items-center justify-center rounded-md bg-gray-900 bg-opacity-25 backdrop-blur-sm">
                <div
                  onClick={() => {
                    setFR(true)
                    fetchData(true)
                  }}
                  className="cursor-pointer rounded-md border border-white bg-white bg-opacity-70 py-1.5 px-6 font-medium text-gray-800"
                >
                  Enable Analytic
                </div>
              </div>
            )}
            <div className="flex h-[80px] items-end text-xs font-semibold">
              <h1 className="ml-[2px] mr-[11px] w-[10px] -rotate-90">
                PHYSICS
              </h1>
              <h1 className="mr-[10px] w-[10px] -rotate-90">CHEMISTRY</h1>
              <h1 className="mr-[10px] w-[10px] -rotate-90">BIOLOGY</h1>
              <h1 className="mr-[10px] w-[10px] -rotate-90">MATHS</h1>
              <h1 className="w-[10px] -rotate-90">COMPUTER</h1>
              <h1 className="w-full text-center text-base font-medium">
                School name
              </h1>
            </div>
            <div className="max-h-[216px] overflow-y-auto border-t border-gray-400">
              {Object.entries(indexBySchool || {}).map(
                ([key, val]: [key: string, val: any], i) => {
                  if (key === "") return <></>
                  return (
                    <div
                      className="flex items-center border-b border-gray-400 py-1"
                      key={`s-${i}`}
                    >
                      <div className="mr-2 flex space-x-1">
                        <h1 className="relative">
                          {getIndicator(val, "physics")}
                          {getDuped(val, "physics")}
                        </h1>
                        <h1 className="relative">
                          {getIndicator(val, "chemistry")}{" "}
                          {getDuped(val, "chemistry")}
                        </h1>
                        <h1 className="relative">
                          {getIndicator(val, "biology")}{" "}
                          {getDuped(val, "biology")}
                        </h1>
                        <h1 className="relative">
                          {getIndicator(val, "mathematics")}{" "}
                          {getDuped(val, "mathematics")}
                        </h1>
                        <h1 className="relative">
                          {getIndicator(val, "computer")}{" "}
                          {getDuped(val, "computer")}
                        </h1>
                      </div>
                      <h1 className="max-w-[250px] overflow-x-scroll whitespace-nowrap">
                        {key}
                      </h1>
                    </div>
                  )
                }
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 mr-4">
          <h1 className="mb-1 text-2xl font-semibold text-gray-600">
            Waiting{" "}
            <span className="text-base font-normal text-gray-500">
              - {appData.filter((d) => d.status === "waiting").length} showing -
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
            <div
              className="w-full cursor-pointer rounded-md border border-gray-400 py-1 text-center text-gray-500"
              onClick={() => {
                getAdditionalRecords("waiting")
              }}
            >
              Load More
            </div>
          </div>
        </div>
        <div className="mt-6 mr-4">
          <h1 className="mb-1 text-2xl font-semibold text-green-700">
            Accepted{" "}
            <span className="text-base font-normal text-gray-500">
              - {appData.filter((d) => d.status === "accepted").length} showing
              -
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
            <div
              className="w-full cursor-pointer rounded-md border border-gray-400 py-1 text-center text-gray-500"
              onClick={() => {
                getAdditionalRecords("accepted")
              }}
            >
              Load More
            </div>
          </div>
        </div>
        <div className="mt-6 mr-4">
          <h1 className="mb-1 text-2xl font-semibold text-red-700">
            Rejected{" "}
            <span className="text-base font-normal text-gray-500">
              - {appData.filter((d) => d.status === "rejected").length} showing
              -
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
            <div
              className="w-full cursor-pointer rounded-md border border-gray-400 py-1 text-center text-gray-500"
              onClick={() => {
                getAdditionalRecords("rejected")
              }}
            >
              Load More
            </div>
          </div>
        </div>
        <div className="mt-6 mr-4">
          <h1 className="mb-1 text-2xl font-semibold text-yellow-700">
            Editing{" "}
            <span className="text-base font-normal text-gray-500">
              - {appData.filter((d) => d.status === "editing").length} showing -
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
            <div
              className="w-full cursor-pointer rounded-md border border-gray-400 py-1 text-center text-gray-500"
              onClick={() => {
                getAdditionalRecords("editing")
              }}
            >
              Load More
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
