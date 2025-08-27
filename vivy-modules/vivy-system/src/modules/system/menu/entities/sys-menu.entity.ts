import { BaseBusinessEntity, BaseIsEnum, BaseStatusEnum } from '@vivy-common/core'
import { IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * Menu permission table
 */
@Entity({ name: 'sys_menu' })
export class SysMenu extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'menu_id',
    type: 'bigint',
    comment: 'Menu ID',
  })
  @IsInt()
  @IsNotEmpty()
  menuId: number

  @Column({
    name: 'parent_id',
    type: 'bigint',
    default: 0,
    comment: 'Parent menu ID',
  })
  @IsInt()
  @IsOptional()
  parentId: number

  @Column({
    name: 'menu_name',
    type: 'varchar',
    length: 50,
    comment: 'Menu name',
  })
  @MaxLength(50)
  @IsNotEmpty()
  menuName: string

  @Column({
    name: 'menu_type',
    type: 'char',
    length: 1,
    comment: 'Menu type (M directory C menu F button)',
  })
  @IsIn(['M', 'C', 'F'])
  @IsNotEmpty()
  menuType: string

  @Column({
    name: 'menu_sort',
    type: 'int',
    default: 0,
    comment: 'Display order',
  })
  @IsInt()
  @IsOptional()
  menuSort: number

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: 'Menu status (0 normal 1 disabled)',
  })
  @IsEnum(BaseStatusEnum)
  @IsOptional()
  status: string

  @Column({
    name: 'path',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Route address',
  })
  @MaxLength(255)
  @IsOptional()
  path?: string

  @Column({
    name: 'component',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Component path',
  })
  @MaxLength(255)
  @IsOptional()
  component?: string

  @Column({
    name: 'query',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Route parameters',
  })
  @MaxLength(255)
  @IsOptional()
  query?: string

  @Column({
    name: 'permission',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Permission identifier',
  })
  @MaxLength(100)
  @IsOptional()
  permission?: string

  @Column({
    name: 'icon',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Menu icon',
  })
  @MaxLength(100)
  @IsOptional()
  icon?: string

  @Column({
    name: 'is_visible',
    type: 'char',
    length: 1,
    default: '1',
    comment: 'Whether to display (0 no 1 yes)',
  })
  @IsEnum(BaseIsEnum)
  @IsOptional()
  isVisible: string

  @Column({
    name: 'is_link',
    type: 'char',
    length: 1,
    default: '0',
    comment: 'Whether it is an external link (0 no 1 yes)',
  })
  @IsEnum(BaseIsEnum)
  @IsOptional()
  isLink: string

  @Column({
    name: 'is_frame',
    type: 'char',
    length: 1,
    default: '0',
    comment: 'Whether it is embedded (0 no 1 yes)',
  })
  @IsEnum(BaseIsEnum)
  @IsOptional()
  isFrame: string

  @Column({
    name: 'is_cache',
    type: 'char',
    length: 1,
    default: '0',
    comment: 'Whether to cache (0 no 1 yes)',
  })
  @IsEnum(BaseIsEnum)
  @IsOptional()
  isCache: string
}
