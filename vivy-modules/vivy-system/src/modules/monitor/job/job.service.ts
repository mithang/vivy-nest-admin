import { Injectable } from '@nestjs/common'
import { ModuleRef, Reflector } from '@nestjs/core'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { BaseStatusEnum, ServiceException } from '@vivy-common/core'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { DataSource, In, Like, Repository } from 'typeorm'
import { ListJobDto, CreateJobDto, UpdateJobDto } from './dto/job.dto'
import { SysJob } from './entities/sys-job.entity'
import { JobQueueService } from './job-queue.service'
import { TASKABLE_METADATA } from './utils/job.constants'

/**
 * Scheduled tasks
 * @author vivy
 */
@Injectable()
export class JobService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,

    @InjectRepository(SysJob)
    private jobRepository: Repository<SysJob>,

    private moduleRef: ModuleRef,
    private reflector: Reflector,
    private jobQueueService: JobQueueService
  ) {}

  /**
   * Scheduled task list
   * @param job Scheduled task information
   * @returns Scheduled task list
   */
  async list(job: ListJobDto): Promise<Pagination<SysJob>> {
    return paginate<SysJob>(
      this.jobRepository,
      {
        page: job.page,
        limit: job.limit,
      },
      {
        where: {
          jobName: isNotEmpty(job.jobName) ? Like(`%${job.jobName}%`) : undefined,
          jobGroup: job.jobGroup,
          invokeTarget: job.invokeTarget,
          status: job.status,
        },
      }
    )
  }

  /**
   * Add scheduled task
   * @param job Scheduled task information
   */
  async add(job: CreateJobDto): Promise<void> {
    const res = await this.jobRepository.save(job)
    if (res.status === BaseStatusEnum.NORMAL) {
      await this.jobQueueService.start(res)
    }
  }

  /**
   * Update scheduled task
   * @param jobId Scheduled task ID
   * @param job Scheduled task information
   */
  async update(jobId: number, job: UpdateJobDto): Promise<void> {
    await this.jobRepository.update(jobId, job)
    const res = await this.jobRepository.findOneBy({ jobId })
    if (res.status === BaseStatusEnum.NORMAL) {
      await this.jobQueueService.stop(res)
      await this.jobQueueService.start(res)
    } else {
      await this.jobQueueService.stop(res)
    }
  }

  /**
   * Delete scheduled task
   * @param jobIds Scheduled task ID
   */
  async delete(jobIds: number[]): Promise<void> {
    const jobs = await this.jobRepository.findBy({ jobId: In(jobIds) })
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(SysJob, jobIds)
      await Promise.all(jobs.map((job) => this.jobQueueService.stop(job)))
    })
  }

  /**
   * Scheduled task details
   * @param jobId Scheduled task ID
   * @returns Scheduled task details
   */
  async info(jobId: number): Promise<SysJob> {
    return this.jobRepository.findOneBy({ jobId })
  }

  /**
   * Execute scheduled task once
   * @param jobId Scheduled task ID
   */
  async once(jobId: number): Promise<void> {
    const job = await this.jobRepository.findOneBy({ jobId })
    await this.jobQueueService.once(job)
  }

  /**
   * Check if invoke target is valid
   * @param invokeTarget Invoke target string
   * @returns Exception thrown ServiceException
   */
  async checkInvokeTargetAllowed(invokeTarget: string) {
    // Check if task format is correct
    const target = invokeTarget.split('.')
    const [className, handleName] = target
    if (target.length !== 2) {
      throw new ServiceException('Invoke target is incorrect')
    }

    // Check if task name is correct
    let service: any
    try {
      service = await this.moduleRef.get(className, { strict: false })
    } catch {
      //
    }
    if (!service || typeof service[handleName] !== 'function') {
      throw new ServiceException('Invoke target does not exist')
    }

    // Check if marked as task
    const hasTaskable = this.reflector.get<boolean>(TASKABLE_METADATA, service.constructor)
    if (!hasTaskable) {
      throw new ServiceException('Invoke target does not have @Taskable decorator')
    }
  }
}
