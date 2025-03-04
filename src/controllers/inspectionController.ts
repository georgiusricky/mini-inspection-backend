import type { Request, Response } from "express"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"
import type { Inspection, InspectionImage } from "../types"

const inspections: Inspection[] = []

export const getAllInspections = (req: Request, res: Response) => {
  res.json(inspections)
}

export const getInspectionById = (req: Request, res: Response) => {
  const inspection = inspections.find((i) => i.id === req.params.id)
  if (!inspection) {
    return res.status(404).json({ error: "Inspection not found" })
  }
  res.json(inspection)
}

export const createInspection = (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[]
    const descriptions = JSON.parse(req.body.descriptions || "[]")

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" })
    }

    const images: InspectionImage[] = files.map((file, index) => {
      return {
        id: uuidv4(),
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        description: descriptions[index] || "",
      }
    })

    const newInspection: Inspection = {
      id: uuidv4(),
      images,
      createdAt: new Date(),
    }

    inspections.push(newInspection)
    res.status(201).json(newInspection)
  } catch (error) {
    console.error("Error creating inspection:", error)
    res.status(500).json({ error: "Failed to create inspection" })
  }
}

export const deleteInspection = (req: Request, res: Response) => {
  const index = inspections.findIndex((i) => i.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ error: "Inspection not found" })
  }

  const inspection = inspections[index]
  inspection.images.forEach((image) => {
    try {
      fs.unlinkSync(image.path)
    } catch (err) {
      console.error(`Failed to delete image file: ${image.path}`, err)
    }
  })

  inspections.splice(index, 1)
  res.json({ message: "Inspection deleted successfully" })
}

