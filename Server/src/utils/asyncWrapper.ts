import { NextFunction, Request, Response } from 'express'

export interface AuthenticatedRequest extends Request {
  user?: any
  file?: Express.Multer.File
  files?:
    | {
        [key: string]: Express.Multer.File[]
      }
    | Express.Multer.File[]
    | {
        image?: Express.Multer.File[]
        video?: Express.Multer.File[]
      }
}

type AsyncHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<any>

const asyncWrapper = (fn: AsyncHandler) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}

export default asyncWrapper
