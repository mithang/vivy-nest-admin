import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { SysNotice } from '../entities/sys-notice.entity'

/**
 * Query notices
 */
export class ListNoticeDto extends PaginateDto {
  /** Notice title */
  @Allow()
  noticeTitle?: string

  /** Notice type (1 notice 2 announcement) */
  @Allow()
  noticeType?: string
}

/**
 * Add notice
 */
export class CreateNoticeDto extends OmitType(SysNotice, ['noticeId'] as const) {}

/**
 * Update notice
 */
export class UpdateNoticeDto extends OmitType(SysNotice, ['noticeId'] as const) {}
