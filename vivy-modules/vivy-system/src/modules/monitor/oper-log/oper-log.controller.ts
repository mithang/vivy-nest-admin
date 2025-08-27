import { Controller, Delete, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { ListOperLogDto } from './dto/oper-log.dto'
import { OperLogService } from './oper-log.service'

/**
 * Operation logs
 * @author vivy
 */
@ApiTags('Operation logs')
@ApiBearerAuth()
@Controller('oper-logs')
export class OperLogController {
  constructor(private operLogService: OperLogService) {}

  /**
   * Operation log list
   * @param operLog Operation log information
   * @returns Operation log list
   */
  @Get()
  @RequirePermissions('monitor:operlog:list')
  async list(@Query() operLog: ListOperLogDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.operLogService.list(operLog))
  }

  /**
   * Clear operation logs
   */
  @Delete('clear')
  @Log({ title: 'Operation logs', operType: OperType.CLEAN })
  @RequirePermissions('monitor:operlog:delete')
  async clear(): Promise<AjaxResult> {
    return AjaxResult.success(await this.operLogService.clear())
  }
}
