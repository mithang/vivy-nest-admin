import { Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import {
  ServiceException,
  PasswordUtils,
  IdentityUtils,
  UserConstants,
  SecurityContext,
  ObjectUtils,
  SysLoginUser,
} from '@vivy-common/core'
import { DataScope, DataScopeService } from '@vivy-common/datascope'
import { ExcelService } from '@vivy-common/excel'
import { isNotEmpty, isEmpty, isArray } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { DataSource, In, Like, Repository } from 'typeorm'
import { ConfigService } from '@/modules/system/config/config.service'
import { MenuService } from '@/modules/system/menu/menu.service'
import { RoleService } from '@/modules/system/role/role.service'
import { ListUserDto, CreateUserDto, UpdateUserDto } from './dto/user.dto'
import { SysUserPost } from './entities/sys-user-post.entity'
import { SysUserRole } from './entities/sys-user-role.entity'
import { SysUser } from './entities/sys-user.entity'
import { UserInfoVo } from './vo/user.vo'

/**
 * User management
 * @author vivy
 */
@Injectable()
export class UserService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,

    @InjectRepository(SysUser)
    private userRepository: Repository<SysUser>,

    @InjectRepository(SysUserRole)
    private userRoleRepository: Repository<SysUserRole>,

    @InjectRepository(SysUserPost)
    private userPostRepository: Repository<SysUserPost>,

    private menuService: MenuService,
    private roleService: RoleService,
    private excelService: ExcelService,
    private configService: ConfigService,
    private securityContext: SecurityContext,
    private dataScopeService: DataScopeService
  ) {}

  /**
   * Data scope user list query construction
   */
  @DataScope({ deptAlias: 'd', userAlias: 'u' })
  private dsUserQueryBuilder() {
    const dsSql = this.dataScopeService.sql(this.dsUserQueryBuilder)
    return this.userRepository
      .createQueryBuilder('u')
      .leftJoin('sys_dept', 'd', 'd.dept_id = u.dept_id')
      .andWhere(dsSql)
  }

  /**
   * User list
   * @param user User information
   * @returns User list
   */
  async list(user: ListUserDto): Promise<Pagination<SysUser>> {
    const queryBuilder = this.dsUserQueryBuilder().andWhere(
      ObjectUtils.omitNil({
        status: user.status,
        userName: isNotEmpty(user.userName) ? Like(`%${user.userName}%`) : undefined,
        nickName: isNotEmpty(user.nickName) ? Like(`%${user.nickName}%`) : undefined,
      })
    )
    if (user.deptId) {
      queryBuilder.andWhere(
        `u.dept_id IN(SELECT dept_id FROM sys_dept WHERE dept_id = ${user.deptId} OR FIND_IN_SET(${user.deptId}, ancestors))`
      )
    }

    return paginate<SysUser>(queryBuilder, {
      page: user.page,
      limit: user.limit,
    })
  }

  /**
   * Add user
   * @param user User information
   */
  async add(user: CreateUserDto): Promise<void> {
    const { roleIds, postIds, ...userInfo } = user

    await this.dataSource.transaction(async (manager) => {
      // Add user information
      userInfo.password = await PasswordUtils.create(user.password)
      const result = await manager.insert(SysUser, userInfo)
      const userId = result.identifiers[0].userId

      // Add user-role association
      if (!isEmpty(roleIds)) {
        await manager.insert(
          SysUserRole,
          roleIds.map((roleId) => ({ userId, roleId }))
        )
      }

      // Add user-post association
      if (!isEmpty(postIds)) {
        await manager.insert(
          SysUserPost,
          postIds.map((postId) => ({ userId, postId }))
        )
      }
    })
  }

  /**
   * Update user
   * @param userId User ID
   * @param user User information
   */
  async update(userId: number, user: UpdateUserDto): Promise<void> {
    const { roleIds, postIds, ...userInfo } = user

    await this.dataSource.transaction(async (manager) => {
      // Update user information
      await manager.update(SysUser, userId, userInfo)

      // Delete and add user-role association
      await manager.delete(SysUserRole, { userId })
      if (!isEmpty(roleIds)) {
        await manager.insert(
          SysUserRole,
          roleIds.map((roleId) => ({ userId, roleId }))
        )
      }

      // Delete and add user-post association
      await manager.delete(SysUserPost, { userId })
      if (!isEmpty(postIds)) {
        await manager.insert(
          SysUserPost,
          postIds.map((postId) => ({ userId, postId }))
        )
      }
    })
  }

  /**
   * Delete user
   * @param userIds User ID
   */
  async delete(userIds: number[]): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(SysUser, userIds)
      await manager.delete(SysUserRole, { userId: In(userIds) })
      await manager.delete(SysUserPost, { userId: In(userIds) })
    })
  }

  /**
   * User details
   * @param userId User ID
   * @returns User details
   */
  async info(userId: number): Promise<UserInfoVo> {
    const user = await this.userRepository.findOneBy({ userId })
    const roles = await this.userRoleRepository.findBy({ userId })
    const posts = await this.userPostRepository.findBy({ userId })

    return {
      ...user,
      roleIds: roles.map((role) => role.roleId),
      postIds: posts.map((post) => post.postId),
    }
  }

  /**
   * Update user basic information
   * @param userId User ID
   * @param user User information
   */
  async updateBasicInfo(userId: number, user: Partial<SysUser>): Promise<void> {
    await this.userRepository.update(userId, user)
  }

  /**
   * Check if user operation is allowed, throw error on failure
   * @param userId User ID
   */
  checkUserAllowed(userId: number | number[]) {
    const userIds = isArray(userId) ? userId : [userId]
    for (const userId of userIds) {
      if (IdentityUtils.isAdmin(userId)) {
        throw new ServiceException('Not allowed to operate super administrator user')
      }
    }
  }

  /**
   * Check if there is user data permission, throw error on failure
   * @param userId User ID
   */
  async checkUserDataScope(userId: number | number[]) {
    if (isEmpty(userId)) return
    if (IdentityUtils.isAdmin(this.securityContext.getUserId())) return

    const userIds = isArray(userId) ? userId : [userId]
    for (const userId of userIds) {
      const count = await this.dsUserQueryBuilder().andWhere({ userId }).getCount()
      if (count <= 0) throw new ServiceException('No permission to access user data')
    }
  }

  /**
   * Check if user name is unique
   * @param userName User name
   * @param userId User ID
   * @returns true unique / false not unique
   */
  async checkUserNameUnique(userName: string, userId?: number): Promise<boolean> {
    const info = await this.userRepository.findOneBy({ userName })
    if (info && info.userId !== userId) {
      return false
    }

    return true
  }

  /**
   * Check if user email is unique
   * @param email User email
   * @param userId User ID
   * @returns true unique / false not unique
   */
  async checkUserEmailUnique(email: string, userId?: number): Promise<boolean> {
    if (!email) return true

    const info = await this.userRepository.findOneBy({ email })
    if (info && info.userId !== userId) {
      return false
    }

    return true
  }

  /**
   * Check if user phone is unique
   * @param phonenumber User phone
   * @param userId User ID
   * @returns true unique / false not unique
   */
  async checkUserPhoneUnique(phonenumber: string, userId?: number): Promise<boolean> {
    if (!phonenumber) return true

    const info = await this.userRepository.findOneBy({ phonenumber })
    if (info && info.userId !== userId) {
      return false
    }

    return true
  }

  /**
   * Query user information by username
   * @param userName User name
   * @returns User information
   */
  async selectUserByUserName(userName: string): Promise<SysUser> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where({
        userName,
      })
      .getOne()
  }

  /**
   * Get role permissions
   * @param userId User ID
   * @return Role permission information
   */
  async getRolePermission(userId: number): Promise<string[]> {
    if (IdentityUtils.isAdminUser(userId)) {
      return [UserConstants.SUPER_ROLE_CODE]
    } else {
      const roles = await this.roleService.selectRoleByUserId(userId)
      return roles.map((role) => role.roleCode).filter(Boolean)
    }
  }

  /**
   * Get data scope permissions
   * @param userId User ID
   * @return Data scope permission information
   */
  async getRoleDataScope(userId: number): Promise<SysLoginUser['scopes']> {
    const roles = await this.roleService.selectRoleByUserId(userId)
    return roles.map((role) => ({
      roleId: role.roleId,
      dataScope: role.dataScope,
    }))
  }

  /**
   * Get menu permissions
   * @param userId User ID
   * @return Menu permission information
   */
  async getMenuPermission(userId: number): Promise<string[]> {
    if (IdentityUtils.isAdminUser(userId)) {
      return [UserConstants.SUPER_ROLE_PERMISSION]
    } else {
      const menus = await this.menuService.selectMenuByUserId(userId)
      return menus.map((menu) => menu.permission).filter(Boolean)
    }
  }

  /**
   * Export users
   */
  async export() {
    const data = await this.dsUserQueryBuilder().getMany()
    const buffer = await this.excelService.export(SysUser, data)
    return buffer
  }

  /**
   * Export template
   */
  async exportTemplate() {
    const buffer = await this.excelService.exportTemplate(SysUser, {
      exclude: ['sex', 'avatar'],
    })
    return buffer
  }

  //Tam comment
  // /**
  //  * Import users
  //  * @param buffer Import file
  //  */
  // async import(buffer: Buffer) {
  //   const data = await this.excelService.import(SysUser, buffer)
  //   const password = await this.configService.value('sys.user.initPassword')

  //   // TODO: Data validation
  //   for (const user of data) {
  //     user.password = await PasswordUtils.create(password)
  //   }

  //   await this.userRepository.insert(data)
  // }
}
