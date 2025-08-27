import { Allow } from 'class-validator'

export const UPLOAD_OPTIONS = Symbol('UPLOAD_OPTIONS')
export const UPLOAD_FILE_URL = 'fileurl'

/**
 * Upload configuration
 */
export interface UploadOptions {
  /**
   * Upload path
   */
  path: string
  /**
   * Access prefix
   */
  prefix: string
  /**
   * Access domain
   */
  domain?: string
}

/**
 * Client dynamic configuration
 */
export class UploadClientOptions {
  /**
   * Custom path
   * @description Frontend passes in custom path, spliced with base upload path
   * @example formData.set('path', 'avatar')
   */
  @Allow()
  path?: string
}
