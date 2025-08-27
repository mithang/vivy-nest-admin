import { OmitType } from '@nestjs/mapped-types'
import { SysMenu } from '../entities/sys-menu.entity'

/**
 * Add menu
 */
export class CreateMenuDto extends OmitType(SysMenu, ['menuId'] as const) {}

/**
 * Update menu
 */
export class UpdateMenuDto extends OmitType(SysMenu, ['menuId'] as const) {}
