import { BaseBusinessEntity, BaseStatusEnum } from '@vivy-common/core'
import { IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * Dictionary type table
 */
@Entity({ name: 'sys_dict_type' })
export class SysDictType extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'dict_id',
    type: 'bigint',
    comment: 'Dictionary ID',
  })
  @IsInt()
  @IsNotEmpty()
  dictId: number

  @Column({
    name: 'dict_name',
    type: 'varchar',
    length: 100,
    comment: 'Dictionary name',
  })
  @MaxLength(100)
  @IsNotEmpty()
  dictName: string

  @Column({
    name: 'dict_type',
    type: 'varchar',
    length: 100,
    comment: 'Dictionary type',
  })
  @MaxLength(100)
  @IsNotEmpty()
  dictType: string

  @Column({
    name: 'dict_sort',
    type: 'int',
    default: 0,
    comment: 'Display order',
  })
  @IsInt()
  @IsOptional()
  dictSort: number

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: 'Dictionary status (0 normal 1 disabled)',
  })
  @IsEnum(BaseStatusEnum)
  @IsOptional()
  status: string
}
