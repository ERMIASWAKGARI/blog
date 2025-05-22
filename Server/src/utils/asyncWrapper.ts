import { NextFunction, Request, Response } from 'express'
// Use Express.Multer.File for file typings

export interface AuthenticatedRequest extends Request {
  user?: any
  file?: Express.Multer.File // Use Express.Multer.File directly
  files?:
    | {
        [key: string]: Express.Multer.File[] // Use Express.Multer.File here
      }
    | Express.Multer.File[] // And here
    | {
        image?: Express.Multer.File[] // And here
        video?: Express.Multer.File[] // And here
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
