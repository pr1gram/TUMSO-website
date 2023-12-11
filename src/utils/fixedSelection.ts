import { generateIncludeValidator } from "@/utils/validators"

export const availableSelection = [
  "วิชาฟิสิกส์",
  "วิชาเคมี",
  "วิชาชีวะ",
  // "วิชาคณิตศาสตร์",
  "วิชาคอมพิวเตอร์"
]

const selMap = {
  physics: "วิชาฟิสิกส์",
  chemistry: "วิชาเคมี",
  biology: "วิชาชีวะ",
  mathematics: "วิชาคณิตศาสตร์",
  computer: "วิชาคอมพิวเตอร์"
}

const flip = (obj: any) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]))

export const translateToEng = (value: string) => {
  const map = flip(selMap)
  return map[value]
}

export const translateFromEng = (value: any) => {
  // @ts-ignore
  return selMap[value]
}
export const subjectValidator = generateIncludeValidator(availableSelection)
