import { BaseBusinessEntity, BaseStatusEnum } from '@vivy-common/core'
import { IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * Dictionary data table
 */
@Entity({ name: 'sys_dict_data' })
export class SysDictData extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'dict_id',
    type: 'bigint',
    comment: 'Dictionary ID',
  })
  @IsInt()
  @IsNotEmpty()
  dictId: number

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
    name: 'dict_label',
    type: 'varchar',
    length: 100,
    comment: 'Dictionary label',
  })
  @MaxLength(100)
  @IsNotEmpty()
  dictLabel: string

  @Column({
    name: 'dict_value',
    type: 'varchar',
    length: 100,
    comment: 'Dictionary value',
  })
  @MaxLength(100)
  @IsNotEmpty()
  dictValue: string

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

  @Column({
    name: 'css_class',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Style attribute (other style extensions)',
  })
  @MaxLength(100)
  @IsOptional()
  cssClass?: string

  @Column({
    name: 'list_class',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Table echo style',
  })
  @MaxLength(100)
  @IsOptional()
  listClass?: string
}
