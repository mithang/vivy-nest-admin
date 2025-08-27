import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { ListJobDto, CreateJobDto, UpdateJobDto } from './dto/job.dto'
import { JobService } from './job.service'

/**
 * Scheduled tasks
 * @author vivy
 */
@ApiTags('Scheduled tasks')
@ApiBearerAuth()
@Controller('jobs')
export class JobController {
  constructor(
    private jobService: JobService,
    private securityContext: SecurityContext
  ) {}

  /**
   * Scheduled task list
   * @param job Scheduled task information
   * @returns Scheduled task list
   */
  @Get()
  @RequirePermissions('monitor:job:list')
  async list(@Query() job: ListJobDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobService.list(job))
  }

  /**
   * Add scheduled task
   * @param job Scheduled task information
   */
  @Post()
  @Log({ title: 'Scheduled tasks', operType: OperType.INSERT })
  @RequirePermissions('monitor:job:add')
  async add(@Body() job: CreateJobDto): Promise<AjaxResult> {
    await this.jobService.checkInvokeTargetAllowed(job.invokeTarget)

    job.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.jobService.add(job))
  }

  /**
   * Update scheduled task
   * @param jobId Scheduled task ID
   * @param job Scheduled task information
   */
  @Put(':jobId')
  @Log({ title: 'Scheduled tasks', operType: OperType.UPDATE })
  @RequirePermissions('monitor:job:update')
  async update(@Param('jobId') jobId: number, @Body() job: UpdateJobDto): Promise<AjaxResult> {
    await this.jobService.checkInvokeTargetAllowed(job.invokeTarget)

    job.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.jobService.update(jobId, job))
  }

  /**
   * Delete scheduled task
   * @param jobIds Scheduled task IDs
   */
  @Delete(':jobIds')
  @Log({ title: 'Scheduled tasks', operType: OperType.DELETE })
  @RequirePermissions('monitor:job:delete')
  async delete(@Param('jobIds', new ParseArrayPipe({ items: Number })) jobIds: number[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobService.delete(jobIds))
  }

  /**
   * Scheduled task details
   * @param jobId Scheduled task ID
   * @returns Scheduled task details
   */
  @Get(':jobId')
  @RequirePermissions('monitor:job:query')
  async info(@Param('jobId') jobId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobService.info(jobId))
  }

  /**
   * Execute scheduled task once
   * @param jobId Scheduled task ID
   */
  @Post(':jobId/once')
  @RequirePermissions('monitor:job:add')
  @Log({ title: 'Scheduled tasks', operType: OperType.INSERT })
  async once(@Param('jobId') jobId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobService.once(jobId))
  }
}
