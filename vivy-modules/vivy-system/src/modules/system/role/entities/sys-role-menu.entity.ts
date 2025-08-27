import { BaseTimeEntity } from '@vivy-common/core'
import { Column, Entity } from 'typeorm'

/**
 * Role and menu association table Role 1-N Menu
 */
@Entity({ name: 'sys_role_menu' })
export class SysRoleMenu extends BaseTimeEntity {
  @Column({
    name: 'role_id',
    type: 'bigint',
    primary: true,
    comment: 'Role ID',
  })
  roleId: number

  @Column({
    name: 'menu_id',
    type: 'bigint',
    primary: true,
    comment: 'Menu ID',
  })
  menuId: number
}
