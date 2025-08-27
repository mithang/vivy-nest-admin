import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { BaseStatusEnum } from '@vivy-common/core'
import { Redis } from 'ioredis'
import { Repository } from 'typeorm'
import { SYS_CONFIG_KEY } from '@/common/constants/cache.constants'
import { SysConfig } from './entities/sys-config.entity'

/**
 * Parameter configuration cache
 * @author vivy
 */
@Injectable()
export class ConfigCacheService implements OnModuleInit {
  constructor(
    @InjectRedis()
    private redis: Redis,

    @InjectRepository(SysConfig)
    private configRepository: Repository<SysConfig>
  ) {}

  async onModuleInit() {
    this.init()
  }

  /**
   * Load parameter configuration cache
   */
  async init(): Promise<void> {
    const configs = await this.configRepository.findBy({ status: BaseStatusEnum.NORMAL })
    for (const config of configs) {
      await this.redis.set(this.getCacheKey(config.configKey), JSON.stringify(config))
    }
  }

  /**
   * Reset parameter configuration cache
   */
  async reset(): Promise<void> {
    await this.clear()
    await this.init()
  }

  /**
   * Set parameter configuration cache
   * @param configKey Cache key
   */
  async set(configKey: string): Promise<void> {
    const config = await this.configRepository.findOneBy({ configKey })
    await this.redis.set(this.getCacheKey(configKey), JSON.stringify(config))
  }

  /**
   * Query parameter configuration cache
   * @param configKey Cache key
   * @returns Cache value
   */
  async get(configKey: string): Promise<SysConfig> {
    const config = await this.redis.get(this.getCacheKey(configKey))
    return JSON.parse(config)
  }

  /**
   * Delete parameter configuration cache
   * @param configKey Cache key
   */
  async del(configKey: string): Promise<void> {
    await this.redis.del(this.getCacheKey(configKey))
  }

  /**
   * Clear parameter configuration cache
   */
  async clear(): Promise<void> {
    const keys = await this.redis.keys(this.getCacheKey('*'))
    await this.redis.del(keys)
  }

  /**
   * Get cache key
   */
  private getCacheKey(configKey: string): string {
    return `${SYS_CONFIG_KEY}${configKey}`
  }
}
