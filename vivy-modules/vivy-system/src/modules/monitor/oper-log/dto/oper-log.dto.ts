import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { SysOperLog } from '../entities/sys-oper-log.entity'

/**
 * Query operation logs
 */
export class ListOperLogDto extends PaginateDto {
  /** Module title */
  @Allow()
  title?: string

  /** Operation type */
  @Allow()
  operType?: string

  /** Operator */
  @Allow()
  operName?: string

  /** Operation status */
  @Allow()
  operStatus?: string

  /** Request URL */
  @Allow()
  requestUrl?: string

  /** Operation time */
  @Allow()
  createTime?: string[]
}

/**
 * Add operation log
 */
export class CreateOperLogDto extends OmitType(SysOperLog, ['operId'] as const) {}
