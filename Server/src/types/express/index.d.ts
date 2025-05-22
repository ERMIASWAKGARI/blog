declare module 'jsonwebtoken'
declare module 'multer'
declare module 'bcrypt'
declare module 'cors'
declare module 'bcryptjs'
import { Request } from 'express'

export interface AuthenticatedRequest extends Request {
  user?: any
  file?: any
  files?: {
    image?: any[]
    video?: any[]
  }
}
