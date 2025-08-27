import { BaseStatusEnum, BaseTimeEntity } from '@vivy-common/core'
import { OperType } from '@vivy-common/logger'
import { IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * Operation log table
 */
@Entity({ name: 'sys_oper_log' })
export class SysOperLog extends BaseTimeEntity {
  @PrimaryGeneratedColumn({
    name: 'oper_id',
    type: 'bigint',
    comment: 'Operation ID',
  })
  @IsInt()
  @IsNotEmpty()
  operId: number

  @Column({
    name: 'title',
    type: 'varchar',
    length: 50,
    comment: 'Module title',
  })
  @MaxLength(50)
  @IsNotEmpty()
  title: string

  @Column({
    name: 'oper_type',
    type: 'char',
    length: 2,
    comment: 'Operation type',
  })
  @IsEnum(OperType)
  @IsNotEmpty()
  operType: string

  @Column({
    name: 'oper_name',
    type: 'varchar',
    length: 50,
    comment: 'Operator',
  })
  @MaxLength(50)
  @IsNotEmpty()
  operName: string

  @Column({
    name: 'oper_method',
    type: 'varchar',
    length: 100,
    comment: 'Method name',
  })
  @MaxLength(100)
  @IsNotEmpty()
  operMethod: string

  @Column({
    name: 'oper_ip',
    type: 'varchar',
    length: 128,
    nullable: true,
    comment: 'Host address',
  })
  @MaxLength(128)
  @IsOptional()
  operIp?: string

  @Column({
    name: 'oper_location',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Operation location',
  })
  @MaxLength(255)
  @IsOptional()
  operLocation?: string

  @Column({
    name: 'oper_status',
    type: 'char',
    length: 1,
    comment: 'Operation status',
  })
  @IsEnum(BaseStatusEnum)
  @IsNotEmpty()
  operStatus: string

  @Column({
    name: 'request_url',
    type: 'varchar',
    length: 1000,
    comment: 'Request URL',
  })
  @MaxLength(1000)
  @IsNotEmpty()
  requestUrl: string

  @Column({
    name: 'request_method',
    type: 'varchar',
    length: 10,
    comment: 'Request method',
  })
  @MaxLength(10)
  @IsNotEmpty()
  requestMethod: string

  @Column({
    name: 'request_param',
    type: 'varchar',
    length: 2000,
    nullable: true,
    comment: 'Request parameters',
  })
  @MaxLength(2000)
  @IsOptional()
  requestParam?: string

  @Column({
    name: 'request_result',
    type: 'varchar',
    length: 2000,
    nullable: true,
    comment: 'Request result',
  })
  @MaxLength(2000)
  @IsOptional()
  requestResult?: string

  @Column({
    name: 'request_errmsg',
    type: 'varchar',
    length: 2000,
    nullable: true,
    comment: 'Request error message',
  })
  @MaxLength(2000)
  @IsOptional()
  requestErrmsg?: string
}
