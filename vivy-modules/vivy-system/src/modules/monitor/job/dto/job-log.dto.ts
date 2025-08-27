import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { SysJobLog } from '../entities/sys-job-log.entity'
/**
 * Query task logs
 */
export class ListJobLogDto extends PaginateDto {
  /** Task ID */
  @Allow()
  jobId?: number

  /** Task name */
  @Allow()
  jobName?: string

  /** Task group name */
  @Allow()
  jobGroup?: string

  /** Invoke target */
  @Allow()
  invokeTarget?: string

  /** Status (0 success 1 failure) */
  @Allow()
  status?: string
}

/**
 * Add task log
 */
export class CreateJobLogDto extends OmitType(SysJobLog, ['jobLogId'] as const) {}

/**
 * Update task log
 */
export class UpdateJobLogDto extends OmitType(SysJobLog, ['jobLogId'] as const) {}
