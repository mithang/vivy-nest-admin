import { SysUser } from '../entities/sys-user.entity'

/**
 * User details
 */
export class UserInfoVo extends SysUser {
  /** User roles */
  roleIds: number[]

  /** User posts */
  postIds: number[]
}
