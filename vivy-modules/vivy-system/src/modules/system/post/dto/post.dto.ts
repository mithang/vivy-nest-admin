import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { SysPost } from '../entities/sys-post.entity'

/**
 * Query posts
 */
export class ListPostDto extends PaginateDto {
  /** Post name */
  @Allow()
  postName?: string

  /** Post code */
  @Allow()
  postCode?: string

  /** Post status (0 normal 1 disabled) */
  @Allow()
  status?: string
}

/**
 * Add post
 */
export class CreatePostDto extends OmitType(SysPost, ['postId'] as const) {}

/**
 * Update post
 */
export class UpdatePostDto extends OmitType(SysPost, ['postId'] as const) {}
