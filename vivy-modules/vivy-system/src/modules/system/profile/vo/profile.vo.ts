import { SysDept } from '@/modules/system/dept/entities/sys-dept.entity'
import { SysPost } from '@/modules/system/post/entities/sys-post.entity'
import { SysRole } from '@/modules/system/role/entities/sys-role.entity'
import { SysUser } from '@/modules/system/user/entities/sys-user.entity'

/**
 * Personal information
 */
export class ProfileInfoVo extends SysUser {
  /** Department information */
  dept?: SysDept

  /** Role information */
  roles?: SysRole[]

  /** Post information */
  posts?: SysPost[]
}
