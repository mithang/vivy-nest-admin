import { BaseBusinessEntity } from '@vivy-common/core'
import { Type } from 'class-transformer'
import { ArrayNotEmpty, IsInt, IsNotEmpty, IsOptional, MaxLength, ValidateNested } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { GenTableColumn } from './gen-table-column.entity'

/**
 * Code generation business table
 */
@Entity({ name: 'gen_table' })
export class GenTable extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'table_id',
    type: 'int',
    comment: 'ID',
  })
  @IsInt()
  @IsNotEmpty()
  tableId: number

  @Column({
    name: 'table_name',
    type: 'varchar',
    length: 100,
    comment: 'Table name',
  })
  @MaxLength(100)
  @IsNotEmpty()
  tableName: string

  @Column({
    name: 'table_comment',
    type: 'varchar',
    length: 100,
    comment: 'Table description',
  })
  @MaxLength(100)
  @IsNotEmpty()
  tableComment: string

  @Column({
    name: 'sub_table_name',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Associated sub-table name',
  })
  @MaxLength(100)
  @IsOptional()
  subTableName?: string

  @Column({
    name: 'sub_table_fk_name',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Sub-table associated foreign key name',
  })
  @MaxLength(100)
  @IsOptional()
  subTableFkName?: string

  @Column({
    name: 'class_name',
    type: 'varchar',
    length: 100,
    comment: 'Entity class name',
  })
  @MaxLength(100)
  @IsNotEmpty()
  className: string

  @Column({
    name: 'template_category',
    type: 'varchar',
    length: 2,
    default: '1',
    comment: 'Generation template category',
  })
  @IsOptional()
  templateCategory: string

  @Column({
    name: 'module_name',
    type: 'varchar',
    length: 100,
    comment: 'Generation module name',
  })
  @MaxLength(100)
  @IsNotEmpty()
  moduleName: string

  @Column({
    name: 'business_name',
    type: 'varchar',
    length: 100,
    comment: 'Generation business name',
  })
  @MaxLength(100)
  @IsNotEmpty()
  businessName: string

  @Column({
    name: 'function_name',
    type: 'varchar',
    length: 100,
    comment: 'Generation function name',
  })
  @MaxLength(100)
  @IsNotEmpty()
  functionName: string

  @Column({
    name: 'function_author',
    type: 'varchar',
    length: 100,
    comment: 'Generation function author',
  })
  @MaxLength(100)
  @IsNotEmpty()
  functionAuthor: string

  @OneToMany(() => GenTableColumn, (column) => column.table, {
    cascade: true,
  })
  @ValidateNested()
  @ArrayNotEmpty()
  @Type(() => GenTableColumn)
  columns: GenTableColumn[]
}
