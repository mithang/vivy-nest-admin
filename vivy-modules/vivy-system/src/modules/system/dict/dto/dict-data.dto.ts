import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { SysDictData } from '../entities/sys-dict-data.entity'

/**
 * Query dictionary data
 */
export class ListDictDataDto extends PaginateDto {
  /** Dictionary type */
  @Allow()
  dictType?: string

  /** Dictionary label */
  @Allow()
  dictLabel?: string

  /** Dictionary status (0 normal 1 disabled) */
  @Allow()
  status?: string
}

/**
 * Add dictionary data
 */
export class CreateDictDataDto extends OmitType(SysDictData, ['dictId'] as const) {}

/**
 * Update dictionary data
 */
export class UpdateDictDataDto extends OmitType(SysDictData, ['dictId'] as const) {}
