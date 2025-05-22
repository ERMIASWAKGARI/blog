import { Request } from 'express'

export interface AuthenticatedRequest extends Request {
  user?: any
  file?: Express.Multer.File
  files?: {
    image?: Express.Multer.File[]
    video?: Express.Multer.File[]
  }
}
