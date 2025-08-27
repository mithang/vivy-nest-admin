import { BaseBusinessEntity, BaseIsEnum } from '@vivy-common/core'
import { IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { GenTable } from './gen-table.entity'

/**
 * Code generation business table fields
 */
@Entity({ name: 'gen_table_column' })
export class GenTableColumn extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'column_id',
    type: 'int',
    comment: 'ID',
  })
  @IsInt()
  @IsNotEmpty()
  columnId: number

  @Column({
    name: 'table_id',
    type: 'int',
    comment: 'Belonging table ID',
  })
  @IsInt()
  @IsNotEmpty()
  tableId: number

  @Column({
    name: 'column_name',
    type: 'varchar',
    length: 100,
    comment: 'Column name',
  })
  @MaxLength(100)
  @IsNotEmpty()
  columnName: string

  @Column({
    name: 'column_type',
    type: 'varchar',
    length: 100,
    comment: 'Column type',
  })
  @MaxLength(100)
  @IsNotEmpty()
  columnType: string

  @Column({
    name: 'column_sort',
    type: 'int',
    default: 0,
    comment: 'Column order',
  })
  @IsInt()
  @IsOptional()
  columnSort: number

  @Column({
    name: 'column_comment',
    type: 'varchar',
    length: 100,
    comment: 'Column description',
  })
  @MaxLength(100)
  @IsNotEmpty()
  columnComment: string

  @Column({
    name: 'is_pk',
    type: 'char',
    length: 1,
    nullable: true,
    comment: 'Is primary key (0 no 1 yes)',
  })
  @IsEnum(BaseIsEnum)
  @IsOptional()
  isPk?: string

  @Column({
    name: 'is_increment',
    type: 'char',
    length: 1,
    nullable: true,
    comment: 'Is auto increment (0 no 1 yes)',
  })
  @IsEnum(BaseIsEnum)
  @IsOptional()
  isIncrement?: string

  @Column({
    name: 'is_required',
    type: 'char',
    length: 1,
    nullable: true,
    comment: 'Is required (0 no 1 yes)',
  })
  @IsEnum(BaseIsEnum)
  @IsOptional()
  isRequired?: string

  @Column({
    name: 'is_insert',
    type: 'char',
    length: 1,
    nullable: true,
    comment: 'Is insert field (0 no 1 yes)',
  })
  @IsEnum(BaseIsEnum)
  @IsOptional()
  isInsert?: string

  @Column({
    name: 'is_edit',
    type: 'char',
    length: 1,
    nullable: true,
    comment: 'Is edit field (0 no 1 yes)',
  })
  @IsEnum(BaseIsEnum)
  @IsOptional()
  isEdit?: string

  @Column({
    name: 'is_list',
    type: 'char',
    length: 1,
    nullable: true,
    comment: 'Is list field (0 no 1 yes)',
  })
  @IsEnum(BaseIsEnum)
  @IsOptional()
  isList?: string

  @Column({
    name: 'is_query',
    type: 'char',
    length: 1,
    nullable: true,
    comment: 'Is query field (0 no 1 yes)',
  })
  @IsEnum(BaseIsEnum)
  @IsOptional()
  isQuery?: string

  @Column({
    name: 'field_name',
    type: 'varchar',
    length: 100,
    comment: 'Property name',
  })
  @MaxLength(100)
  @IsNotEmpty()
  fieldName: string

  @Column({
    name: 'tslang_type',
    type: 'varchar',
    length: 100,
    comment: 'TS type',
  })
  @MaxLength(100)
  @IsNotEmpty()
  tslangType: string

  @Column({
    name: 'javalang_type',
    type: 'varchar',
    length: 100,
    comment: 'JAVA type',
  })
  @MaxLength(100)
  @IsNotEmpty()
  javalangType: string

  @Column({
    name: 'query_type',
    type: 'varchar',
    length: 100,
    comment: 'Query method',
  })
  @MaxLength(100)
  @IsNotEmpty()
  queryType: string

  @Column({
    name: 'html_type',
    type: 'varchar',
    length: 100,
    comment: 'Display type',
  })
  @MaxLength(100)
  @IsNotEmpty()
  htmlType: string

  @Column({
    name: 'dict_type',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Dictionary type',
  })
  @MaxLength(100)
  @IsOptional()
  dictType?: string

  @JoinColumn({
    name: 'table_id',
    foreignKeyConstraintName: 'table_fk',
  })
  @ManyToOne(() => GenTable, (table) => table.columns, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  table: GenTable
}
