export interface SelectionData {
  subject:
    | "physics"
    | "chemistry"
    | "biology"
    | "mathematics"
    | "computer"
    | null
}

export const defaultSelectionData: SelectionData = {
  subject: null
}
