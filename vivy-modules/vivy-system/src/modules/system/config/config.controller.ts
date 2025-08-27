import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { ConfigCacheService } from './config-cache.service'
import { ConfigService } from './config.service'
import { ListConfigDto, CreateConfigDto, UpdateConfigDto } from './dto/config.dto'

/**
 * Parameter configuration
 * @author vivy
 */
@ApiTags('Parameter configuration')
@ApiBearerAuth()
@Controller('configs')
export class ConfigController {
  constructor(
    private configService: ConfigService,
    private configCacheService: ConfigCacheService,
    private securityContext: SecurityContext
  ) {}

  /**
   * Parameter configuration list
   * @param config Parameter configuration information
   * @returns Parameter configuration list
   */
  @Get()
  @RequirePermissions('system:config:list')
  async list(@Query() config: ListConfigDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.configService.list(config))
  }

  /**
   * Add parameter configuration
   * @param config Parameter configuration information
   */
  @Post()
  @Log({ title: 'Parameter configuration', operType: OperType.INSERT })
  @RequirePermissions('system:config:add')
  async add(@Body() config: CreateConfigDto): Promise<AjaxResult> {
    if (!(await this.configService.checkConfigKeyUnique(config.configKey))) {
      return AjaxResult.error(`Add parameter configuration ${config.configName} failed, parameter key already exists`)
    }

    config.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.configService.add(config))
  }

  /**
   * Update parameter configuration
   * @param configId Parameter configuration ID
   * @param config Parameter configuration information
   */
  @Put(':configId')
  @Log({ title: 'Parameter configuration', operType: OperType.UPDATE })
  @RequirePermissions('system:config:update')
  async update(@Param('configId') configId: number, @Body() config: UpdateConfigDto): Promise<AjaxResult> {
    if (!(await this.configService.checkConfigKeyUnique(config.configKey, configId))) {
      return AjaxResult.error(
        `Update parameter configuration ${config.configName} failed, parameter key already exists`
      )
    }

    config.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.configService.update(configId, config))
  }

  /**
   * Refresh parameter configuration cache
   */
  @Delete('refresh-cache')
  @Log({ title: 'Parameter configuration', operType: OperType.DELETE })
  @RequirePermissions('system:config:delete')
  async refreshCache(): Promise<AjaxResult> {
    return AjaxResult.success(await this.configCacheService.reset())
  }

  /**
   * Delete parameter configuration
   * @param configIds Parameter configuration ID
   */
  @Delete(':configIds')
  @Log({ title: 'Parameter configuration', operType: OperType.DELETE })
  @RequirePermissions('system:config:delete')
  async delete(@Param('configIds', new ParseArrayPipe({ items: Number })) configIds: number[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.configService.delete(configIds))
  }

  /**
   * Parameter configuration details
   * @param configId Parameter configuration ID
   * @returns Parameter configuration details
   */
  @Get(':configId')
  @RequirePermissions('system:config:query')
  async info(@Param('configId') configId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.configService.info(configId))
  }

  /**
   * Get parameter configuration value
   * @param configKey Parameter configuration key
   * @returns Parameter configuration value
   */
  @Get(':configKey/value')
  @RequirePermissions('system:config:query')
  async value(@Param('configKey') configKey: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.configService.value(configKey))
  }
}
