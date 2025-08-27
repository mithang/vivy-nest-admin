import { SysRole } from '../entities/sys-role.entity'

/**
 * Role details
 */
export class RoleInfoVo extends SysRole {
  /** Menu permissions */
  menuIds: number[]

  /** Department permissions */
  deptIds: number[]
}
