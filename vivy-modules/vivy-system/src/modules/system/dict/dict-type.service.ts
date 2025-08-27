import { Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { BaseStatusEnum, ServiceException } from '@vivy-common/core'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { DataSource, Like, Repository } from 'typeorm'
import { DictCacheService } from './dict-cache.service'
import { ListDictTypeDto, CreateDictTypeDto, UpdateDictTypeDto } from './dto/dict-type.dto'
import { SysDictData } from './entities/sys-dict-data.entity'
import { SysDictType } from './entities/sys-dict-type.entity'

/**
 * Dictionary type management
 * @author vivy
 */
@Injectable()
export class DictTypeService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,

    @InjectRepository(SysDictType)
    private dictTypeRepository: Repository<SysDictType>,

    @InjectRepository(SysDictData)
    private dictDataRepository: Repository<SysDictData>,

    private dictCacheService: DictCacheService
  ) {}

  /**
   * Query dictionary type list
   * @param dictType Dictionary type information
   * @returns Dictionary type list
   */
  async list(dictType: ListDictTypeDto): Promise<Pagination<SysDictType>> {
    return paginate<SysDictType>(
      this.dictTypeRepository,
      {
        page: dictType.page,
        limit: dictType.limit,
      },
      {
        order: {
          dictSort: 'ASC',
        },
        where: {
          status: dictType.status,
          dictName: isNotEmpty(dictType.dictName) ? Like(`%${dictType.dictName}%`) : undefined,
          dictType: isNotEmpty(dictType.dictType) ? Like(`%${dictType.dictType}%`) : undefined,
        },
      }
    )
  }

  /**
   * Add dictionary type
   * @param dictType Dictionary type information
   */
  async add(dictType: CreateDictTypeDto): Promise<void> {
    await this.dictTypeRepository.insert(dictType)
  }

  /**
   * Update dictionary type
   * @param dictId Dictionary type ID
   * @param dictType Dictionary type information
   */
  async update(dictId: number, dictType: UpdateDictTypeDto): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const oldDict = await manager.findOneBy(SysDictType, { dictId })
      await manager.update(SysDictType, dictId, dictType)
      if (oldDict.dictType !== dictType.dictType) {
        await manager.update(SysDictData, { dictType: oldDict.dictType }, { dictType: dictType.dictType })
        await this.dictCacheService.del(oldDict.dictType)
      }
    })
    await this.dictCacheService.set(dictType.dictType)
  }

  /**
   * Delete dictionary type
   * @param dictIds Dictionary type ID
   */
  async delete(dictIds: number[]): Promise<void> {
    for (const dictId of dictIds) {
      const { dictType, dictName } = await this.dictTypeRepository.findOneBy({ dictId })
      const count = await this.dictDataRepository.countBy({ dictType })
      if (count > 0) {
        throw new ServiceException(`${dictName} has been assigned, cannot delete`)
      }
      await this.dictTypeRepository.delete(dictId)
      await this.dictCacheService.del(dictType)
    }
  }

  /**
   * Dictionary type details
   * @param dictId Dictionary type ID
   * @returns Dictionary type details
   */
  async info(dictId: number): Promise<SysDictType> {
    return this.dictTypeRepository.findOneBy({ dictId })
  }

  /**
   * Check if dictionary type is unique
   * @param dictType Dictionary type
   * @param dictId Dictionary type ID
   * @returns true unique / false not unique
   */
  async checkDictTypeUnique(dictType: string, dictId?: number): Promise<boolean> {
    const info = await this.dictTypeRepository.findOneBy({ dictType })
    if (info && info.dictId !== dictId) {
      return false
    }

    return true
  }

  /**
   * Check if dictionary name is unique
   * @param dictType Dictionary type
   * @param dictId Dictionary type ID
   * @returns true unique / false not unique
   */
  async checkDictNameUnique(dictName: string, dictId?: number): Promise<boolean> {
    const info = await this.dictTypeRepository.findOneBy({ dictName })
    if (info && info.dictId !== dictId) {
      return false
    }

    return true
  }

  /**
   * Dictionary type options list
   * @returns Dictionary type options list
   */
  async options(): Promise<SysDictType[]> {
    return this.dictTypeRepository.find({
      select: ['dictId', 'dictName', 'dictType'],
      order: {
        dictSort: 'ASC',
      },
      where: {
        status: BaseStatusEnum.NORMAL,
      },
    })
  }
}
