import { handleError } from './errorhandlingHelper.js'
import cloudinary from 'cloudinary'
import fs from 'fs'
const saveCloudnaryImage = async function (file) {
  try {
    let image = await cloudinary.uploader.upload(file.path)
    if (image && Object.keys(image).length !== 0 && image.url) {
      await fs.unlink(file.path, (error) => {
        if (error) {
          console.error('Error deleting file:', error)
        } else {
          console.log('File deleted successfully')
        }
      })
    }
    return image.url
  } catch (error) {
    handleError(
      undefined,
      undefined,
      { value: undefined },
      `Error occurred while Uploading Image In cloud>>> ${error}`
    )
  }
}
export { saveCloudnaryImage }