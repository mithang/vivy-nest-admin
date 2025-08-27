import { BaseBusinessEntity } from '@vivy-common/core'
import { IsInt, IsNotEmpty, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * File table
 */
@Entity({ name: 'sys_file' })
export class SysFile extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'file_id',
    type: 'bigint',
    comment: 'File ID',
  })
  @IsInt()
  @IsNotEmpty()
  fileId: number

  @Column({
    name: 'file_use',
    type: 'varchar',
    length: 100,
    comment: 'File usage',
  })
  @MaxLength(100)
  @IsNotEmpty()
  fileUse: string

  @Column({
    name: 'file_url',
    type: 'varchar',
    length: 500,
    comment: 'File path',
  })
  @MaxLength(500)
  @IsNotEmpty()
  fileUrl: string

  @Column({
    name: 'file_name',
    type: 'varchar',
    length: 500,
    comment: 'File name',
  })
  @MaxLength(500)
  @IsNotEmpty()
  fileName: string

  @Column({
    name: 'file_size',
    type: 'bigint',
    comment: 'File size',
  })
  @IsInt()
  @IsNotEmpty()
  fileSize: number

  @Column({
    name: 'file_type',
    type: 'varchar',
    length: 100,
    comment: 'File type',
  })
  @MaxLength(100)
  @IsNotEmpty()
  fileType: string
}
