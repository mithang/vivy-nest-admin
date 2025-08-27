import * as fs from 'fs/promises'
import * as path from 'path'
import { Injectable, StreamableFile } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ServiceException, SecurityContext } from '@vivy-common/core'
import * as archiver from 'archiver'
import { isEmpty, isNotEmpty } from 'class-validator'
import { Pagination, paginate } from 'nestjs-typeorm-paginate'
import { Like, Repository } from 'typeorm'
import { GenUtils } from '../utils/gen.utils'
import { TemplateUtils } from '../utils/template.utils'
import { ListGenDto, UpdateGenDto } from './dto/gen.dto'
import { GenTableColumn } from './entities/gen-table-column.entity'
import { GenTable } from './entities/gen-table.entity'
import { GenMapper } from './gen.mapper'
import { GenPreviewVo } from './vo/gen.vo'

/**
 * Code generation
 * @author vivy
 */
@Injectable()
export class GenService {
  constructor(
    @InjectRepository(GenTable)
    private tableRepository: Repository<GenTable>,

    @InjectRepository(GenTableColumn)
    private tableColumnRepository: Repository<GenTableColumn>,

    private genMapper: GenMapper,
    private securityContext: SecurityContext
  ) {}

  /**
   * Code generation list
   * @param gen Search information
   * @returns Code generation list
   */
  async list(gen: ListGenDto): Promise<Pagination<GenTable>> {
    return paginate<GenTable>(
      this.tableRepository,
      {
        page: gen.page,
        limit: gen.limit,
      },
      {
        where: {
          tableName: isNotEmpty(gen.tableName) ? Like(`%${gen.tableName}%`) : undefined,
          tableComment: isNotEmpty(gen.tableComment) ? Like(`%${gen.tableComment}%`) : undefined,
        },
      }
    )
  }

  /**
   * Update code generation
   * @param gen Update information
   */
  async update(gen: UpdateGenDto): Promise<void> {
    gen.updateBy = this.securityContext.getUserName()
    await this.tableRepository.save(gen)
  }

  /**
   * Delete code generation
   * @param tableIds Code generation ID
   */
  async delete(tableIds: number[]): Promise<void> {
    await this.tableRepository.delete(tableIds)
  }

  /**
   * Code generation details
   * @param tableId Code generation ID
   * @returns Code generation details
   */
  async info(tableId: number): Promise<GenTable> {
    return this.tableRepository.findOne({
      where: {
        tableId,
      },
      relations: {
        columns: true,
      },
    })
  }

  /**
   * Query database table list
   * @param tableId Code generation ID
   * @returns Database table list
   */
  async dblist(gen: ListGenDto): Promise<GenTable[]> {
    return this.genMapper.selectDbTableList(gen.tableName, gen.tableComment)
  }

  /**
   * Import table structure to code generation table
   * @param tableNames Table names
   */
  async import(tableNames: string[]): Promise<void> {
    const tables = await this.genMapper.selectDbTableListByNames(tableNames)
    for (const table of tables) {
      table.createBy = this.securityContext.getUserName()
      GenUtils.initTable(table)
      const columns = await this.genMapper.selectDbTableColumnsByName(table.tableName)
      for (const column of columns) {
        GenUtils.initColumn(column, table)
      }
      table.columns = columns
    }
    await this.tableRepository.save(tables)
  }

  /**
   * Sync table structure to code generation table
   * @param tableName Table name
   */
  async sync(tableName: string): Promise<any> {
    const dbColumns = await this.genMapper.selectDbTableColumnsByName(tableName)
    if (isEmpty(dbColumns)) {
      throw new ServiceException('Sync data failed, original table structure does not exist')
    }

    // Get old field column information and convert to object for easy querying
    const table = await this.tableRepository.findOne({
      where: {
        tableName,
      },
      relations: {
        columns: true,
      },
    })
    const tableColumnMap = new Map()
    table.columns.forEach((column) => {
      tableColumnMap.set(column.columnName, column)
    })

    // Get new field column information and retain necessary fields from old field column information
    dbColumns.forEach((column) => {
      GenUtils.initColumn(column, table)

      const oldColumn = tableColumnMap.get(column.columnName)
      if (isEmpty(oldColumn)) return

      // If it's a list, continue to retain query method/dictionary type options
      if (GenUtils.isRequire(column.isList)) {
        column.dictType = oldColumn.dictType
        column.queryType = oldColumn.queryType
      }

      // If it's (add/update & not primary key), continue to retain required/display type options
      if (
        !GenUtils.isRequire(column.isPk) &&
        (GenUtils.isRequire(column.isEdit) || GenUtils.isRequire(column.isInsert))
      ) {
        column.htmlType = oldColumn.htmlType
        column.isRequired = oldColumn.isRequired
      }
    })

    // Delete all and reinsert // todo: To be optimized for on-demand update, insert, delete
    await this.tableColumnRepository.delete({ tableId: table.tableId })
    await this.tableColumnRepository.insert(dbColumns)
  }

  /**
   * Preview code
   * @param tableName Table name
   * @returns Code details
   */
  async preview(tableName: string): Promise<GenPreviewVo[]> {
    const result: GenPreviewVo[] = []

    // Query table information
    const table = await this.tableRepository.findOne({
      where: {
        tableName,
      },
      relations: {
        columns: true,
      },
    })

    // Get template list
    const templates = TemplateUtils.getTemplateList()
    for (const template of templates) {
      const item: GenPreviewVo = { name: template.name, files: [] }
      result.push(item)

      // Render template code
      for (const file of template.files) {
        const raw = await fs.readFile(path.join(__dirname, '../template', file), 'utf-8')
        const name = TemplateUtils.getFileName(file, table)
        const code = TemplateUtils.compileTemplate(raw, table)
        item.files.push({ name, code })
      }
    }

    return result
  }

  /**
   * Download code
   * @param tableName Table name
   * @returns Code details
   */
  async download(tableName: string): Promise<StreamableFile> {
    const preview = await this.preview(tableName)
    const archive = archiver('zip')

    for (const code of preview) {
      for (const file of code.files) {
        archive.append(file.code, { name: `${tableName}/${file.name}` })
      }
    }
    archive.finalize()

    return new StreamableFile(archive)
  }
}
