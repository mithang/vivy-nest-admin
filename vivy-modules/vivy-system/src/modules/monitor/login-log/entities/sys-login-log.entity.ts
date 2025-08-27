import { BaseStatusEnum, BaseTimeEntity } from '@vivy-common/core'
import { IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { LoginType } from '@/common/enums/login-type.enum'

/**
 * Login log table
 */
@Entity({ name: 'sys_login_log' })
export class SysLoginLog extends BaseTimeEntity {
  @PrimaryGeneratedColumn({
    name: 'login_id',
    type: 'bigint',
    comment: 'Login ID',
  })
  @IsInt()
  @IsNotEmpty()
  loginId: number

  @Column({
    name: 'login_name',
    type: 'varchar',
    length: 50,
    comment: 'User account',
  })
  @MaxLength(50)
  @IsNotEmpty()
  loginName: string

  @Column({
    name: 'login_type',
    type: 'char',
    length: 1,
    comment: 'Login type',
  })
  @IsEnum(LoginType)
  @IsNotEmpty()
  loginType: string

  @Column({
    name: 'login_status',
    type: 'char',
    length: 1,
    comment: 'Login status',
  })
  @IsEnum(BaseStatusEnum)
  @IsNotEmpty()
  loginStatus: string

  @Column({
    name: 'login_ip',
    type: 'varchar',
    length: 128,
    nullable: true,
    comment: 'Host address',
  })
  @MaxLength(128)
  @IsOptional()
  loginIp?: string

  @Column({
    name: 'login_location',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Login location',
  })
  @MaxLength(255)
  @IsOptional()
  loginLocation?: string

  @Column({
    name: 'login_message',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Login message',
  })
  @MaxLength(255)
  @IsOptional()
  loginMessage?: string

  @Column({
    name: 'user_agent',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'User agent',
  })
  @MaxLength(500)
  @IsOptional()
  userAgent?: string
}
