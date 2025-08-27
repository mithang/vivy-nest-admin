import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, StreamableFile } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { DeptService } from '@/modules/system/dept/dept.service'
import { RoleService } from '@/modules/system/role/role.service'
import { ListUserDto, CreateUserDto, UpdateUserDto } from './dto/user.dto'
import { UserService } from './user.service'

/**
 * User management
 * @author vivy
 */
@ApiTags('User management')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private deptService: DeptService,
    private roleService: RoleService,
    private securityContext: SecurityContext
  ) {}

  /**
   * User list
   * @param user User information
   * @returns User list
   */
  @Get()
  @RequirePermissions('system:user:list')
  async list(@Query() user: ListUserDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.userService.list(user))
  }

  /**
   * Add user
   * @param user User information
   */
  @Post()
  @Log({ title: 'User management', operType: OperType.INSERT })
  @RequirePermissions('system:user:add')
  async add(@Body() user: CreateUserDto): Promise<AjaxResult> {
    await this.deptService.checkDeptDataScope(user.deptId)
    await this.roleService.checkRoleDataScope(user.roleIds)

    if (!(await this.userService.checkUserNameUnique(user.userName))) {
      return AjaxResult.error(`Failed to add user ${user.userName}, login account already exists`)
    }

    if (!(await this.userService.checkUserEmailUnique(user.email))) {
      return AjaxResult.error(`Failed to add user ${user.userName}, email account already exists`)
    }

    if (!(await this.userService.checkUserPhoneUnique(user.phonenumber))) {
      return AjaxResult.error(`Failed to add user ${user.userName}, phone number already exists`)
    }

    user.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.userService.add(user))
  }

  /**
   * Update user
   * @param userId User ID
   * @param user User information
   */
  @Put(':userId')
  @Log({ title: 'User management', operType: OperType.UPDATE })
  @RequirePermissions('system:user:update')
  async update(@Param('userId') userId: number, @Body() user: UpdateUserDto): Promise<AjaxResult> {
    this.userService.checkUserAllowed(userId)
    await this.userService.checkUserDataScope(userId)
    await this.deptService.checkDeptDataScope(user.deptId)
    await this.roleService.checkRoleDataScope(user.roleIds)

    if (!(await this.userService.checkUserNameUnique(user.userName, userId))) {
      return AjaxResult.error(`Failed to update user ${user.userName}, login account already exists`)
    }

    if (!(await this.userService.checkUserEmailUnique(user.email, userId))) {
      return AjaxResult.error(`Failed to update user ${user.userName}, email account already exists`)
    }

    if (!(await this.userService.checkUserPhoneUnique(user.phonenumber, userId))) {
      return AjaxResult.error(`Failed to update user ${user.userName}, phone number already exists`)
    }

    user.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.userService.update(userId, user))
  }

  /**
   * Delete user
   * @param userIds User IDs
   */
  @Delete(':userIds')
  @Log({ title: 'User management', operType: OperType.DELETE })
  @RequirePermissions('system:user:delete')
  async delete(@Param('userIds', new ParseArrayPipe({ items: Number })) userIds: number[]): Promise<AjaxResult> {
    this.userService.checkUserAllowed(userIds)
    await this.userService.checkUserDataScope(userIds)
    return AjaxResult.success(await this.userService.delete(userIds))
  }

  /**
   * User details
   * @param userId User ID
   * @returns User details
   */
  @Get(':userId')
  @RequirePermissions('system:user:query')
  async info(@Param('userId') userId: number): Promise<AjaxResult> {
    await this.userService.checkUserDataScope(userId)
    return AjaxResult.success(await this.userService.info(userId))
  }

  /**
   * Export users
   */
  @Post('export')
  @Log({ title: 'User management', operType: OperType.EXPORT })
  @RequirePermissions('system:user:export')
  async export() {
    const file = await this.userService.export()
    return new StreamableFile(file)
  }

  /**
   * Export template
   */
  @Post('export-template')
  @Log({ title: 'User management', operType: OperType.EXPORT })
  @RequirePermissions('system:user:export')
  async exportTemplate() {
    const file = await this.userService.exportTemplate()
    return new StreamableFile(file)
  }

  //Tam comment
  // /**
  //  * Import users
  //  */
  // @Post('import')
  // @Log({ title: 'User management', operType: OperType.IMPORT })
  // @RequirePermissions('system:user:import')
  // @UseInterceptors(FileInterceptor('file'))
  // async import(@UploadedFile() file: Express.Multer.File) {
  //   return AjaxResult.success(await this.userService.import(file.buffer))
  // }
}
