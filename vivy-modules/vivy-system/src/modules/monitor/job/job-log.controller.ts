import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { ListJobLogDto, CreateJobLogDto } from './dto/job-log.dto'
import { JobLogService } from './job-log.service'

/**
 * Scheduled task logs
 * @author vivy
 */
@ApiTags('Scheduled task logs')
@ApiBearerAuth()
@Controller('job/logs')
export class JobLogController {
  constructor(private jobLogService: JobLogService) {}

  /**
   * Task log list
   * @param jobLog Task log information
   * @returns Task log list
   */
  @Get()
  @RequirePermissions('monitor:job:list')
  async list(@Query() jobLog: ListJobLogDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobLogService.list(jobLog))
  }

  /**
   * Add task log
   * @param jobLog Task log information
   */
  @Post()
  @Log({ title: 'Task logs', operType: OperType.INSERT })
  @RequirePermissions('monitor:job:list')
  async add(@Body() jobLog: CreateJobLogDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobLogService.add(jobLog))
  }

  /**
   * Task log details
   * @param jobLogId Task log ID
   * @returns Task log details
   */
  @Get(':jobLogId')
  @RequirePermissions('monitor:job:list')
  async info(@Param('jobLogId') jobLogId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobLogService.info(jobLogId))
  }

  /**
   * Clear task log list
   */
  @Delete('clear')
  @Log({ title: 'Task logs', operType: OperType.CLEAN })
  @RequirePermissions('monitor:job:list')
  async clear(): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobLogService.clear())
  }
}
