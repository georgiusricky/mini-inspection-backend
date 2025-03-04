export interface InspectionImage {
  id: string
  filename: string
  originalName: string
  path: string
  url: string
  description: string
}

export interface Inspection {
  id: string
  images: InspectionImage[]
  createdAt: Date
}

