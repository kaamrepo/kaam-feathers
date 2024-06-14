import { UPLOAD_TYPE } from '../constant/enums.js'
import fs from 'fs'
import multer from 'multer'
import cloudinary from 'cloudinary'
import AWS from 'aws-sdk'
import { logger } from '../logger.js'
export default function commonUploadHandler(options = {}) {
  // aws bucket configurations
  AWS.config.update({
    accessKeyId: process.env.KAAM_AWS_ACCESS_KEY,
    secretAccessKey: process.env.KAAM_AWS_SECRETACCESS_KEY,
    region: process.env.KAAM_AWS_REGION
  })
  const s3 = new AWS.S3()
  // Configure Multer storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folderName = getFolderName(req, file, options)
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName)
      }
      cb(null, folderName)
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`)
    }
  })
  // Configure Multer file filter
  const fileFilter = (req, file, cb) => {
    if (options.allowedTypes && !options.allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'), false)
    }
    cb(null, true)
  }
  // Create a Multer instance with file size and type validations
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: options.maxSize || 1024 * 1024 * 5 // Default: 5MB
    }
  })
  // Check file type from env else set default local
  const uploadType = process.env.FILE_UPLOAD_TYPE || UPLOAD_TYPE.LOCAL
  logger.info(`UploadType:-${uploadType}`)
  // Handle different upload types
  switch (uploadType) {
    case UPLOAD_TYPE.LOCAL:
      return (req, res, next) => {
        upload.fields(options.fields)(req, res, (err) => {
          if (err) {
            return next(err)
          }
          const hostUrl = `${process.env.SERVER_ENDPOINT}/api/images`
          // Upload to local
          if (req.files && Object.keys(req.files).length > 0) {
            const uploadedFiles = {}
            options.fields.forEach((file) => {
              const uploadedFile = req.files[file.name]
              if (Array.isArray(uploadedFile)) {
                uploadedFiles[file.name] = uploadedFile.map((elem) => {
                  return `${hostUrl}/${elem.fieldname}/${elem.filename}`
                })
              }
            })
            req.files = uploadedFiles
          }
          next()
        })
      }
    case UPLOAD_TYPE.CLOUDINARY:
      return (req, res, next) => {
        upload.fields(options.fields)(req, res, async (err) => {
          if (err) {
            return next(err)
          }
          // Upload to Cloudinary
          if (req.files && Object.keys(req.files).length > 0) {
            const uploadedFiles = {}
            for (const opfile of options.fields) {
              const uploadedFile = req.files[opfile.name]
              const uploadPromises = []
              for (const file of uploadedFile) {
                uploadPromises.push(
                  cloudinary.uploader.upload(file.path).then((result) => {
                    return result.secure_url
                  })
                )
              }
              const uploadResults = await Promise.all(uploadPromises)
              uploadedFiles[opfile.name] = uploadResults
            }
            if (req.files && Object.keys(req.files).length > 0) {
              for (const [fieldname, files] of Object.entries(req.files)) {
                for (const file of files) {
                  fs.unlink(file.path, (err) => {
                    if (err) {
                      console.error(err)
                    }
                  })
                }
              }
            }
            req.files = uploadedFiles
          }
          next()
        })
      }
    case UPLOAD_TYPE.S3_BUCKET:
      return (req, res, next) => {
        upload.fields(options.fields)(req, res, async (err) => {
          if (err) {
            return next(err)
          }
          if (req.files && Object.keys(req.files).length > 0) {
            const uploadedFiles = {}
            for (const opfile of options.fields) {
              const uploadedFile = req.files[opfile.name]
              const uploadPromises = []
              for (const file of uploadedFile) {
                const key = `uploads/${Date.now()}-${Math.floor(Math.random() * 1000)}-${file.originalname}`
                const uploadParams = {
                  Bucket: process.env.KAAM_S3_BUCKET_NAME,
                  Key: key,
                  Body: fs.createReadStream(file.path)
                }
                uploadPromises.push(s3.upload(uploadParams).promise())
              }
              const uploadResults = await Promise.all(uploadPromises)
              uploadedFiles[opfile.name] = uploadResults.map((result) => result.Location)
            }
            if (req.files && Object.keys(req.files).length > 0) {
              for (const [fieldname, files] of Object.entries(req.files)) {
                for (const file of files) {
                  fs.unlink(file.path, (err) => {
                    if (err) {
                      console.error(err)
                    }
                  })
                }
              }
            }
            req.files = uploadedFiles
          }
          next()
        })
      }
    default:
      throw new Error('Invalid upload type')
  }
}
function getFolderName(req, file, options) {
  const folderName = `public/images/${file.fieldname}`
  return folderName
}
