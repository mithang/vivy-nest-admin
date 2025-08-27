import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { DictCacheService } from './dict-cache.service'
import { DictTypeService } from './dict-type.service'
import { ListDictTypeDto, CreateDictTypeDto, UpdateDictTypeDto } from './dto/dict-type.dto'

/**
 * Dictionary type management
 * @author vivy
 */
@ApiTags('Dictionary type management')
@ApiBearerAuth()
@Controller('dict/types')
export class DictTypeController {
  constructor(
    private dictTypeService: DictTypeService,
    private dictCacheService: DictCacheService,
    private securityContext: SecurityContext
  ) {}

  /**
   * Query dictionary type list
   * @param dictType Dictionary type information
   * @returns Dictionary type list
   */
  @Get()
  @RequirePermissions('system:dict:list')
  async list(@Query() dictType: ListDictTypeDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.dictTypeService.list(dictType))
  }

  /**
   * Add dictionary type
   * @param dictType Dictionary type information
   */
  @Post()
  @Log({ title: 'Dictionary type management', operType: OperType.INSERT })
  @RequirePermissions('system:dict:add')
  async add(@Body() dictType: CreateDictTypeDto): Promise<AjaxResult> {
    if (!(await this.dictTypeService.checkDictTypeUnique(dictType.dictType))) {
      return AjaxResult.error(`Failed to add dictionary ${dictType.dictName}, dictionary type already exists`)
    }

    if (!(await this.dictTypeService.checkDictNameUnique(dictType.dictName))) {
      return AjaxResult.error(`Failed to add dictionary ${dictType.dictName}, dictionary name already exists`)
    }

    dictType.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.dictTypeService.add(dictType))
  }

  /**
   * Update dictionary type
   * @param dictId Dictionary type ID
   * @param dictType Dictionary type information
   */
  @Put(':dictId')
  @Log({ title: 'Dictionary type management', operType: OperType.UPDATE })
  @RequirePermissions('system:dict:update')
  async update(@Param('dictId') dictId: number, @Body() dictType: UpdateDictTypeDto): Promise<AjaxResult> {
    if (!(await this.dictTypeService.checkDictTypeUnique(dictType.dictType, dictId))) {
      return AjaxResult.error(`Failed to update dictionary ${dictType.dictName}, dictionary type already exists`)
    }

    if (!(await this.dictTypeService.checkDictNameUnique(dictType.dictName, dictId))) {
      return AjaxResult.error(`Failed to update dictionary ${dictType.dictName}, dictionary name already exists`)
    }

    dictType.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.dictTypeService.update(dictId, dictType))
  }

  /**
   * Refresh dictionary cache
   */
  @Delete('refresh-cache')
  @Log({ title: 'Parameter configuration', operType: OperType.DELETE })
  @RequirePermissions('system:dict:delete')
  async refreshCache(): Promise<AjaxResult> {
    return AjaxResult.success(await this.dictCacheService.reset())
  }

  /**
   * Delete dictionary type
   * @param dictIds Dictionary type ID
   */
  @Delete(':dictIds')
  @Log({ title: 'Dictionary type management', operType: OperType.DELETE })
  @RequirePermissions('system:dict:delete')
  async delete(@Param('dictIds', new ParseArrayPipe({ items: Number })) dictIds: number[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.dictTypeService.delete(dictIds))
  }

  /**
   * Dictionary type options list
   * @returns Dictionary type options list
   */
  @Get('options')
  async options(): Promise<AjaxResult> {
    return AjaxResult.success(await this.dictTypeService.options())
  }

  /**
   * Dictionary type details
   * @param dictId Dictionary type ID
   * @returns Dictionary type details
   */
  @Get(':dictId')
  @RequirePermissions('system:dict:query')
  async info(@Param('dictId') dictId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.dictTypeService.info(dictId))
  }
}
