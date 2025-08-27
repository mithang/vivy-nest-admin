import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TreeUtils, BaseStatusEnum, IdentityUtils } from '@vivy-common/core'
import { Repository } from 'typeorm'
import { SysRoleMenu } from '@/modules/system/role/entities/sys-role-menu.entity'
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto'
import { SysMenu } from './entities/sys-menu.entity'
import { MenuTreeVo } from './vo/menu.vo'

/**
 * Menu management
 * @author vivy
 */
@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(SysMenu)
    private menuRepository: Repository<SysMenu>,

    @InjectRepository(SysRoleMenu)
    private roleMenuRepository: Repository<SysRoleMenu>
  ) {}

  /**
   * Query menu tree structure
   */
  async tree(): Promise<MenuTreeVo[]> {
    const list = await this.menuRepository.find({
      order: {
        menuSort: 'ASC',
      },
    })
    return TreeUtils.listToTree<MenuTreeVo>(list, {
      id: 'menuId',
      pid: 'parentId',
    })
  }

  /**
   * Add menu
   * @param menu Menu information
   */
  async add(menu: CreateMenuDto): Promise<void> {
    await this.menuRepository.insert(menu)
  }

  /**
   * Update menu
   * @param menuId Menu ID
   * @param menu Menu information
   */
  async update(menuId: number, menu: UpdateMenuDto): Promise<void> {
    await this.menuRepository.update(menuId, menu)
  }

  /**
   * Delete menu
   * @param menuId Menu ID
   */
  async delete(menuId: number): Promise<void> {
    await this.menuRepository.delete(menuId)
  }

  /**
   * Menu details
   * @param menuId Menu ID
   * @returns Menu details
   */
  async info(menuId: number): Promise<SysMenu> {
    return this.menuRepository.findOneBy({ menuId })
  }

  /**
   * Check if child nodes exist
   * @param menuId Menu ID
   * @return true exists / false does not exist
   */
  async checkMenuExistChild(deptId: number): Promise<boolean> {
    const count = await this.menuRepository.countBy({ parentId: deptId })
    return count > 0
  }

  /**
   * Check if role exists
   * @param menuId Menu ID
   * @return true exists / false does not exist
   */
  async checkMenuExistRole(menuId: number): Promise<boolean> {
    const count = await this.roleMenuRepository.countBy({ menuId })
    return count > 0
  }

  /**
   * Query menu option tree
   * @returns Menu option tree
   */
  async treeOptions(): Promise<MenuTreeVo[]> {
    const list = await this.menuRepository.find({
      select: ['menuId', 'menuName', 'parentId'],
      order: {
        menuSort: 'ASC',
      },
      where: {
        status: BaseStatusEnum.NORMAL,
      },
    })
    return TreeUtils.listToTree<MenuTreeVo>(list, {
      id: 'menuId',
      pid: 'parentId',
    })
  }

  /**
   * Query menu list by user ID
   * @param userId User ID
   * @returns User menu list
   */
  async selectMenuByUserId(userId: number): Promise<SysMenu[]> {
    return this.menuRepository
      .createQueryBuilder('m')
      .leftJoin('sys_role_menu', 'rm', 'm.menu_id = rm.menu_id')
      .leftJoin('sys_user_role', 'ur', 'rm.role_id = ur.role_id')
      .leftJoin('sys_role', 'r', 'ur.role_id = r.role_id')
      .where('ur.user_id = :userId', { userId })
      .andWhere('m.status = :status', { status: BaseStatusEnum.NORMAL })
      .andWhere('r.status = :status', { status: BaseStatusEnum.NORMAL })
      .distinct()
      .getMany()
  }

  /**
   * Query user menu information
   * @param userId User ID
   * @returns User menu information
   */
  async selectUserMenuTree(userId: number): Promise<MenuTreeVo[]> {
    let menus: SysMenu[] = []

    if (IdentityUtils.isAdmin(userId)) {
      menus = await this.menuRepository
        .createQueryBuilder('m')
        .where('m.status = :status', { status: BaseStatusEnum.NORMAL })
        .andWhere('m.menu_type IN (:...menuType)', { menuType: ['M', 'C'] })
        .orderBy('m.menu_sort', 'ASC')
        .getMany()
    } else {
      menus = await this.menuRepository
        .createQueryBuilder('m')
        .leftJoin('sys_role_menu', 'rm', 'm.menu_id = rm.menu_id')
        .leftJoin('sys_user_role', 'ur', 'rm.role_id = ur.role_id')
        .leftJoin('sys_role', 'r', 'ur.role_id = r.role_id')
        .where('ur.user_id = :userId', { userId })
        .andWhere('m.status = :status', { status: BaseStatusEnum.NORMAL })
        .andWhere('r.status = :status', { status: BaseStatusEnum.NORMAL })
        .andWhere('m.menu_type IN (:...menuType)', { menuType: ['M', 'C'] })
        .orderBy('m.menu_sort', 'ASC')
        .distinct()
        .getMany()
    }

    return TreeUtils.listToTree<MenuTreeVo>(menus, {
      id: 'menuId',
      pid: 'parentId',
    })
  }
}
