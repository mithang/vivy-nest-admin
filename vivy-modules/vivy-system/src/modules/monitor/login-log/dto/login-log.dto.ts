import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { SysLoginLog } from '../entities/sys-login-log.entity'

/**
 * Login log list
 */
export class ListLoginLogDto extends PaginateDto {
  /** User account */
  @Allow()
  loginName?: string

  /** Login status */
  @Allow()
  loginStatus?: string

  /** Login time */
  @Allow()
  createTime?: string[]
}

/**
 * Add login log
 */
export class CreateLoginLogDto extends OmitType(SysLoginLog, ['loginId'] as const) {}
