import { ClockIcon } from "@heroicons/react/24/outline"
import { CalendarIcon, ChevronUpIcon } from "@heroicons/react/24/solid"
import { motion, useScroll } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"

import { RevealText } from "@/components/texts/animated/reveal"
import { useTimer } from "@/hooks/useTimer"
import { useWindowDimensions } from "@/utils/dimension"
import { MONTH, nth, THMONTH } from "@/utils/timer"

const Page = () => {
  const { scrollY } = useScroll()
  const [sy, setSY] = useState(0)

  const { height } = useWindowDimensions()
  const [docHeight, setDocHeight] = useState(0)

  const { open, round } = useTimer()

  useEffect(() => {
    scrollY.onChange((d) => {
      setSY(d)
    })
  }, [])

  useEffect(() => {
    setDocHeight(document.body.offsetHeight - height)
  }, [height])

  const offset = 0
  const r = height - 787

  return (
    <div className="max-w-screen font-plus-jakarta-sans w-full overflow-x-hidden">
      <div className="relative z-[10] flex min-h-screen w-full flex-col items-center justify-center bg-white py-12">
        <RevealText
          transition={{ type: "tween", duration: 0.6 }}
          className="text-2xl font-semibold text-gray-900"
        >
          Welcome to TUMSO website
        </RevealText>
        <RevealText
          transition={{ type: "tween", delay: 0.4, duration: 0.6 }}
          className="pt-1 text-gray-600"
        >
          Registration starts {open.getDate()}
          {nth(open.getDate())} {MONTH[open.getMonth()]} {open.getFullYear()}
        </RevealText>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "tween", delay: 1.0, duration: 0.3 }}
          className="absolute bottom-10 flex animate-bounce flex-col items-center text-sm"
        >
          <ChevronUpIcon className="h-6 w-6" />
          <h1 className="-mt-1">Slide up</h1>
        </motion.div>
      </div>
      <div className="relative w-full">
        <motion.div
          animate={{
            width:
              // eslint-disable-next-line no-nested-ternary
              sy > 1500 + offset
                ? `${60 + (1500 - 200) * 6}px`
                : // eslint-disable-next-line no-nested-ternary
                sy < 200 + offset
                ? "60px"
                : sy > 650
                ? `${60 + (sy - 200) * 6}px`
                : `${60 + (sy - 200) * 3.5}px`,
            height:
              // eslint-disable-next-line no-nested-ternary
              sy > 1500 + offset
                ? `${60 + (1500 - 200) * 2}px`
                : sy < 200 + offset
                ? "60px"
                : `${60 + (sy - 200) * 3.5}px`,
            y:
              // eslint-disable-next-line no-nested-ternary
              sy > 1500 + offset
                ? `-${60 + (1500 - 200) * 0.2}px`
                : sy < 200 + offset
                ? "60px"
                : `-${60 + (sy - 200) * 0.2}px`,
            x:
              // eslint-disable-next-line no-nested-ternary
              sy > 1500 + offset
                ? `-${60 + (1500 - 200) * 0.4}px`
                : // eslint-disable-next-line no-nested-ternary
                sy < 200 + offset
                ? "60px"
                : sy > 650
                ? `-${60 + (sy - 200) * 0.4}px`
                : `-${60 + (sy - 200) * 0.2}px`
          }}
          className="absolute left-20 top-0 mt-12 h-6 w-6 rounded-full bg-gray-900"
        ></motion.div>
        <div className="font-noto-sans-thai relative z-[12] mb-48 flex flex-col pt-[200px] text-white sm:mb-56">
          <div className="mx-auto flex w-full flex-col items-center justify-center px-6">
            <div className="rounded-2xl px-10 py-4">
              <h1 className="text-center text-2xl font-semibold text-white">
                TUMSO คืออะไร
              </h1>
              <p className="mt-2 max-w-lg break-all text-center text-gray-200">
                TUMSO คือ
                การแข่งขันคณิตศาสตร์และวิทยาศาสตร์ระหว่างโรงเรียนครั้งที่{" "}
                {round} จัดขึ้นโดยโรงเรียนเตรียมอุมดมศึกษา
                เป็นการแข่งขันในรายวิชาคณิตศาสตร์ฟิสิกส์เคมี ชีววิทยา
                และคอมพิวเตอร์ โดยแข่งขันในลักษณะทีม ทีมละไม่เกิน 2 คน
                เข้าแข่งขันแยกกันในแต่ละรายวิชา{" "}
                (ในแต่ละรายวิชานักเรียนผู้เข้าแข่งขัน 1 ทีม
                <span className="inline-block">
                  ต้องมีครูผู้ควบคุมทีม 1 คน)
                </span>
              </p>
            </div>
            <div className="mt-16 w-full max-w-2xl border-b border-white border-opacity-50" />
            <div className="mt-20">
              <h1 className="text-center text-2xl font-semibold">
                สาขาที่เปิดรับสมัคร
              </h1>
              <div className="mt-6 flex max-w-[800px] flex-wrap items-center justify-center">
                <div className="mr-2 mb-4 flex w-[318px] flex-col justify-center rounded-md border border-white pt-2 text-white">
                  <div className="px-4">
                    <h1 className="text-lg font-semibold">Physics</h1>
                    <div className="flex h-[42px] items-center">
                      <Link
                        target={`_blank`}
                        href={`/documents/ระเบียบการแข่งขัน TUMSO 20th final.pdf`}
                        className="w-full rounded-lg bg-white px-6 py-1.5 text-center text-sm text-gray-900"
                      >
                        ดาวน์โหลดรายละเอียด
                      </Link>
                    </div>
                  </div>
                  <div className="mt-2 flex">
                    <div className="-mb-[1px] -ml-[1px] flex shrink-0 items-center space-x-1 rounded-bl-[7px] border border-white px-2 text-sm">
                      <ClockIcon className="h-4 w-4" />
                      <span className="mt-0.5">1 ชั่วโมงครึ่ง</span>
                    </div>
                    <div className="-mb-[1px] -mr-[1px] flex w-full items-center justify-center space-x-1 rounded-br-[7px] border border-white text-sm">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="mt-0.5">12th Jan 08.30 - 10.00</span>
                    </div>
                  </div>
                </div>

                <div className="relative mr-2 mb-4 flex max-w-[318px] cursor-not-allowed flex-col justify-center rounded-md border border-white pt-2 text-gray-500">
                  <h1 className="absolute z-10 w-full text-center text-white">
                    ยกเลิกการจัดสอบในรายวิชานี้
                  </h1>
                  <div
                    style={{ backdropFilter: "blur(2px)" }}
                    className="absolute h-full w-full"
                  />
                  <div className="px-4">
                    <h1 className="text-lg font-semibold">Mathematics</h1>
                    <p className="max-h-[42px] overflow-hidden break-all text-sm text-gray-500">
                      เนื้อหาที่ใช้สอบ :
                      เนื้อหารายวิชาคณิตศาสตร์ครอบคลุมหลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน
                      พุทธศักราช 2551
                    </p>
                  </div>
                  <div className="mt-2 flex">
                    <div className="-mb-[1px] -ml-[1px] flex shrink-0 items-center space-x-1 rounded-bl-[7px] border border-white px-2 text-sm">
                      <ClockIcon className="h-4 w-4" />
                      <span className="mt-0.5">- ชั่วโมง</span>
                    </div>
                    <div className="-mb-[1px] -mr-[1px] flex w-full items-center justify-center space-x-1 rounded-br-[7px] border border-white text-sm">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="mt-0.5">--rd Jan 08.30 - 10.00</span>
                    </div>
                  </div>
                </div>

                <div className="mr-2 mb-4 flex w-[318px] flex-col justify-center rounded-md border border-white pt-2 text-white">
                  <div className="px-4">
                    <h1 className="text-lg font-semibold">Chemistry</h1>
                    <div className="flex h-[42px] items-center">
                      <Link
                        target={`_blank`}
                        href={`/documents/ระเบียบการแข่งขัน TUMSO 20th final.pdf`}
                        className="w-full rounded-lg bg-white px-6 py-1.5 text-center text-sm text-gray-900"
                      >
                        ดาวน์โหลดรายละเอียด
                      </Link>
                    </div>
                  </div>
                  <div className="mt-2 flex">
                    <div className="-mb-[1px] -ml-[1px] flex shrink-0 items-center space-x-1 rounded-bl-[7px] border border-white px-2 text-sm">
                      <ClockIcon className="h-4 w-4" />
                      <span className="mt-0.5">1 ชั่วโมงครึ่ง</span>
                    </div>
                    <div className="-mb-[1px] -mr-[1px] flex w-full items-center justify-center space-x-1 rounded-br-[7px] border border-white text-sm">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="mt-0.5">12th Jan 08.30 - 10.00</span>
                    </div>
                  </div>
                </div>

                <div className="mr-2 mb-4 flex w-[318px] flex-col justify-center rounded-md border border-white pt-2 text-white">
                  <div className="px-4">
                    <h1 className="text-lg font-semibold">Biology</h1>
                    <div className="flex h-[42px] items-center">
                      <Link
                        target={`_blank`}
                        href={`/documents/ระเบียบการแข่งขัน TUMSO 20th final.pdf`}
                        className="w-full rounded-lg bg-white px-6 py-1.5 text-center text-sm text-gray-900"
                      >
                        ดาวน์โหลดรายละเอียด
                      </Link>
                    </div>
                  </div>
                  <div className="mt-2 flex">
                    <div className="-mb-[1px] -ml-[1px] flex shrink-0 items-center space-x-1 rounded-bl-[7px] border border-white px-2 text-sm">
                      <ClockIcon className="h-4 w-4" />
                      <span className="mt-0.5">1 ชั่วโมงครึ่ง</span>
                    </div>
                    <div className="-mb-[1px] -mr-[1px] flex w-full items-center justify-center space-x-1 rounded-br-[7px] border border-white text-sm">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="mt-0.5">12th Jan 08.30 - 10.00</span>
                    </div>
                  </div>
                </div>

                <div className="mr-2 mb-4 flex w-[318px] flex-col justify-center rounded-md border border-white pt-2 text-white">
                  <div className="px-4">
                    <h1 className="text-lg font-semibold">Computer</h1>
                    <div className="flex h-[42px] items-center">
                      <Link
                        target={`_blank`}
                        href={`/documents/ระเบียบการแข่งขัน TUMSO 20th final.pdf`}
                        className="w-full rounded-lg bg-white px-6 py-1.5 text-center text-sm text-gray-900"
                      >
                        ดาวน์โหลดรายละเอียด
                      </Link>
                    </div>
                  </div>
                  <div className="mt-2 flex">
                    <div className="-mb-[1px] -ml-[1px] flex shrink-0 items-center space-x-1 rounded-bl-[7px] border border-white px-2 text-sm">
                      <ClockIcon className="h-4 w-4" />
                      <span className="mt-0.5">1 ชั่วโมงครึ่ง</span>
                    </div>
                    <div className="-mb-[1px] -mr-[1px] flex w-full items-center justify-center space-x-1 rounded-br-[7px] border border-white text-sm">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="mt-0.5">12th Jan 08.30 - 10.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="font-noto-sans-thai relative z-[10] flex min-h-[500px] w-full items-center justify-center bg-white text-gray-900 sm:min-h-[787px] sm:py-32">
          <div className="absolute top-0 left-0 h-[200px] w-[140vw] sm:h-[400px] sm:w-[130vw] md:w-[120vw] lg:w-full">
            <motion.div
              animate={{
                height:
                  // eslint-disable-next-line no-nested-ternary
                  sy >= 1400 + offset
                    ? (sy / (1949 + offset)) * 100 * 1.2 > 100
                      ? "100%"
                      : `${(sy / (1949 + offset)) * 100 * 1.2}%`
                    : "25%"
              }}
              className="absolute top-0 left-0 h-full w-full rounded-b-full bg-gray-900"
            />
          </div>
          <div className="relative mx-auto flex w-full max-w-lg flex-col px-4 sm:px-0 switch:hidden">
            <motion.div className="relative z-[12] mx-auto flex w-full max-w-lg flex-col items-center rounded-xl bg-[#434894] py-8 text-white shadow-md">
              <div className="absolute top-0 left-0 flex h-full w-full p-1">
                <div className="w-full shrink rounded-lg border border-white" />
              </div>
              <h1 className="text-center text-xl font-semibold">
                สมัครเลยตอนนี้
              </h1>
              <p>ลงทะเบียนเข้าสมัครสอบ TUMSO</p>
              <div className="relative mt-6 p-1">
                <button className="min-w-[200px] rounded-lg bg-white py-2 px-4 font-medium text-gray-900 shadow-md">
                  ลงทะเบียน
                </button>
                <Link href="register">
                  <div className="absolute top-0 right-0 h-full w-full shrink rounded-xl border border-white" />
                </Link>
              </div>
              <p className="mt-2 text-center text-xs text-gray-400">
                เริ่มวันที่ {open.getDate()} {THMONTH[open.getMonth()]}{" "}
                {open.getFullYear()}
              </p>
            </motion.div>
          </div>
          <div className="relative mx-auto hidden w-full max-w-lg flex-col switch:flex">
            <motion.div
              animate={{
                y: sy > 2200 ? sy - 2200 + 200 : 0,
                x: sy >= docHeight - 100 ? "280px" : 0
              }}
              className="relative z-[12] mx-auto flex w-full max-w-lg flex-col items-center rounded-xl bg-[#434894] py-8 text-white shadow-md"
            >
              <div className="absolute top-0 left-0 flex h-full w-full p-1">
                <div className="w-full shrink rounded-lg border border-white" />
              </div>
              <h1 className="text-center text-xl font-semibold">
                สมัครเลยตอนนี้
              </h1>
              <p>ลงทะเบียนเข้าสมัครสอบ TUMSO</p>
              <div className="relative mt-6 p-1">
                <button className="min-w-[200px] rounded-lg bg-white py-2 px-4 font-medium text-gray-900 shadow-md">
                  ลงทะเบียน
                </button>
                <Link href="register">
                  <div className="absolute top-0 right-0 h-full w-full shrink rounded-xl border border-white" />
                </Link>
              </div>
              <p className="mt-2 text-center text-xs text-gray-400">
                เริ่มวันที่ {open.getDate()} {THMONTH[open.getMonth()]}{" "}
                {open.getFullYear()}
              </p>
            </motion.div>
            <motion.div
              className="absolute z-[11] mx-auto flex w-5 flex-col items-center rounded-xl bg-[#434894] py-8 text-white shadow-md"
              animate={{
                height: sy > 2100 ? `${210 + (sy - 2100) * 3}px` : "210px",
                // eslint-disable-next-line no-nested-ternary
                x: sy > 2100 ? (sy >= docHeight - 100 ? "200px" : "-100px") : 0,
                width: sy > 2100 ? `${32 + (sy - 2100) * 2}rem` : "100%"
              }}
            />
          </div>
        </div>
        <div className="font-noto-sans-thai relative z-[9] flex min-h-screen bg-white sm:min-h-[800px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: sy >= docHeight - 60 ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex w-full flex-col items-center justify-center pr-0 switch:w-1/2 switch:pr-[100px]"
          >
            <h1 className="mb-2 text-center text-2xl font-semibold">
              ติดต่อเรา
            </h1>
            <div className="text-center text-gray-800 switch:text-left">
              <h1>Facbook: TUMSO 19th</h1>
              <h1>Website: https://triamudom.ac.th</h1>
              <h1>โทร: 02-252-7302</h1>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Page
