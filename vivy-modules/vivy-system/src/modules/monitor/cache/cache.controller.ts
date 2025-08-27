import { Controller, Delete, Get, Param } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { CacheService } from './cache.service'

/**
 * Cache management
 * @author vivy
 */
@ApiTags('Cache list')
@ApiBearerAuth()
@Controller('caches')
export class CacheController {
  constructor(private cacheService: CacheService) {}

  /**
   * Query cache name list
   */
  @Get()
  @RequirePermissions('monitor:cache:query')
  async getAll(): Promise<AjaxResult> {
    return AjaxResult.success(await this.cacheService.getAll())
  }

  /**
   * Query cache key name list
   * @param name Cache name
   */
  @Get(':name/keys')
  @RequirePermissions('monitor:cache:query')
  async getKeys(@Param('name') name: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.cacheService.getKeys(name))
  }

  /**
   * Query cache content
   * @param name Cache name
   * @param key Cache key name
   */
  @Get(':name/keys/:key')
  @RequirePermissions('monitor:cache:query')
  async getValue(@Param('name') name: string, @Param('key') key: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.cacheService.getValue(name, key))
  }

  /**
   * Delete all cache content
   */
  @Delete()
  @Log({ title: 'Cache list', operType: OperType.DELETE })
  @RequirePermissions('monitor:cache:delete')
  async deleteAll(): Promise<AjaxResult> {
    return AjaxResult.success(await this.cacheService.deleteAll())
  }

  /**
   * Delete cache content by cache name
   * @param name Cache name
   */
  @Delete(':name')
  @Log({ title: 'Cache list', operType: OperType.DELETE })
  @RequirePermissions('monitor:cache:delete')
  async deleteByName(@Param('name') name: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.cacheService.deleteByName(name))
  }

  /**
   * Delete cache content by cache key name
   * @param name Cache name
   * @param key Cache key name
   */
  @Delete(':name/keys/:key')
  @Log({ title: 'Cache list', operType: OperType.DELETE })
  @RequirePermissions('monitor:cache:delete')
  async deleteByNameAndKey(@Param('name') name: string, @Param('key') key: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.cacheService.deleteByNameAndKey(name, key))
  }
}
