import type { Request, Response, NextFunction } from "express"

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large. Maximum size is 10MB." })
  }

  if (err.message === "Only image files are allowed") {
    return res.status(400).json({ error: "Only image files are allowed." })
  }

  res.status(500).json({ error: err.message || "Something went wrong!" })
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: `Not found - ${req.originalUrl}` })
}

