import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow, IsArray, IsOptional } from 'class-validator'
import { SysUser } from '../entities/sys-user.entity'

/**
 * Query users
 */
export class ListUserDto extends PaginateDto {
  /** Department ID */
  @Allow()
  deptId?: number

  /** User account */
  @Allow()
  userName?: string

  /** User nickname */
  @Allow()
  nickName?: string

  /** User status (0 normal 1 disabled 2 deleted) */
  @Allow()
  status?: string
}

/**
 * Add user
 */
export class CreateUserDto extends OmitType(SysUser, ['userId'] as const) {
  /** User roles */
  @IsArray()
  @IsOptional()
  roleIds?: number[]

  /** User posts */
  @IsArray()
  @IsOptional()
  postIds?: number[]
}

/**
 * Update user
 */
export class UpdateUserDto extends OmitType(SysUser, ['userId', 'password']) {
  /** User roles */
  @IsArray()
  @IsOptional()
  roleIds?: number[]

  /** User posts */
  @IsArray()
  @IsOptional()
  postIds?: number[]
}
