import { BaseTimeEntity } from '@vivy-common/core'
import { Column, Entity } from 'typeorm'

/**
 * Role and department association table Role 1-N Department
 */
@Entity({ name: 'sys_role_dept' })
export class SysRoleDept extends BaseTimeEntity {
  @Column({
    name: 'role_id',
    type: 'bigint',
    primary: true,
    comment: 'User ID',
  })
  roleId: number

  @Column({
    name: 'dept_id',
    type: 'bigint',
    primary: true,
    comment: 'Department ID',
  })
  deptId: number
}
