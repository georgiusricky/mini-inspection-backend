# mini-inspection-backend

A Node.js backend for handling inspection form submissions with image uploads.

## Features

- Image upload handling with Multer
- RESTful API for inspections
- TypeScript for type safety
- Express.js for API routes
- Local file storage

## API Endpoints

### GET /api/inspections
Get all inspections

### GET /api/inspections/:id
Get a specific inspection by ID

### POST /api/inspections
Create a new inspection with images
- Request: multipart/form-data
- Fields:
  - images: Array of image files
  - descriptions: JSON string array of descriptions for each image

### DELETE /api/inspections/:id
Delete an inspection and its associated images

## Setup

1. Install dependencies:
```bash
npm install

