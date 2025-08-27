import { randomUUID } from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import { Request } from 'express'
import * as mime from 'mime'
import * as multer from 'multer'
import { UploadOptions, UploadClientOptions, UPLOAD_FILE_URL } from './upload.config'

/**
 * Join paths
 * @param paths Paths
 * @returns Path
 */
export const joinPath = (...paths: string[]) => {
  return path.join(...paths.map((p) => p || ''))
}

/**
 * Normalize name
 * @param file File information
 * @returns File name
 */
export const formatName = (file: Express.Multer.File) => {
  const originalname = file.originalname
  if (originalname.includes('.')) {
    return originalname
  } else {
    return originalname + '.' + mime.getExtension(file.mimetype)
  }
}

/**
 * Generate random name
 * @param filename File name
 * @returns Random name
 */
export const randomName = (filename: string) => {
  const now = Date.now()
  const uuid = randomUUID().replace(/-/g, '')
  return `${now}${uuid}${path.extname(filename)}`
}

/**
 * Custom Multer storage
 */
export const uploadStorage = (options: UploadOptions) => {
  return multer.diskStorage({
    destination(req: Request, file: Express.Multer.File, cb) {
      const uploadOptions: UploadOptions = options
      const clientOptions: UploadClientOptions = req.body

      const localPath = joinPath(uploadOptions.path, clientOptions.path)
      fs.mkdirSync(localPath, { recursive: true })

      cb(null, localPath)
    },
    filename(req: Request, file: Express.Multer.File, cb) {
      const uploadOptions: UploadOptions = options
      const clientOptions: UploadClientOptions = req.body
      const filename = formatName(file)
      const randomname = randomName(filename)

      const fileurl = joinPath(uploadOptions.domain, uploadOptions.prefix, clientOptions.path, randomname)
      file[UPLOAD_FILE_URL] = fileurl

      cb(null, randomname)
    },
  })
}
