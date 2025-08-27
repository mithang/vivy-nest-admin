import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { ListRoleDto, CreateRoleDto, UpdateRoleDto, UpdateDataScopeDto } from './dto/role.dto'
import { RoleService } from './role.service'

/**
 * Role management
 * @author vivy
 */
@ApiTags('Role management')
@ApiBearerAuth()
@Controller('roles')
export class RoleController {
  constructor(
    private roleService: RoleService,
    private securityContext: SecurityContext
  ) {}

  /**
   * Role list
   * @param role Role information
   * @returns Role list
   */
  @Get()
  @RequirePermissions('system:role:list')
  async list(@Query() role: ListRoleDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.roleService.list(role))
  }

  /**
   * Add role
   * @param role Role information
   */
  @Post()
  @Log({ title: 'Role management', operType: OperType.INSERT })
  @RequirePermissions('system:role:add')
  async add(@Body() role: CreateRoleDto): Promise<AjaxResult> {
    if (!(await this.roleService.checkRoleNameUnique(role.roleName))) {
      return AjaxResult.error(`Failed to add role ${role.roleName}, role name already exists`)
    }

    if (!(await this.roleService.checkRoleCodeUnique(role.roleCode))) {
      return AjaxResult.error(`Failed to add role ${role.roleName}, role permission already exists`)
    }

    role.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.roleService.add(role))
  }

  /**
   * Update role
   * @param roleId Role ID
   * @param role Role information
   */
  @Put(':roleId')
  @Log({ title: 'Role management', operType: OperType.UPDATE })
  @RequirePermissions('system:role:update')
  async update(@Param('roleId') roleId: number, @Body() role: UpdateRoleDto): Promise<AjaxResult> {
    this.roleService.checkRoleAllowed(roleId)
    await this.roleService.checkRoleDataScope(roleId)

    if (!(await this.roleService.checkRoleNameUnique(role.roleName, roleId))) {
      return AjaxResult.error(`Failed to update role ${role.roleName}, role name already exists`)
    }

    if (!(await this.roleService.checkRoleCodeUnique(role.roleCode, roleId))) {
      return AjaxResult.error(`Failed to update role ${role.roleName}, role permission already exists`)
    }

    role.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.roleService.update(roleId, role))
  }

  /**
   * Delete role
   * @param roleIds Role IDs
   */
  @Delete(':roleIds')
  @Log({ title: 'Role management', operType: OperType.DELETE })
  @RequirePermissions('system:role:delete')
  async delete(@Param('roleIds', new ParseArrayPipe({ items: Number })) roleIds: number[]): Promise<AjaxResult> {
    this.roleService.checkRoleAllowed(roleIds)
    await this.roleService.checkRoleDataScope(roleIds)
    return AjaxResult.success(await this.roleService.delete(roleIds))
  }

  /**
   * Role options list
   * @returns Role options list
   */
  @Get('options')
  async options(): Promise<AjaxResult> {
    return AjaxResult.success(await this.roleService.options())
  }

  /**
   * Role details
   * @param roleId Role ID
   * @returns Role details
   */
  @Get(':roleId')
  @RequirePermissions('system:role:query')
  async info(@Param('roleId') roleId: number): Promise<AjaxResult> {
    await this.roleService.checkRoleDataScope(roleId)
    return AjaxResult.success(await this.roleService.info(roleId))
  }

  /**
   * Update data scope
   * @param roleId Role ID
   * @param dataScopeDto Data scope range information
   */
  @Put(':roleId/data-scope')
  @Log({ title: 'Role management', operType: OperType.UPDATE })
  @RequirePermissions('system:role:update')
  async updateDataScope(
    @Param('roleId') roleId: number,
    @Body() dataScopeDto: UpdateDataScopeDto
  ): Promise<AjaxResult> {
    this.roleService.checkRoleAllowed(roleId)
    await this.roleService.checkRoleDataScope(roleId)
    return AjaxResult.success(await this.roleService.updateDataScope(roleId, dataScopeDto))
  }
}
