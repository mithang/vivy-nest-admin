import { Controller, Delete, Get, Param, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { ListOnlineUserDto } from './dto/online-user.dto'
import { OnlineUserService } from './online-user.service'

/**
 * Online users
 * @author vivy
 */
@ApiTags('Online users')
@ApiBearerAuth()
@Controller('online-users')
export class OnlineUserController {
  constructor(private onlineUserService: OnlineUserService) {}

  /**
   * Online user list
   * @param dto Query information
   * @returns Online user list
   */
  @Get()
  @RequirePermissions('monitor:online:list')
  async list(@Query() dto: ListOnlineUserDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.onlineUserService.list(dto))
  }

  /**
   * Force logout online user
   * @param userSk User session ID
   */
  @Delete(':userSk')
  @Log({ title: 'Online users', operType: OperType.DELETE })
  @RequirePermissions('monitor:online:logout')
  async logout(@Param('userSk') userSk: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.onlineUserService.logout(userSk))
  }
}
