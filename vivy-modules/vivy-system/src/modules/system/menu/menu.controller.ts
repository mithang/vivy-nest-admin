import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto'
import { MenuService } from './menu.service'

/**
 * Menu management
 * @author vivy
 */
@ApiTags('Menu management')
@ApiBearerAuth()
@Controller('menus')
export class MenuController {
  constructor(
    private menuService: MenuService,
    private securityContext: SecurityContext
  ) {}

  /**
   * Query menu tree structure
   */
  @Get('tree')
  @RequirePermissions('system:menu:list')
  async tree(): Promise<AjaxResult> {
    return AjaxResult.success(await this.menuService.tree())
  }

  /**
   * Add menu
   * @param menu Menu information
   */
  @Post()
  @Log({ title: 'Menu management', operType: OperType.INSERT })
  @RequirePermissions('system:menu:add')
  async add(@Body() menu: CreateMenuDto): Promise<AjaxResult> {
    menu.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.menuService.add(menu))
  }

  /**
   * Update menu
   * @param menu Menu information
   */
  @Put(':menuId')
  @Log({ title: 'Menu management', operType: OperType.UPDATE })
  @RequirePermissions('system:menu:update')
  async update(@Param('menuId') menuId: number, @Body() menu: UpdateMenuDto): Promise<AjaxResult> {
    if (menuId === menu.parentId) {
      return AjaxResult.error(`Failed to update menu ${menu.menuName}, parent menu cannot be itself`)
    }

    menu.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.menuService.update(menuId, menu))
  }

  /**
   * Delete menu
   * @param menuId Menu ID
   */
  @Delete(':menuId')
  @Log({ title: 'Menu management', operType: OperType.DELETE })
  @RequirePermissions('system:menu:delete')
  async delete(@Param('menuId') menuId: number): Promise<AjaxResult> {
    if (await this.menuService.checkMenuExistChild(menuId)) {
      return AjaxResult.error('There are sub-menus, deletion is not allowed')
    }

    if (await this.menuService.checkMenuExistRole(menuId)) {
      return AjaxResult.error('Menu has been assigned to roles, deletion is not allowed')
    }

    return AjaxResult.success(await this.menuService.delete(menuId))
  }

  /**
   * Query menu options tree
   * @returns Menu options tree
   */
  @Get('tree-options')
  async treeOptions(): Promise<AjaxResult> {
    return AjaxResult.success(await this.menuService.treeOptions())
  }

  /**
   * Menu details
   * @param menuId Menu ID
   * @returns Menu details
   */
  @Get(':menuId')
  @RequirePermissions('system:menu:query')
  async info(@Param('menuId') menuId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.menuService.info(menuId))
  }
}
