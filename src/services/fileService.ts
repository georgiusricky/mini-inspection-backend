import multer from "multer"
import path from "path"
import fs from "fs"
import type { Request } from "express"

const uploadsDir = path.join(__dirname, "../../uploads")
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

export const upload = multer({
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

export const getFileUrl = (req: Request, filename: string): string => {
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`
}

export const deleteFile = (filePath: string): boolean => {
  try {
    fs.unlinkSync(filePath)
    return true
  } catch (err) {
    console.error(`Failed to delete file: ${filePath}`, err)
    return false
  }
}

