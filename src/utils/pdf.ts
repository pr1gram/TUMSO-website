import type { Color, PDFFont, PDFPage } from "pdf-lib"
import { degrees } from "pdf-lib"

export const loadFileUrl = async (url: string) => {
  const fileData = await fetch(url).then((res) => res.arrayBuffer())
  return fileData
}

export interface TextObject {
  text: string
  width: number
}

export const drawCenteredText = (
  text: TextObject,
  page: PDFPage,
  font: PDFFont,
  y: number,
  size: number,
  color: Color
) => {
  const { width, height } = page.getSize()
  page.drawText(text.text, {
    x: (width - text.width) / 2,
    y: height - y,
    size,
    font,
    color,
    rotate: degrees(0)
  })
}

export const textObjectFactory = (
  font: PDFFont,
  page: PDFPage,
  size?: number
) => {
  const createFontObject = (text: string, fsize = size): TextObject => {
    return {
      text,
      width: font.widthOfTextAtSize(text, fsize || 0)
    }
  }

  const drawCText = (
    text: TextObject,
    y: number,
    color: Color,
    tsize = size
  ) => {
    drawCenteredText(text, page, font, y, tsize || 0, color)
  }
  return {
    create: createFontObject,
    drawCenteredText: drawCText
  }
}

const downloadURL = (data: string, fileName: string) => {
  const a = document.createElement("a")
  a.href = data
  a.download = fileName
  document.body.appendChild(a)
  a.style.display = "none"
  a.click()
  a.remove()
}

export const downloadBlob = (
  data: Uint8Array,
  fileName: string,
  mimeType: string
) => {
  const blob = new Blob([data], {
    type: mimeType
  })

  const url = window.URL.createObjectURL(blob)

  downloadURL(url, fileName)

  setTimeout(() => window.URL.revokeObjectURL(url), 1000)
}
