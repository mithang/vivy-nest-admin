import { Body, Controller, Get, Put, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { FileService } from '@/modules/file/file/file.service'
import { UpdatePasswordDto, UpdateProfileDto, UpdateAvatarDto } from './dto/profile.dto'
import { ProfileService } from './profile.service'

/**
 * Personal information
 * @author vivy
 */
@ApiTags('Personal information')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    private fileService: FileService
  ) {}

  /**
   * Query personal information
   */
  @Get()
  async info(): Promise<AjaxResult> {
    return AjaxResult.success(await this.profileService.info())
  }

  /**
   * Update personal information
   */
  @Put()
  @Log({ title: 'Personal information', operType: OperType.UPDATE })
  async update(@Body() profile: UpdateProfileDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.profileService.update(profile))
  }

  /**
   * Update personal password
   */
  @Put('password')
  @Log({ title: 'Personal information', operType: OperType.UPDATE })
  async password(@Body() password: UpdatePasswordDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.profileService.password(password))
  }

  /**
   * Update personal avatar
   */
  @Post('avatar')
  @Log({ title: 'Personal information', operType: OperType.UPDATE })
  async avatar(@Body() avatar: UpdateAvatarDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.profileService.avatar(avatar))
  }
}
