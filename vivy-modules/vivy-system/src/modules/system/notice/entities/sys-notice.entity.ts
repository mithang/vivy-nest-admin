import { BaseStatusEnum, BaseBusinessEntity } from '@vivy-common/core'
import { IsEnum, IsIn, IsInt, IsNotEmpty, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * Notices and announcements table
 */
@Entity({ name: 'sys_notice' })
export class SysNotice extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'notice_id',
    type: 'bigint',
    comment: 'Notice ID',
  })
  @IsInt()
  @IsNotEmpty()
  noticeId: number

  @Column({
    name: 'notice_title',
    type: 'varchar',
    length: 50,
    comment: 'Notice title',
  })
  @MaxLength(50)
  @IsNotEmpty()
  noticeTitle: string

  @Column({
    name: 'notice_type',
    type: 'char',
    length: 2,
    comment: 'Notice type (1 notice 2 announcement)',
  })
  @IsIn(['1', '2'])
  @IsNotEmpty()
  noticeType: string

  @Column({
    name: 'notice_content',
    type: 'longblob',
    comment: 'Notice content',
    transformer: {
      to(value) {
        return value
      },
      from(value) {
        return Buffer.from(value).toString()
      },
    },
  })
  @IsNotEmpty()
  noticeContent: string

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    comment: 'Notice status (0 normal 1 closed)',
  })
  @IsEnum(BaseStatusEnum)
  @IsNotEmpty()
  status: string
}
