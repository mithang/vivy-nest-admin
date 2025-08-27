import { Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import {
  ServiceException,
  BaseStatusEnum,
  UserConstants,
  IdentityUtils,
  ObjectUtils,
  SecurityContext,
} from '@vivy-common/core'
import { DataScope, DataScopeService } from '@vivy-common/datascope'
import { isNotEmpty, isEmpty, isArray } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { DataSource, In, Like, Not, Repository } from 'typeorm'
import { SysUserRole } from '@/modules/system/user/entities/sys-user-role.entity'
import { ListRoleDto, CreateRoleDto, UpdateRoleDto, UpdateDataScopeDto } from './dto/role.dto'
import { SysRoleDept } from './entities/sys-role-dept.entity'
import { SysRoleMenu } from './entities/sys-role-menu.entity'
import { SysRole } from './entities/sys-role.entity'
import { RoleInfoVo } from './vo/role.vo'

/**
 * Role management
 * @author vivy
 */
@Injectable()
export class RoleService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,

    @InjectRepository(SysRole)
    private roleRepository: Repository<SysRole>,

    @InjectRepository(SysRoleMenu)
    private roleMenuRepository: Repository<SysRoleMenu>,

    @InjectRepository(SysRoleDept)
    private roleDeptRepository: Repository<SysRoleDept>,

    @InjectRepository(SysUserRole)
    private userRoleRepository: Repository<SysUserRole>,

    private securityContext: SecurityContext,
    private dataScopeService: DataScopeService
  ) {}

  /**
   * Data scope role list query construction
   */
  @DataScope({ deptAlias: 'd' })
  private dsRoleQueryBuilder() {
    const dsSql = this.dataScopeService.sql(this.dsRoleQueryBuilder)
    return this.roleRepository
      .createQueryBuilder('r')
      .leftJoin('sys_user_role', 'ur', 'ur.role_id = r.role_id')
      .leftJoin('sys_user', 'u', 'u.user_id = ur.user_id')
      .leftJoin('sys_dept', 'd', 'd.dept_id = u.dept_id')
      .andWhere(dsSql)
      .orderBy('r.roleSort', 'ASC')
      .distinct()
  }

  /**
   * Role list
   * @param role Role information
   * @returns Role list
   */
  async list(role: ListRoleDto): Promise<Pagination<SysRole>> {
    const queryBuilder = this.dsRoleQueryBuilder().andWhere(
      ObjectUtils.omitNil({
        status: role.status,
        roleName: isNotEmpty(role.roleName) ? Like(`%${role.roleName}%`) : undefined,
        roleCode: isNotEmpty(role.roleCode) ? Like(`%${role.roleCode}%`) : undefined,
      })
    )

    return paginate<SysRole>(queryBuilder, {
      page: role.page,
      limit: role.limit,
    })
  }

  /**
   * Add role
   * @param role Role information
   */
  async add(role: CreateRoleDto): Promise<void> {
    const { menuIds, ...roleInfo } = role

    await this.dataSource.transaction(async (manager) => {
      // Add role information
      const result = await manager.insert(SysRole, roleInfo)
      const roleId = result.identifiers[0].roleId

      // Add role-menu association
      if (!isEmpty(menuIds)) {
        await manager.insert(
          SysRoleMenu,
          menuIds.map((menuId) => ({ roleId, menuId }))
        )
      }

      // Add role-department association
      // if (!isEmpty(deptIds)) {
      //   await manager.insert(
      //     SysRoleDept,
      //     deptIds.map((deptId) => ({ roleId, deptId }))
      //   )
      // }
    })
  }

  /**
   * Update role
   * @param roleId Role ID
   * @param role Role information
   */
  async update(roleId: number, role: UpdateRoleDto): Promise<void> {
    const { menuIds, ...roleInfo } = role

    await this.dataSource.transaction(async (manager) => {
      // Update role information
      await manager.update(SysRole, roleId, roleInfo)

      // Delete and add role-menu association
      await manager.delete(SysRoleMenu, { roleId })
      if (!isEmpty(menuIds)) {
        await manager.insert(
          SysRoleMenu,
          menuIds.map((menuId) => ({ roleId, menuId }))
        )
      }

      // Delete and add role-department association
      // await manager.delete(SysRoleDept, { roleId })
      // if (!isEmpty(deptIds)) {
      //   await manager.insert(
      //     SysRoleDept,
      //     deptIds.map((deptId) => ({ roleId, deptId }))
      //   )
      // }
    })
  }

  /**
   * Delete role
   * @param roleIds Role ID
   */
  async delete(roleIds: number[]): Promise<void> {
    for (const roleId of roleIds) {
      const count = await this.userRoleRepository.countBy({ roleId })
      if (count > 0) {
        const role = await this.roleRepository.findOneBy({ roleId })
        throw new ServiceException(`${role.roleName} has been assigned, cannot delete`)
      }
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(SysRole, roleIds)
      await manager.delete(SysRoleMenu, { roleId: In(roleIds) })
      await manager.delete(SysRoleDept, { roleId: In(roleIds) })
    })
  }

  /**
   * Role details
   * @param roleId Role ID
   * @returns Role details
   */
  async info(roleId: number): Promise<RoleInfoVo> {
    const role = await this.roleRepository.findOneBy({ roleId })
    const menus = await this.roleMenuRepository.findBy({ roleId })
    const depts = await this.roleDeptRepository.findBy({ roleId })
    return {
      ...role,
      menuIds: menus.map((menu) => menu.menuId),
      deptIds: depts.map((dept) => dept.deptId),
    }
  }

  /**
   * Check if role operation is allowed, throw error on failure
   * @param roleId Role ID
   */
  checkRoleAllowed(roleId: number | number[]) {
    const roleIds = isArray(roleId) ? roleId : [roleId]
    for (const roleId of roleIds) {
      if (IdentityUtils.isAdminRole(roleId)) {
        throw new ServiceException('Not allowed to operate super administrator role')
      }
    }
  }

  /**
   * Check if there is role data permission, throw error on failure
   * @param roleId Role ID
   */
  async checkRoleDataScope(roleId: number | number[]) {
    if (isEmpty(roleId)) return
    if (IdentityUtils.isAdmin(this.securityContext.getUserId())) return

    const roleIds = isArray(roleId) ? roleId : [roleId]
    for (const roleId of roleIds) {
      const count = await this.dsRoleQueryBuilder().andWhere({ roleId }).getCount()
      if (count <= 0) throw new ServiceException('No permission to access role data')
    }
  }

  /**
   * Check if role name is unique
   * @param roleName Role name
   * @param roleId Role ID
   * @returns true unique / false not unique
   */
  async checkRoleNameUnique(roleName: string, roleId?: number): Promise<boolean> {
    const info = await this.roleRepository.findOneBy({ roleName })
    if (info && info.roleId !== roleId) {
      return false
    }

    return true
  }

  /**
   * Check if role code is unique
   * @param roleCode Role code
   * @param roleId Role ID
   * @returns true unique / false not unique
   */
  async checkRoleCodeUnique(roleCode: string, roleId?: number): Promise<boolean> {
    const info = await this.roleRepository.findOneBy({ roleCode })
    if (info && info.roleId !== roleId) {
      return false
    }

    return true
  }

  /**
   * Role options list
   * @returns Role options list
   */
  async options(): Promise<SysRole[]> {
    return this.dsRoleQueryBuilder()
      .andWhere({
        status: BaseStatusEnum.NORMAL,
        roleId: Not(UserConstants.SUPER_ROLE),
      })
      .getMany()
  }

  /**
   * Update data scope
   * @param roleId Role ID
   * @param dataScopeDto Data scope information
   */
  async updateDataScope(roleId: number, dataScopeDto: UpdateDataScopeDto): Promise<void> {
    const { deptIds, dataScope } = dataScopeDto

    await this.dataSource.transaction(async (manager) => {
      // Update role information
      await manager.update(SysRole, roleId, { dataScope })

      // Delete and add role-department association (data scope)
      await manager.delete(SysRoleDept, { roleId })
      if (!isEmpty(deptIds)) {
        await manager.insert(
          SysRoleDept,
          deptIds.map((deptId) => ({ roleId, deptId }))
        )
      }
    })
  }

  /**
   * Query role list by user ID
   * @param userId User ID
   * @returns User role list
   */
  async selectRoleByUserId(userId: number): Promise<SysRole[]> {
    return this.roleRepository
      .createQueryBuilder('r')
      .leftJoin('sys_user_role', 'ur', 'r.role_id = ur.role_id')
      .where('ur.user_id = :userId', { userId })
      .andWhere('r.status = :status', { status: BaseStatusEnum.NORMAL })
      .getMany()
  }
}
