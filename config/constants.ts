
export const PORT = process.env.PORT || 3000
export const DB_TYPE = process.env.DB_TYPE || 'sqlite'
export const DATABASE = process.env.DATABASE || 'db.sqlite'

export const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
export const S3_BUCKET = process.env.S3_BUCKET

export const URL_EXPIRY_IN_HOURS = process.env.URL_EXPIRY_IN_HOURS || '6'
export const allowedMinLimit = process.env.ALLOWED_MIN_LIMIT || '5'
export const allowedMaxLimit = process.env.ALLOWED_MAX_LIMIT || '25'
export const allowedMinSizeLimit = process.env.ALLOWED_MAX_SIZE_LIMIT || '1'
export const allowedMaxSizeLimit = process.env.ALLOWED_MIN_SIZE_LIMIT || '10'

export const JWT_SECRET= process.env.JWT_SECRET