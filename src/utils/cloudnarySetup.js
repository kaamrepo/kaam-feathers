import cloudinary from 'cloudinary'
import { logger } from '../logger.js'
export const CloudnarySetup = async (app) => {
  try {
    cloudinary.config({
      cloud_name: app.get('cloudName'),
      api_key: app.get('apiKey'),
      api_secret: app.get('apiSecret')
    })
    logger.info('Cloudinary connection successful!')
  } catch (error) {
    logger.error('Error connecting to Cloudinary:', error)
    throw error
  }
}