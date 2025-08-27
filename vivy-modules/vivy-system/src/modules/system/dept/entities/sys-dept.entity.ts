import { BaseBusinessEntity, BaseStatusEnum } from '@vivy-common/core'
import { IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * Department table
 */
@Entity({ name: 'sys_dept' })
export class SysDept extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'dept_id',
    type: 'bigint',
    comment: 'Department ID',
  })
  @IsInt()
  @IsNotEmpty()
  deptId: number

  @Column({
    name: 'parent_id',
    type: 'bigint',
    default: 0,
    comment: 'Parent department ID',
  })
  @IsInt()
  @IsOptional()
  parentId: number

  @Column({
    name: 'ancestors',
    type: 'varchar',
    length: 200,
    default: '0',
    comment: 'Ancestor list',
  })
  @MaxLength(200)
  @IsOptional()
  ancestors: string

  @Column({
    name: 'dept_name',
    type: 'varchar',
    length: 50,
    comment: 'Department name',
  })
  @MaxLength(50)
  @IsNotEmpty()
  deptName: string

  @Column({
    name: 'dept_sort',
    type: 'int',
    default: 0,
    comment: 'Display order',
  })
  @IsInt()
  @IsOptional()
  deptSort: number

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: 'Department status (0 normal 1 disabled)',
  })
  @IsEnum(BaseStatusEnum)
  @IsOptional()
  status: string
}
