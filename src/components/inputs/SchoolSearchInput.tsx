import type { Dispatch, FC } from "react"
import { useEffect, useState } from "react"
import { ReactSearchAutocomplete } from "react-search-autocomplete"

const possibleFirstLetters = [
  "ก",
  "ข",
  "ค",
  "ฆ",
  "ง",
  "จ",
  "ฉ",
  "ช",
  "ซ",
  "ญ",
  "ฐ",
  "ณ",
  "ด",
  "ต",
  "ถ",
  "ท",
  "ธ",
  "น",
  "บ",
  "ป",
  "ผ",
  "ฝ",
  "พ",
  "ฟ",
  "ภ",
  "ม",
  "ย",
  "ร",
  "ฤ",
  "ล",
  "ว",
  "ศ",
  "ส",
  "ห",
  "อ",
  "ฮ",
  "เ",
  "แ",
  "โ",
  "ใ",
  "ไ"
]
const possibleBarnLetters = [
  "ก",
  "ข",
  "ค",
  "ฆ",
  "ง",
  "จ",
  "ฉ",
  "ช",
  "ซ",
  "ณ",
  "ด",
  "ต",
  "ถ",
  "ท",
  "ธ",
  "น",
  "บ",
  "ป",
  "ผ",
  "ฝ",
  "พ",
  "ฟ",
  "ภ",
  "ม",
  "ย",
  "ร",
  "ฤ",
  "ล",
  "ว",
  "ศ",
  "ส",
  "ห",
  "อ",
  "ฮ",
  "เ",
  "แ",
  "โ",
  "ใ",
  "ไ"
]

const possibleWatLetter = [
  "ก",
  "ข",
  "ค",
  "ฆ",
  "ง",
  "จ",
  "ฉ",
  "ช",
  "ซ",
  "ญ",
  "ด",
  "ต",
  "ถ",
  "ท",
  "ธ",
  "น",
  "บ",
  "ป",
  "ผ",
  "ฝ",
  "พ",
  "ฟ",
  "ภ",
  "ม",
  "ย",
  "ร",
  "ฤ",
  "ล",
  "ว",
  "ศ",
  "ส",
  "ห",
  "อ",
  "ฮ",
  "เ",
  "แ",
  "โ",
  "ใ",
  "ไ"
]

export const SchoolSearchInput: FC<{ updateState: Dispatch<string> }> = ({
  updateState
}) => {
  const [items, setItems] = useState<{ id: number; name: string }[]>([])
  const [keyword, setKW] = useState("")
  const [prevFL, setPrevFL] = useState("")
  const [selection, setSelection] = useState("")
  const [reloadStr, setReloadStr] = useState<string>("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    updateState(selection)
  }, [selection])

  const getSchoolIndex = async (startChar: string, subDir?: string) => {
    if (startChar === prevFL) return
    let data
    setLoading(true)
    if (subDir) {
      data = await fetch(`/schools/indexed/${subDir}/${startChar}.csv`, {
        method: "GET"
      })
    } else {
      data = await fetch(`/schools/indexed/${startChar}.csv`, {
        method: "GET"
      })
    }
    const unpacked = await data.text()
    const processed = unpacked.split("\n").map((i, k) => ({
      id: k,
      name: `โรงเรียน${subDir ? subDir + i : i}`
    }))
    setItems(processed)
    setPrevFL(startChar)
    setLoading(false)
  }

  useEffect(() => {
    if (keyword !== selection) {
      setSelection("")
    }
    const escaped = `_${keyword}`.replace("_โรงเรียน", "").replace("_", "")
    const es = `_${escaped}`
    if (es.includes("_บ้าน")) {
      const fl = es.replace("_บ้าน", "").replace("_", "").at(0) || ""
      if (!possibleBarnLetters.includes(fl)) return
      getSchoolIndex(fl, "บ้าน")
      return
    }
    if (es.includes("_วัด")) {
      const fl = es.replace("_วัด", "").replace("_", "").at(0) || ""
      if (!possibleWatLetter.includes(fl)) return
      getSchoolIndex(fl, "วัด")
      return
    }
    const firstLetter = escaped.at(0) || ""
    if (!possibleFirstLetters.includes(firstLetter)) return
    getSchoolIndex(firstLetter)
  }, [keyword])

  useEffect(() => {
    if (items.length > 0) {
      console.log(keyword)
      setReloadStr(keyword)
    }
  }, [items])
  return (
    <div>
      <ReactSearchAutocomplete
        onSearch={(keywor) => {
          setKW(keywor)
        }}
        onSelect={(v: any) => {
          setSelection(v.name)
        }}
        inputSearchString={reloadStr}
        showNoResultsText={loading ? "กำลังโหลดข้อมูล..." : "ไม่พบในฐานข้อมูล"}
        maxResults={10}
        styling={{
          boxShadow: "none",
          zIndex: 29,
          borderRadius: "6px",
          height: "32px",
          color: "rgb(17, 24, 39)",
          fontFamily: "inherit",
          border: "1px solid rgba(107, 114, 128, 0.6)",
          searchIconMargin: "0 0 0 26px"
        }}
        items={items}
      />
    </div>
  )
}
