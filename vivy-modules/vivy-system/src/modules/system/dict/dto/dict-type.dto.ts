import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { SysDictType } from '../entities/sys-dict-type.entity'

/**
 * Query dictionary type
 */
export class ListDictTypeDto extends PaginateDto {
  /** Dictionary name */
  @Allow()
  dictName?: string

  /** Dictionary type */
  @Allow()
  dictType?: string

  /** Dictionary status (0 normal 1 disabled) */
  @Allow()
  status?: string
}

/**
 * Add dictionary type
 */
export class CreateDictTypeDto extends OmitType(SysDictType, ['dictId'] as const) {}

/**
 * Update dictionary type
 */
export class UpdateDictTypeDto extends OmitType(SysDictType, ['dictId'] as const) {}
