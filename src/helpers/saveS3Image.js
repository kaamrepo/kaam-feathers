// s3ImageHandler.js
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { amazonS3bucket } from '../utils/amazonS3bucket.js'
const s3 = amazonS3bucket()
const saveS3Image = async function (file) {
  try {
    const key = `uploads/${Date.now()}-${Math.floor(Math.random() * 1000)}-${file.originalname}`
    const params = {
      Bucket: process.env.KAAM_S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer
    }
    const command = new PutObjectCommand(params)
    await s3.send(command)
    const url = `https://${process.env.KAAM_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`
    return url
  } catch (error) {
    console.error(`Error occurred while uploading image to S3: ${error.message}`)
    throw error
  }
}

export { saveS3Image }
