import { NextFunction, Request, Response } from 'express'

export interface AuthenticatedRequest extends Request {
  user?: any
  file?: any // Using any for file
  files?: any // Using any for files
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
