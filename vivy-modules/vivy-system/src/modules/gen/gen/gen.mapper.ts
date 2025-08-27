import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { MybatisService } from '@vivy-common/mybatis'
import { DataSource } from 'typeorm'
import { GenTableColumn } from './entities/gen-table-column.entity'
import { GenTable } from './entities/gen-table.entity'

@Injectable()
export class GenMapper {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    private mybatisService: MybatisService
  ) {}

  /**
   * Query database table list
   * @param name Table name
   * @param comment Table comment
   */
  async selectDbTableList(name: string, comment: string): Promise<GenTable[]> {
    const sql = this.mybatisService.getSql('gen.gen.mapper', 'selectDbTableList', {
      name: name || '',
      comment: comment || '',
    })
    return this.dataSource.query(sql)
  }

  /**
   * Query database table list by names
   * @param names Table names
   */
  async selectDbTableListByNames(names: string[]): Promise<GenTable[]> {
    const sql = this.mybatisService.getSql('gen.gen.mapper', 'selectDbTableListByNames', {
      names,
    })
    return this.dataSource.query(sql)
  }

  /**
   * Query table column list by name
   * @param name Table name
   */
  async selectDbTableColumnsByName(name: string): Promise<GenTableColumn[]> {
    const sql = this.mybatisService.getSql('gen.gen.mapper', 'selectDbTableColumnsByName', {
      name,
    })
    return this.dataSource.query(sql)
  }
}
