import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { GenTable } from '../entities/gen-table.entity'

/**
 * Query code generation
 */
export class ListGenDto extends PaginateDto {
  /** Table name */
  @Allow()
  tableName?: string

  /** Table comment */
  @Allow()
  tableComment?: string
}

/**
 * Add code generation
 */
export class CreateGenDto extends OmitType(GenTable, ['tableId'] as const) {}

/**
 * Update code generation
 */
export class UpdateGenDto extends OmitType(GenTable, [] as const) {}
