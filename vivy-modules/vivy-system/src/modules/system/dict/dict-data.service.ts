import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { In, Like, Repository } from 'typeorm'
import { DictCacheService } from './dict-cache.service'
import { ListDictDataDto, CreateDictDataDto, UpdateDictDataDto } from './dto/dict-data.dto'
import { SysDictData } from './entities/sys-dict-data.entity'

/**
 * Dictionary data management
 * @author vivy
 */
@Injectable()
export class DictDataService {
  constructor(
    @InjectRepository(SysDictData)
    private dictDataRepository: Repository<SysDictData>,

    private dictCacheService: DictCacheService
  ) {}

  /**
   * Query dictionary data list
   * @author vivy
   * @param dictData Dictionary data information
   * @returns Dictionary data list
   */
  async list(dictData: ListDictDataDto): Promise<Pagination<SysDictData>> {
    return paginate<SysDictData>(
      this.dictDataRepository,
      {
        page: dictData.page,
        limit: dictData.limit,
      },
      {
        order: {
          dictSort: 'ASC',
        },
        where: {
          status: dictData.status,
          dictType: dictData.dictType,
          dictLabel: isNotEmpty(dictData.dictLabel) ? Like(`%${dictData.dictLabel}%`) : undefined,
        },
      }
    )
  }

  /**
   * Add dictionary data
   * @param dictData Dictionary data information
   */
  async add(dictData: CreateDictDataDto): Promise<void> {
    await this.dictDataRepository.insert(dictData)
    await this.dictCacheService.set(dictData.dictType)
  }

  /**
   * Update dictionary data
   * @param dictId Dictionary data ID
   * @param dictData Dictionary data information
   */
  async update(dictId: number, dictData: UpdateDictDataDto): Promise<void> {
    await this.dictDataRepository.update(dictId, dictData)
    await this.dictCacheService.set(dictData.dictType)
  }

  /**
   * Delete dictionary data
   * @param dictIds Dictionary data ID
   */
  async delete(dictIds: number[]): Promise<void> {
    for (const dictId of dictIds) {
      const { dictType } = await this.dictDataRepository.findOneBy({ dictId })
      await this.dictDataRepository.delete(dictId)
      await this.dictCacheService.set(dictType)
    }
  }

  /**
   * Dictionary data details
   * @param dictId Dictionary data ID
   * @returns Dictionary data details
   */
  async info(dictId: number): Promise<SysDictData> {
    return this.dictDataRepository.findOneBy({ dictId })
  }

  /**
   * Check if dictionary label is unique
   * @param dictType Dictionary type
   * @param dictLabel Dictionary data label
   * @param dictId Dictionary data ID
   * @returns true unique / false not unique
   */
  async checkDictLabelUnique(dictType: string, dictLabel: string, dictId?: number): Promise<boolean> {
    const info = await this.dictDataRepository.findOneBy({ dictType, dictLabel })
    if (info && info.dictId !== dictId) {
      return false
    }

    return true
  }

  /**
   * Check if dictionary value is unique
   * @param dictType Dictionary type
   * @param dictValue Dictionary data value
   * @param dictId Dictionary data ID
   * @returns true unique / false not unique
   */
  async checkDictValueUnique(dictType: string, dictValue: string, dictId?: number): Promise<boolean> {
    const info = await this.dictDataRepository.findOneBy({ dictType, dictValue })
    if (info && info.dictId !== dictId) {
      return false
    }

    return true
  }

  /**
   * Query dictionary data options list by dictionary type
   * @param dictType Dictionary type
   * @returns Dictionary data options list
   */
  async options(dictType: string): Promise<SysDictData[]> {
    const datas = await this.dictCacheService.get(dictType)
    return datas || []
  }

  /**
   * Query dictionary object collection by dictionary type
   * @param dictTypes Dictionary type
   * @returns Dictionary data options object
   */
  async selectDictLabelValue(dictTypes: string[]) {
    const data = await this.dictDataRepository.find({
      where: {
        dictType: In(dictTypes),
      },
    })

    const map: Record<string, { label: string; value: string }[]> = {}
    data.forEach((d) => {
      map[d.dictType] ??= []
      map[d.dictType].push({ label: d.dictLabel, value: d.dictValue })
    })
    return map
  }
}
