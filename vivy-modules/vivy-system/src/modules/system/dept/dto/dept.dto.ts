import { OmitType } from '@nestjs/mapped-types'
import { SysDept } from '../entities/sys-dept.entity'

/**
 * Add department
 */
export class CreateDeptDto extends OmitType(SysDept, ['deptId'] as const) {}

/**
 * Update department
 */
export class UpdateDeptDto extends OmitType(SysDept, ['deptId'] as const) {}
