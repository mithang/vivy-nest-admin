import { BaseBusinessEntity, BaseStatusEnum } from '@vivy-common/core'
import { IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * Post information table
 */
@Entity({ name: 'sys_post' })
export class SysPost extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'post_id',
    type: 'bigint',
    comment: 'Post ID',
  })
  @IsInt()
  @IsNotEmpty()
  postId: number

  @Column({
    name: 'post_name',
    type: 'varchar',
    length: 50,
    comment: 'Post name',
  })
  @MaxLength(50)
  @IsNotEmpty()
  postName: string

  @Column({
    name: 'post_code',
    type: 'varchar',
    length: 50,
    comment: 'Post code',
  })
  @MaxLength(50)
  @IsNotEmpty()
  postCode: string

  @Column({
    name: 'post_sort',
    type: 'int',
    default: 0,
    comment: 'Display order',
  })
  @IsInt()
  @IsOptional()
  postSort: number

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: 'Post status (0 normal 1 disabled)',
  })
  @IsEnum(BaseStatusEnum)
  @IsOptional()
  status: string
}
