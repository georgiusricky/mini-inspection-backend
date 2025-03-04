import express from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import {
  getAllInspections,
  getInspectionById,
  createInspection,
  deleteInspection,
} from "../controllers/inspectionController"

const router = express.Router()

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

router.get("/", getAllInspections)
router.get("/:id", getInspectionById)
router.post("/", upload.array("images"), createInspection)
router.delete("/:id", deleteInspection)

export default router

