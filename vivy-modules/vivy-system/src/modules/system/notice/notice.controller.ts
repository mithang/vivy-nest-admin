import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { ListNoticeDto, CreateNoticeDto, UpdateNoticeDto } from './dto/notice.dto'
import { NoticeService } from './notice.service'

/**
 * Notices and announcements
 * @author vivy
 */
@ApiTags('Notices and announcements')
@ApiBearerAuth()
@Controller('notices')
export class NoticeController {
  constructor(
    private noticeService: NoticeService,
    private securityContext: SecurityContext
  ) {}

  /**
   * Notices list
   * @param notice Notice information
   * @returns Notices list
   */
  @Get()
  @RequirePermissions('system:notice:list')
  async list(@Query() notice: ListNoticeDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.noticeService.list(notice))
  }

  /**
   * Add notice
   * @param notice Notice information
   */
  @Post()
  @Log({ title: 'Notices and announcements', operType: OperType.INSERT })
  @RequirePermissions('system:notice:add')
  async add(@Body() notice: CreateNoticeDto): Promise<AjaxResult> {
    notice.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.noticeService.add(notice))
  }

  /**
   * Update notice
   * @param noticeId Notice ID
   * @param notice Notice information
   */
  @Put(':noticeId')
  @Log({ title: 'Notices and announcements', operType: OperType.UPDATE })
  @RequirePermissions('system:notice:update')
  async update(@Param('noticeId') noticeId: number, @Body() notice: UpdateNoticeDto): Promise<AjaxResult> {
    notice.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.noticeService.update(noticeId, notice))
  }

  /**
   * Delete notice
   * @param noticeIds Notice ID
   */
  @Delete(':noticeIds')
  @Log({ title: 'Notices and announcements', operType: OperType.DELETE })
  @RequirePermissions('system:notice:delete')
  async delete(@Param('noticeIds', new ParseArrayPipe({ items: Number })) noticeIds: number[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.noticeService.delete(noticeIds))
  }

  /**
   * Notice details
   * @param noticeId Notice ID
   * @returns Notice details
   */
  @Get(':noticeId')
  @RequirePermissions('system:notice:query')
  async info(@Param('noticeId') noticeId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.noticeService.info(noticeId))
  }
}
