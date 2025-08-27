import { Body, Controller, Get, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { UploadFileUrl, UploadFileUrls } from '../upload/upload.decorator'
import { CreateFileDto, ListFileDto } from './dto/file.dto'
import { FileService } from './file.service'

/**
 * File management
 * @author vivy
 */
@ApiTags('File management')
@ApiBearerAuth()
@Controller('files')
export class FileController {
  constructor(private fileService: FileService) {}

  /**
   * File list
   * @param file File information
   * @returns File list
   */
  @Get()
  async list(@Query() file: ListFileDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.fileService.list(file))
  }

  /**
   * Add file
   * @param file File information
   */
  @Post()
  @Log({ title: 'File management', operType: OperType.INSERT })
  async add(@Body() file: CreateFileDto | CreateFileDto[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.fileService.add(file))
  }

  /**
   * File usage options
   * @returns File usage options list
   */
  @Get('use-options')
  async useOptions(): Promise<AjaxResult> {
    return AjaxResult.success(await this.fileService.useOptions())
  }

  /**
   * Single file upload
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @UploadFileUrl() url: string): Promise<AjaxResult> {
    console.log(url, file)
    return AjaxResult.success(url)
  }

  /**
   * Multiple files upload
   */
  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files'))
  async uploads(@UploadedFiles() files: Express.Multer.File[], @UploadFileUrls() urls: string[]): Promise<AjaxResult> {
    console.log(urls, files)
    return AjaxResult.success(urls)
  }
}
