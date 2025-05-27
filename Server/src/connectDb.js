const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

const connectDB = async () => {
  try {
    const connectionString = process.env.CONNECTION_STRING

    if (!connectionString) {
      throw new Error(
        'MongoDB connection string is not defined in environment variables'
      )
    }

    await mongoose.connect(connectionString)

    console.log('DB connected successfully')
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

module.exports = { connectDB }
