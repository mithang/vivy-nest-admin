import { BaseBusinessEntity, BaseStatusEnum } from '@vivy-common/core'
import { IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * Parameter configuration table
 */
@Entity({ name: 'sys_config' })
export class SysConfig extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'config_id',
    type: 'bigint',
    comment: 'Parameter ID',
  })
  @IsInt()
  @IsNotEmpty()
  configId: number

  @Column({
    name: 'config_name',
    type: 'varchar',
    length: 100,
    comment: 'Parameter name',
  })
  @MaxLength(100)
  @IsNotEmpty()
  configName: string

  @Column({
    name: 'config_key',
    type: 'varchar',
    length: 100,
    comment: 'Parameter key',
  })
  @MaxLength(100)
  @IsNotEmpty()
  configKey: string

  @Column({
    name: 'config_value',
    type: 'varchar',
    length: 500,
    comment: 'Parameter value',
  })
  @MaxLength(500)
  @IsNotEmpty()
  configValue: string

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: 'Status (0 normal 1 disabled)',
  })
  @IsEnum(BaseStatusEnum)
  @IsOptional()
  status: string

  @Column({
    name: 'remark',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Remark',
  })
  @MaxLength(100)
  @IsOptional()
  remark?: string
}
