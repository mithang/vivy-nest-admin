import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { SysFile } from '../entities/sys-file.entity'

/**
 * Query files
 */
export class ListFileDto extends PaginateDto {
  /** File usage */
  @Allow()
  fileUse?: string

  /** File path */
  @Allow()
  fileUrl?: string
}

/**
 * Add file
 */
export class CreateFileDto extends OmitType(SysFile, ['fileId'] as const) {}

/**
 * Update file
 */
export class UpdateFileDto extends OmitType(SysFile, ['fileId'] as const) {}
