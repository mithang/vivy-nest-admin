import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { DataScopeType } from '@vivy-common/datascope'
import { Allow, IsArray, IsEnum, IsOptional } from 'class-validator'
import { SysRole } from '../entities/sys-role.entity'

/**
 * Query roles
 */
export class ListRoleDto extends PaginateDto {
  /** Role name */
  @Allow()
  roleName?: string

  /** Role code */
  @Allow()
  roleCode?: string

  /** Role status (0 normal 1 disabled) */
  @Allow()
  status?: string
}

/**
 * Add role
 */
export class CreateRoleDto extends OmitType(SysRole, ['roleId'] as const) {
  /** Menu permissions */
  @IsArray()
  @IsOptional()
  menuIds?: number[]

  /** Department permissions */
  // @IsArray()
  // @IsOptional()
  // deptIds?: number[]
}

/**
 * Update role
 */
export class UpdateRoleDto extends OmitType(SysRole, ['roleId'] as const) {
  /** Menu permissions */
  @IsArray()
  @IsOptional()
  menuIds?: number[]

  /** Department permissions */
  // @IsArray()
  // @IsOptional()
  // deptIds?: number[]
}

/**
 * Update data scope
 */
export class UpdateDataScopeDto {
  /** Data scope */
  @IsEnum(DataScopeType)
  dataScope: string

  /** Department permissions */
  @IsArray()
  @IsOptional()
  deptIds?: number[]
}
