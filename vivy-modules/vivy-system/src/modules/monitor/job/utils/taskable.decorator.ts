import { SetMetadata } from '@nestjs/common'
import { TASKABLE_METADATA } from './job.constants'

/**
 * Mark as scheduled task
 */
export const Taskable = () => {
  return SetMetadata(TASKABLE_METADATA, true)
}
