import { BaseBusinessEntity, BaseStatusEnum } from '@vivy-common/core'
import { DataScopeType } from '@vivy-common/datascope'
import { IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * Role information table
 */
@Entity({ name: 'sys_role' })
export class SysRole extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'role_id',
    type: 'bigint',
    comment: 'Role ID',
  })
  @IsInt()
  @IsNotEmpty()
  roleId: number

  @Column({
    name: 'role_name',
    type: 'varchar',
    length: 50,
    comment: 'Role name',
  })
  @MaxLength(50)
  @IsNotEmpty()
  roleName: string

  @Column({
    name: 'role_code',
    type: 'varchar',
    length: 50,
    comment: 'Role code',
  })
  @MaxLength(50)
  @IsNotEmpty()
  roleCode: string

  @Column({
    name: 'role_sort',
    type: 'int',
    default: 0,
    comment: 'Display order',
  })
  @IsInt()
  @IsOptional()
  roleSort: number

  @Column({
    name: 'data_scope',
    type: 'char',
    length: 1,
    default: '1',
    comment:
      'Data scope (1 all data permissions 2 custom data permissions 3 department data permissions 4 department and below data permissions 5 personal data permissions only)',
  })
  @IsEnum(DataScopeType)
  @IsOptional()
  dataScope: string

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: 'Role status (0 normal 1 disabled)',
  })
  @IsEnum(BaseStatusEnum)
  @IsOptional()
  status: string
}
