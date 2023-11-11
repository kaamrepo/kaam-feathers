import { S3Client } from '@aws-sdk/client-s3'
export const amazonS3bucket = () => {
  return new S3Client({
    region: process.env.KAAM_AWS_REGION,
    credentials: {
      accessKeyId: process.env.KAAM_AWS_ACCESS_KEY,
      secretAccessKey: process.env.KAAM_AWS_SECRETACCESS_KEY
    }
  })
}
