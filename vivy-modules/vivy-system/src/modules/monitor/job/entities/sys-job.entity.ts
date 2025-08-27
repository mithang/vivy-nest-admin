import { BaseBusinessEntity, BaseStatusEnum } from '@vivy-common/core'
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import * as parser from 'cron-parser'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * Cron expression validation, Bull uses cron-parser to parse
 */
@ValidatorConstraint({ name: 'isCronExpression', async: false })
export class IsCronExpression implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    try {
      parser.parseExpression(value)
      return true
    } catch (e) {
      return false
    }
  }

  defaultMessage(_args: ValidationArguments) {
    return 'this cron expression ($value) invalid'
  }
}

/**
 * Scheduled task table
 */
@Entity({ name: 'sys_job' })
export class SysJob extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'job_id',
    type: 'bigint',
    comment: 'Task ID',
  })
  @IsInt()
  @IsNotEmpty()
  jobId: number

  @Column({
    name: 'job_name',
    type: 'varchar',
    length: 100,
    comment: 'Task name',
  })
  @MaxLength(100)
  @IsNotEmpty()
  jobName: string

  @Column({
    name: 'job_group',
    type: 'varchar',
    length: 100,
    comment: 'Task group name',
  })
  @MaxLength(100)
  @IsNotEmpty()
  jobGroup: string

  @Column({
    name: 'invoke_target',
    type: 'varchar',
    length: 500,
    comment: 'Invoke target',
  })
  @MaxLength(100)
  @IsNotEmpty()
  invokeTarget: string

  @Column({
    name: 'invoke_params',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Invoke parameters',
  })
  @MaxLength(500)
  @IsOptional()
  invokeParams?: string

  @Column({
    name: 'cron_expression',
    type: 'varchar',
    length: 100,
    comment: 'Cron expression',
  })
  @Validate(IsCronExpression)
  @MaxLength(100)
  @IsNotEmpty()
  cronExpression: string

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
  @MaxLength(500)
  @IsOptional()
  remark?: string
}
