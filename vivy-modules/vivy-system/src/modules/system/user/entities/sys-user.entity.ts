import { BaseBusinessEntity, BaseStatusEnum } from '@vivy-common/core'
import { ExcelSheet, ExcelColumn } from '@vivy-common/excel'
import { IsEmail, IsEnum, IsIn, IsInt, IsMobilePhone, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * User information table
 */
@Entity({ name: 'sys_user' })
@ExcelSheet({
  name: 'User information',
  rowHeight: 30,
  colWidth: 30,
  colStyle: { alignment: { vertical: 'middle' } },
  headerStyle: {
    font: { color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '000000' }, bgColor: { argb: '000000' } },
  },
})
export class SysUser extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'user_id',
    type: 'bigint',
    comment: 'User ID',
  })
  @IsInt()
  @IsNotEmpty()
  userId: number

  @Column({
    name: 'dept_id',
    type: 'bigint',
    nullable: true,
    comment: 'Department ID',
  })
  @IsInt()
  @IsOptional()
  deptId?: number

  @Column({
    name: 'user_name',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'User account',
  })
  @ExcelColumn({
    name: 'User account',
  })
  @MaxLength(50)
  @IsNotEmpty()
  userName: string

  @Column({
    name: 'nick_name',
    type: 'varchar',
    length: 50,
    comment: 'User nickname',
  })
  @ExcelColumn({
    name: 'User nickname',
  })
  @MaxLength(50)
  @IsNotEmpty()
  nickName: string

  @Column({
    name: 'user_type',
    type: 'char',
    length: 2,
    default: '00',
    comment: 'User type (00 system user)',
  })
  @IsOptional()
  userType: string

  @Column({
    name: 'email',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'User email',
  })
  @IsEmail()
  @MaxLength(50)
  @IsOptional()
  email?: string

  @Column({
    name: 'phonenumber',
    type: 'varchar',
    length: 11,
    nullable: true,
    comment: 'Phone number',
  })
  @ExcelColumn({
    name: 'User phone',
    width: 30,
    cellConfig({ cell }) {
      if (typeof cell.value === 'string') {
        cell.value = cell.value.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2')
      }
    },
  })
  @IsMobilePhone('zh-CN')
  @MaxLength(11)
  @IsOptional()
  phonenumber?: string

  @Column({
    name: 'sex',
    type: 'char',
    length: 1,
    default: '2',
    comment: 'User gender (1 male 2 female 3 confidential)',
  })
  @ExcelColumn({
    name: 'User gender',
    dictType: 'sys_user_sex',
    dictOptions: [
      { label: 'Male', value: '1' },
      { label: 'Female', value: '2' },
      { label: 'Confidential', value: '3' },
    ],
  })
  @IsIn(['1', '2', '3'])
  @IsOptional()
  sex: string

  @Column({
    name: 'avatar',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Avatar address',
  })
  @ExcelColumn({
    name: 'User avatar',
    type: 'image',
    imageOptions: {
      width: 30,
      height: 30,
      hyperlink: true,
    },
  })
  @MaxLength(255)
  @IsOptional()
  avatar?: string

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    select: false,
    comment: 'Password',
  })
  @MaxLength(36) // bcrypt max 72 bytes
  @IsNotEmpty()
  password: string

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: 'User status (0 normal 1 disabled 2 deleted)',
  })
  @IsEnum(BaseStatusEnum)
  @IsOptional()
  status: string
}
