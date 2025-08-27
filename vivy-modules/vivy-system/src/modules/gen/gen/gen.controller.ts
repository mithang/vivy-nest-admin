import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, StreamableFile } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { ListGenDto, UpdateGenDto } from './dto/gen.dto'
import { GenService } from './gen.service'

/**
 * Code generation
 * @author vivy
 */
@ApiTags('Code generation')
@ApiBearerAuth()
@Controller('gen')
export class GenController {
  constructor(private genService: GenService) {}

  /**
   * Code generation list
   * @param gen Search information
   * @returns Code generation list
   */
  @Get('list')
  async list(@Query() gen: ListGenDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.genService.list(gen))
  }

  /**
   * Update code generation
   * @param gen Update information
   */
  @Put('update')
  @Log({ title: 'Code generation', operType: OperType.UPDATE })
  async update(@Body() gen: UpdateGenDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.genService.update(gen))
  }

  /**
   * Delete code generation
   * @param tableIds Code generation IDs
   */
  @Delete(':tableIds')
  @Log({ title: 'Code generation', operType: OperType.DELETE })
  async delete(@Param('tableIds', new ParseArrayPipe({ items: Number })) tableIds: number[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.genService.delete(tableIds))
  }

  /**
   * Code generation details
   * @param tableId Code generation ID
   * @returns Code generation details
   */
  @Get(':tableId')
  async info(@Param('tableId') tableId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.genService.info(tableId))
  }

  /**
   * Query database table list
   * @param tableId Code generation ID
   * @returns Database table list
   */
  @Get('db/list')
  async dblist(@Query() gen: ListGenDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.genService.dblist(gen))
  }

  /**
   * Import table structure to code generation table
   * @param tableNames Table names
   */
  @Post('import/:tableNames')
  @Log({ title: 'Code generation', operType: OperType.INSERT })
  async import(@Param('tableNames', new ParseArrayPipe()) tableNames: string[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.genService.import(tableNames))
  }

  /**
   * Sync table structure to code generation table
   * @param tableName Table name
   */
  @Put('sync/:tableName')
  @Log({ title: 'Code generation', operType: OperType.INSERT })
  async sync(@Param('tableName') tableName: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.genService.sync(tableName))
  }

  /**
   * Preview code
   * @param tableName Table name
   * @returns Code details
   */
  @Get('preview/:tableName')
  async preview(@Param('tableName') tableName: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.genService.preview(tableName))
  }

  /**
   * Download code
   * @param tableName Table name
   * @returns Code details
   */
  @Get('download/:tableName')
  async download(@Param('tableName') tableName: string): Promise<StreamableFile> {
    return this.genService.download(tableName)
  }
}
