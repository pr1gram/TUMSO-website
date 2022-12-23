export const emptyStringValidator = (value: string) => {
  return value !== ""
}

export const generateIncludeValidator = (haystack: string[]) => {
  return (value: string | null) => {
    return (
      value !== null && haystack.includes(value) && emptyStringValidator(value)
    )
  }
}

export const emailValidator = (value: string) => {
  return value.includes("@") && value.includes(".")
}

export const phoneNumberValidator = (value: string) => {
  if (value.at(0) === "0") {
    return value.length === 10
  }

  return value.length === 9
}
