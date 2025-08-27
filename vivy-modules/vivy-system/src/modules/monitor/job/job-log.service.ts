import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { Like, Repository } from 'typeorm'
import { ListJobLogDto, CreateJobLogDto } from './dto/job-log.dto'
import { SysJobLog } from './entities/sys-job-log.entity'

/**
 * Scheduled task logs
 * @author vivy
 */
@Injectable()
export class JobLogService {
  constructor(
    @InjectRepository(SysJobLog)
    private jobLogRepository: Repository<SysJobLog>
  ) {}

  /**
   * Task log list
   * @param jobLog Task log information
   * @returns Task log list
   */
  async list(jobLog: ListJobLogDto): Promise<Pagination<SysJobLog>> {
    return paginate<SysJobLog>(
      this.jobLogRepository,
      {
        page: jobLog.page,
        limit: jobLog.limit,
      },
      {
        order: {
          createTime: 'DESC',
        },
        where: {
          jobId: jobLog.jobId,
          jobName: isNotEmpty(jobLog.jobName) ? Like(`%${jobLog.jobName}%`) : undefined,
          jobGroup: jobLog.jobGroup,
          invokeTarget: jobLog.invokeTarget,
          status: jobLog.status,
        },
      }
    )
  }

  /**
   * Add task log
   * @param jobLog Task log information
   */
  async add(jobLog: CreateJobLogDto): Promise<void> {
    await this.jobLogRepository.insert(jobLog)
  }

  /**
   * Task log details
   * @param jobLogId Task log ID
   * @returns Task log details
   */
  async info(jobLogId: number): Promise<SysJobLog> {
    return this.jobLogRepository.findOneBy({ jobLogId })
  }

  /**
   * Clear task log list
   */
  async clear(): Promise<void> {
    await this.jobLogRepository.clear()
  }
}
