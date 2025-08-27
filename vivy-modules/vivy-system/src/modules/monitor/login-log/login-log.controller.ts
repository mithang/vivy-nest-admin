import { Controller, Delete, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { ListLoginLogDto } from './dto/login-log.dto'
import { LoginLogService } from './login-log.service'

/**
 * Login logs
 * @author vivy
 */
@ApiTags('Login logs')
@ApiBearerAuth()
@Controller('login-logs')
export class LoginLogController {
  constructor(private loginLogService: LoginLogService) {}

  /**
   * Query login log list
   * @param loginLog Login log information
   * @returns Login log list
   */
  @Get()
  @RequirePermissions('monitor:loginlog:list')
  async list(@Query() loginLog: ListLoginLogDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.loginLogService.list(loginLog))
  }

  /**
   * Clear login logs
   */
  @Delete('clear')
  @Log({ title: 'Login logs', operType: OperType.CLEAN })
  @RequirePermissions('monitor:loginlog:delete')
  async clear(): Promise<AjaxResult> {
    return AjaxResult.success(await this.loginLogService.clear())
  }
}
