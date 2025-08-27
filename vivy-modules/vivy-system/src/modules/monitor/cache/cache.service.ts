import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { Redis } from 'ioredis'
import { CacheVo } from './vo/cache.vo'

/**
 * Cache list
 */
export const cacheList: CacheVo[] = [
  { name: 'login_token', remark: 'User information' },
  { name: 'captcha_code', remark: 'Verification code' },
  { name: 'repeat_submit', remark: 'Duplicate submission prevention' },
  { name: 'sys_dict', remark: 'Data dictionary' },
  { name: 'sys_config', remark: 'Parameter configuration' },
]

/**
 * Cache management
 * @author vivy
 */
@Injectable()
export class CacheService {
  constructor(
    @InjectRedis()
    private redis: Redis
  ) {}

  /**
   * Query cache name list
   */
  async getAll(): Promise<CacheVo[]> {
    return cacheList
  }

  /**
   * Query cache key name list
   * @param name Cache name
   */
  async getKeys(name: string): Promise<CacheVo[]> {
    const keys = await this.redis.keys(`${name}:*`)
    return keys.map((key) => ({ name, key: key.replace(`${name}:`, '') }))
  }

  /**
   * Query cache content
   * @param name Cache name
   * @param key Cache key name
   */
  async getValue(name: string, key: string): Promise<CacheVo> {
    const value = await this.redis.get(`${name}:${key}`)
    return { name, key, value }
  }

  /**
   * Delete all cache content
   */
  async deleteAll(): Promise<void> {
    for (const { name } of cacheList) {
      await this.deleteByName(name)
    }
  }

  /**
   * Delete cache content by cache name
   * @param name Cache name
   */
  async deleteByName(name: string): Promise<void> {
    const keys = await this.redis.keys(`${name}:*`)
    await this.redis.del(keys)
  }

  /**
   * Delete cache content by cache key name
   * @param name Cache name
   * @param key Cache key name
   */
  async deleteByNameAndKey(name: string, key: string): Promise<void> {
    await this.redis.del(`${name}:${key}`)
  }
}
