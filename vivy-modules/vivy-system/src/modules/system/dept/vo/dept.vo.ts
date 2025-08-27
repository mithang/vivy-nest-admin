import { SysDept } from '../entities/sys-dept.entity'

/**
 * Department tree
 */
export class DeptTreeVo extends SysDept {
  /** Child nodes */
  children: DeptTreeVo[]
}
