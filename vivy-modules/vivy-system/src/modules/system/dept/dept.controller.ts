import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { DeptService } from './dept.service'
import { CreateDeptDto, UpdateDeptDto } from './dto/dept.dto'

/**
 * Department management
 * @author vivy
 */
@ApiTags('Department management')
@ApiBearerAuth()
@Controller('depts')
export class DeptController {
  constructor(
    private deptService: DeptService,
    private securityContext: SecurityContext
  ) {}

  /**
   * Query department tree structure
   */
  @Get('tree')
  @RequirePermissions('system:dept:list')
  async tree(): Promise<AjaxResult> {
    return AjaxResult.success(await this.deptService.tree())
  }

  /**
   * Add department
   * @param dept Department information
   */
  @Post()
  @Log({ title: 'Department management', operType: OperType.INSERT })
  @RequirePermissions('system:dept:add')
  async add(@Body() dept: CreateDeptDto): Promise<AjaxResult> {
    dept.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.deptService.add(dept))
  }

  /**
   * Update department
   * @param deptId Department ID
   * @param dept Department information
   */
  @Put(':deptId')
  @Log({ title: 'Department management', operType: OperType.UPDATE })
  @RequirePermissions('system:dept:update')
  async update(@Param('deptId') deptId: number, @Body() dept: UpdateDeptDto): Promise<AjaxResult> {
    await this.deptService.checkDeptDataScope(deptId)

    if (deptId === dept.parentId) {
      return AjaxResult.error(`Failed to update department ${dept.deptName}, parent department cannot be itself`)
    }

    dept.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.deptService.update(deptId, dept))
  }

  /**
   * Delete department
   * @param deptId Department ID
   */
  @Delete(':deptId')
  @Log({ title: 'Department management', operType: OperType.DELETE })
  @RequirePermissions('system:dept:delete')
  async delete(@Param('deptId') deptId: number): Promise<AjaxResult> {
    await this.deptService.checkDeptDataScope(deptId)

    if (await this.deptService.checkDeptExistChild(deptId)) {
      return AjaxResult.error('There are sub-departments, deletion is not allowed')
    }

    if (await this.deptService.checkDeptExistUser(deptId)) {
      return AjaxResult.error('Department has users, deletion is not allowed')
    }

    return AjaxResult.success(await this.deptService.delete(deptId))
  }

  /**
   * Query department options tree
   * @returns Department options tree
   */
  @Get('tree-options')
  async treeOptions(): Promise<AjaxResult> {
    return AjaxResult.success(await this.deptService.treeOptions())
  }

  /**
   * Department details
   * @param deptId Department ID
   * @returns Department details
   */
  @Get(':deptId')
  @RequirePermissions('system:dept:query')
  async info(@Param('deptId') deptId: number): Promise<AjaxResult> {
    await this.deptService.checkDeptDataScope(deptId)
    return AjaxResult.success(await this.deptService.info(deptId))
  }
}
