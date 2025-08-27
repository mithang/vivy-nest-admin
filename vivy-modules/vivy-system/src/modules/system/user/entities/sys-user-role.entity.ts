import { BaseTimeEntity } from '@vivy-common/core'
import { Column, Entity } from 'typeorm'

/**
 * User and role association table User 1-N Role
 */
@Entity({ name: 'sys_user_role' })
export class SysUserRole extends BaseTimeEntity {
  @Column({
    name: 'user_id',
    type: 'bigint',
    primary: true,
    comment: 'User ID',
  })
  userId: number

  @Column({
    name: 'role_id',
    type: 'bigint',
    primary: true,
    comment: 'Role ID',
  })
  roleId: number
}
