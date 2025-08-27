import { BaseTimeEntity } from '@vivy-common/core'
import { Column, Entity } from 'typeorm'

/**
 * User and post association table User 1-N Post
 */
@Entity({ name: 'sys_user_post' })
export class SysUserPost extends BaseTimeEntity {
  @Column({
    name: 'user_id',
    type: 'bigint',
    primary: true,
    comment: 'User ID',
  })
  userId: number

  @Column({
    name: 'post_id',
    type: 'bigint',
    primary: true,
    comment: 'Post ID',
  })
  postId: number
}
