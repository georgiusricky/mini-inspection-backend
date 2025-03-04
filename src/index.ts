import express from "express"
import cors from "cors"
import multer from "multer"
import path from "path"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"

interface InspectionImage {
  id: string
  filename: string
  originalName: string
  path: string
  url: string
  description: string
}

interface Inspection {
  id: string
  images: InspectionImage[]
  createdAt: Date
}

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const uploadsDir = path.join(__dirname, "../uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, `${uniqueSuffix}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed") as any)
    }
  },
})

const inspections: Inspection[] = []

app.use("/uploads", express.static(uploadsDir))


app.get("/api/inspections", (req, res) => {
  res.json(inspections)
})

app.get("/api/inspections/:id", (req, res) => {
  const inspection = inspections.find((i) => i.id === req.params.id)
  if (!inspection) {
    return res.status(404).json({ error: "Inspection not found" })
  }
  res.json(inspection)
})

app.post("/api/inspections", upload.array("images"), (req, res) => {
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
})

app.delete("/api/inspections/:id", (req, res) => {
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
})

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large. Maximum size is 10MB." })
  }

  if (err.message === "Only image files are allowed") {
    return res.status(400).json({ error: "Only image files are allowed." })
  }

  res.status(500).json({ error: err.message || "Something went wrong!" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

