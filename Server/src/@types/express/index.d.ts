// Import the original Express types
import 'express'

// Declare module augmentation
declare module 'express' {
  interface Request {
    user?: any
    file?: any
    files?: any
  }
}
