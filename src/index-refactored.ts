import express from "express"
import cors from "cors"
import path from "path"
import inspectionRoutes from "./routes/inspectionRoutes"

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const uploadsDir = path.join(__dirname, "../uploads")
app.use("/uploads", express.static(uploadsDir))

app.use("/api/inspections", inspectionRoutes)

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message || "Something went wrong!" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

