import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { Redis } from 'ioredis'
import { groupBy } from 'lodash'
import { Repository } from 'typeorm'
import { SYS_DICT_KEY } from '@/common/constants/cache.constants'
import { SysDictData } from './entities/sys-dict-data.entity'

/**
 * Dictionary data cache
 * @author vivy
 */
@Injectable()
export class DictCacheService implements OnModuleInit {
  constructor(
    @InjectRedis()
    private redis: Redis,

    @InjectRepository(SysDictData)
    private dictDataRepository: Repository<SysDictData>
  ) {}

  async onModuleInit() {
    this.init()
  }

  /**
   * Load dictionary data cache
   */
  async init(): Promise<void> {
    const datas = await this.dictDataRepository.find({ order: { dictSort: 'ASC' } })
    const group = groupBy(datas, 'dictType')
    for (const type in group) {
      const data = group[type]
      await this.redis.set(this.getCacheKey(type), JSON.stringify(data))
    }
  }

  /**
   * Reset dictionary data cache
   */
  async reset(): Promise<void> {
    await this.clear()
    await this.init()
  }

  /**
   * Set dictionary data cache
   * @param dictType Cache key
   */
  async set(dictType: string): Promise<void> {
    const data = await this.dictDataRepository.findBy({ dictType })
    await this.redis.set(this.getCacheKey(dictType), JSON.stringify(data))
  }

  /**
   * Query dictionary data cache
   * @param dictType Cache key
   * @returns Cache value
   */
  async get(dictType: string): Promise<SysDictData[]> {
    const data = await this.redis.get(this.getCacheKey(dictType))
    return JSON.parse(data)
  }

  /**
   * Delete dictionary data cache
   * @param dictType Cache key
   */
  async del(dictType: string): Promise<void> {
    await this.redis.del(this.getCacheKey(dictType))
  }

  /**
   * Clear dictionary data cache
   */
  async clear(): Promise<void> {
    const keys = await this.redis.keys(this.getCacheKey('*'))
    await this.redis.del(keys)
  }

  /**
   * Get cache key
   */
  private getCacheKey(dictType: string): string {
    return `${SYS_DICT_KEY}${dictType}`
  }
}
