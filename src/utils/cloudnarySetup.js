import cloudinary from 'cloudinary'
export const CloudnarySetup=(app)=>{
    cloudinary.config({
        cloud_name: app.get('cloudName'),
        api_key: app.get('apiKey'),
        api_secret: app.get('apiSecret')
    })
}