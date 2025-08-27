import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { SysConfig } from '../entities/sys-config.entity'

/**
 * Query parameter configuration
 */
export class ListConfigDto extends PaginateDto {
  /** Parameter name */
  @Allow()
  configName?: string

  /** Parameter key */
  @Allow()
  configKey?: string

  /** Status (0 normal 1 disabled) */
  @Allow()
  status?: string
}

/**
 * Add parameter configuration
 */
export class CreateConfigDto extends OmitType(SysConfig, ['configId'] as const) {}

/**
 * Update parameter configuration
 */
export class UpdateConfigDto extends OmitType(SysConfig, ['configId'] as const) {}
