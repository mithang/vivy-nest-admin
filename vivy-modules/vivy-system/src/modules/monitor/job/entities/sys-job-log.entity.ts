import { BaseTimeEntity, BaseStatusEnum } from '@vivy-common/core'
import { IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * Scheduled task log table
 */
@Entity({ name: 'sys_job_log' })
export class SysJobLog extends BaseTimeEntity {
  @PrimaryGeneratedColumn({
    name: 'job_log_id',
    type: 'bigint',
    comment: 'Task log ID',
  })
  @IsInt()
  @IsNotEmpty()
  jobLogId: number

  @Column({
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
  @IsNotEmpty()
  invokeParams?: string

  @Column({
    name: 'invoke_message',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Invoke message',
  })
  @MaxLength(500)
  @IsOptional()
  invokeMessage?: string

  @Column({
    name: 'exception_message',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Exception message',
  })
  @MaxLength(500)
  @IsOptional()
  exceptionMessage?: string

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: 'Status (0 success 1 failure)',
  })
  @IsEnum(BaseStatusEnum)
  @IsOptional()
  status: string
}
