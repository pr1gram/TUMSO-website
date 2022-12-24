import { ExclamationTriangleIcon } from "@heroicons/react/20/solid"
import { CheckCircleIcon } from "@heroicons/react/24/solid"
import classnames from "classnames"
import type { FC } from "react"
import { useEffect, useState } from "react"

import { useRegister } from "@/contexts/RegisterContext"
import type { AvailableSections } from "@/types/AvailableSections"
import { subjectValidator, translateFromEng } from "@/utils/fixedSelection"
import {
  emailValidator,
  emptyStringValidator,
  phoneNumberValidator
} from "@/utils/validators"

export const SectionIndicator: FC<{ title: string; id: string }> = ({
  title,
  id
}) => {
  const { section, Storage } = useRegister()

  const [sectionValData, setSVD] = useState(false)

  const validateSection = () => {
    switch (id) {
      case "student": {
        const data = Storage.data.students
        let result = true
        Object.values(data).forEach((d) => {
          const feildResult =
            emptyStringValidator(d.title) &&
            emptyStringValidator(d.firstname) &&
            emptyStringValidator(d.lastname) &&
            emailValidator(d.email) &&
            phoneNumberValidator(d.phone)
          result = result && feildResult
        })
        return result
      }
      case "teacher": {
        const d = Storage.data.teacher
        const feildResult =
          emptyStringValidator(d.title) &&
          emptyStringValidator(d.firstname) &&
          emptyStringValidator(d.lastname) &&
          emailValidator(d.email) &&
          phoneNumberValidator(d.phone)
        return feildResult
      }
      case "selection": {
        const d = Storage.data.selection
        return subjectValidator(translateFromEng(d.subject))
      }
      case "document": {
        const d = Storage.data.document
        return d !== null && emptyStringValidator(d.filePath)
      }
      default:
        return false
    }
  }

  useEffect(() => {
    setSVD(validateSection)
  }, [Storage.storageDep])
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
      {sectionValData ? (
        <CheckCircleIcon className="h-4 w-4 text-green-600" />
      ) : (
        <ExclamationTriangleIcon
          className={classnames(
            section.is(id) && "mt-2 animate-bounce",
            "h-4 w-4 text-yellow-500"
          )}
        />
      )}
    </div>
  )
}
