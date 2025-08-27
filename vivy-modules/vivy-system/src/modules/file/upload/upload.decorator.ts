import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { UPLOAD_FILE_URL } from './upload.config'

/**
 * Get single file address
 */
export const UploadFileUrl = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()
  return request.file?.[UPLOAD_FILE_URL]
})

/**
 * Get multiple file addresses
 */
export const UploadFileUrls = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()
  return (request.files as Express.Multer.File[])?.map((file) => file[UPLOAD_FILE_URL])
})
