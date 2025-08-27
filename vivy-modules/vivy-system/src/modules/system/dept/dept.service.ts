import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TreeUtils, BaseStatusEnum, SecurityContext, IdentityUtils, ServiceException } from '@vivy-common/core'
import { DataScope, DataScopeService } from '@vivy-common/datascope'
import { isEmpty } from 'class-validator'
import { Repository } from 'typeorm'
import { SysUser } from '@/modules/system/user/entities/sys-user.entity'
import { CreateDeptDto, UpdateDeptDto } from './dto/dept.dto'
import { SysDept } from './entities/sys-dept.entity'
import { DeptTreeVo } from './vo/dept.vo'

/**
 * Department management
 * @author vivy
 */
@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(SysDept)
    private deptRepository: Repository<SysDept>,

    @InjectRepository(SysUser)
    private userRepository: Repository<SysUser>,

    private securityContext: SecurityContext,
    private dataScopeService: DataScopeService
  ) {}

  /**
   * Data scope department list query construction
   */
  @DataScope({ deptAlias: 'd' })
  private dsDeptQueryBuilder() {
    const dsSql = this.dataScopeService.sql(this.dsDeptQueryBuilder)
    return this.deptRepository.createQueryBuilder('d').andWhere(dsSql).orderBy('d.deptSort', 'ASC')
  }

  /**
   * Query department tree structure
   */
  async tree(): Promise<DeptTreeVo[]> {
    const list = await this.dsDeptQueryBuilder().getMany()
    return TreeUtils.listToTree<DeptTreeVo>(list, {
      id: 'deptId',
      pid: 'parentId',
    })
  }

  /**
   * Add department
   * @param dept Department information
   */
  async add(dept: CreateDeptDto): Promise<void> {
    dept.ancestors = `0`
    if (dept.parentId) {
      const parent = await this.deptRepository.findOneBy({ deptId: dept.parentId })
      dept.ancestors = `${parent.ancestors},${parent.deptId}`
    }

    await this.deptRepository.insert(dept)
  }

  /**
   * Update department
   * @param dept Department information
   * @param deptId Department ID
   */
  async update(deptId: number, dept: UpdateDeptDto): Promise<void> {
    dept.ancestors = `0`
    if (dept.parentId) {
      const parent = await this.deptRepository.findOneBy({ deptId: dept.parentId })
      dept.ancestors = `${parent.ancestors},${parent.deptId}`
    }

    await this.deptRepository.update(deptId, dept)
  }

  /**
   * Delete department
   * @param deptId Department ID
   */
  async delete(deptId: number): Promise<void> {
    await this.deptRepository.delete(deptId)
  }

  /**
   * Department details
   * @param deptId Department ID
   * @returns Department details
   */
  async info(deptId: number): Promise<SysDept> {
    return this.deptRepository.findOneBy({ deptId })
  }

  /**
   * Check if there is department data permission, throw error on failure
   * @param deptId Department ID
   */
  async checkDeptDataScope(deptId: number) {
    if (isEmpty(deptId)) return
    if (IdentityUtils.isAdmin(this.securityContext.getUserId())) return

    const count = await this.dsDeptQueryBuilder().andWhere({ deptId }).getCount()
    if (count <= 0) throw new ServiceException('No permission to access department data')
  }

  /**
   * Check if child nodes exist
   * @param deptId Department ID
   * @return true exists / false does not exist
   */
  async checkDeptExistChild(deptId: number): Promise<boolean> {
    const count = await this.deptRepository.countBy({ parentId: deptId })
    return count > 0
  }

  /**
   * Check if user exists
   * @param deptId Department ID
   * @return true exists / false does not exist
   */
  async checkDeptExistUser(deptId: number): Promise<boolean> {
    const count = await this.userRepository.countBy({ deptId })
    return count > 0
  }

  /**
   * Query department option tree
   * @returns Department option tree
   */
  async treeOptions(): Promise<DeptTreeVo[]> {
    const list = await this.dsDeptQueryBuilder()
      .andWhere({
        status: BaseStatusEnum.NORMAL,
      })
      .getMany()
    return TreeUtils.listToTree<DeptTreeVo>(list, {
      id: 'deptId',
      pid: 'parentId',
    })
  }
}
