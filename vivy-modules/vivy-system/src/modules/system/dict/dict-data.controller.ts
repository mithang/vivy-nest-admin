import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { DictDataService } from './dict-data.service'
import { ListDictDataDto, CreateDictDataDto, UpdateDictDataDto } from './dto/dict-data.dto'

/**
 * Dictionary data management
 * @author vivy
 */
@ApiTags('Dictionary data management')
@ApiBearerAuth()
@Controller('dict/datas')
export class DictDataController {
  constructor(
    private dictDataService: DictDataService,
    private securityContext: SecurityContext
  ) {}

  /**
   * Query dictionary data list
   * @author vivy
   * @param dictData Dictionary data information
   * @returns Dictionary data list
   */
  @Get()
  @RequirePermissions('system:dict:list')
  async list(@Query() dictData: ListDictDataDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.dictDataService.list(dictData))
  }

  /**
   * Add dictionary data
   * @param dictData Dictionary data information
   */
  @Post()
  @Log({ title: 'Dictionary data management', operType: OperType.INSERT })
  @RequirePermissions('system:dict:add')
  async add(@Body() dictData: CreateDictDataDto): Promise<AjaxResult> {
    if (!(await this.dictDataService.checkDictLabelUnique(dictData.dictType, dictData.dictLabel))) {
      return AjaxResult.error(`Failed to add dictionary ${dictData.dictLabel}, dictionary label already exists`)
    }

    if (!(await this.dictDataService.checkDictValueUnique(dictData.dictType, dictData.dictValue))) {
      return AjaxResult.error(`Failed to add dictionary ${dictData.dictLabel}, dictionary value already exists`)
    }

    dictData.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.dictDataService.add(dictData))
  }

  /**
   * Update dictionary data
   * @param dictId Dictionary data ID
   * @param dictData Dictionary data information
   */
  @Put(':dictId')
  @Log({ title: 'Dictionary data management', operType: OperType.UPDATE })
  @RequirePermissions('system:dict:update')
  async update(@Param('dictId') dictId: number, @Body() dictData: UpdateDictDataDto): Promise<AjaxResult> {
    if (!(await this.dictDataService.checkDictLabelUnique(dictData.dictType, dictData.dictLabel, dictId))) {
      return AjaxResult.error(`Failed to update dictionary ${dictData.dictLabel}, dictionary label already exists`)
    }

    if (!(await this.dictDataService.checkDictValueUnique(dictData.dictType, dictData.dictValue, dictId))) {
      return AjaxResult.error(`Failed to update dictionary ${dictData.dictLabel}, dictionary value already exists`)
    }

    dictData.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.dictDataService.update(dictId, dictData))
  }

  /**
   * Delete dictionary data
   * @param dictIds Dictionary data ID
   */
  @Delete(':dictIds')
  @Log({ title: 'Dictionary data management', operType: OperType.DELETE })
  @RequirePermissions('system:dict:delete')
  async delete(@Param('dictIds', new ParseArrayPipe({ items: Number })) dictIds: number[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.dictDataService.delete(dictIds))
  }

  /**
   * Dictionary data details
   * @param dictId Dictionary data ID
   * @returns Dictionary data details
   */
  @Get(':dictId')
  @RequirePermissions('system:dict:query')
  async info(@Param('dictId') dictId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.dictDataService.info(dictId))
  }

  /**
   * Query dictionary data options list by dictionary type
   * @param dictType Dictionary type
   * @returns Dictionary data options list
   */
  @Get('options/:dictType')
  async options(@Param('dictType') dictType: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.dictDataService.options(dictType))
  }
}
