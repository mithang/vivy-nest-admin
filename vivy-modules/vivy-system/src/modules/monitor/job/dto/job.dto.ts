import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { SysJob } from '../entities/sys-job.entity'
/**
 * Query scheduled tasks
 */
export class ListJobDto extends PaginateDto {
  /** Task name */
  @Allow()
  jobName?: string

  /** Task group name */
  @Allow()
  jobGroup?: string

  /** Invoke target */
  @Allow()
  invokeTarget?: string

  /** Status (0 normal 1 disabled) */
  @Allow()
  status?: string
}

/**
 * Add scheduled task
 */
export class CreateJobDto extends OmitType(SysJob, ['jobId'] as const) {}

/**
 * Update scheduled task
 */
export class UpdateJobDto extends OmitType(SysJob, ['jobId'] as const) {}
