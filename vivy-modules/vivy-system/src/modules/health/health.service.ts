import { Injectable } from '@nestjs/common'
import {
  DiskHealthIndicator,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus'
import { RedisHealthIndicator } from './indicators/redis.health'

@Injectable()
export class HealthService {
  constructor(
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private redis: RedisHealthIndicator
  ) {}

  /**
   * Check network connection
   */
  async checkNetwork() {
    return this.http.pingCheck('vivy', 'http://43.140.221.180:8000/')
  }

  /**
   * Check MySQL connection
   */
  async checkMysql() {
    return this.db.pingCheck('mysql')
  }

  /**
   * Check Redis connection
   */
  async checkRedis() {
    return this.redis.pingCheck('redis')
  }

  /**
   * Check disk usage
   */
  async checkDisk() {
    return this.disk.checkStorage('disk', {
      path: '/',
      thresholdPercent: 0.8,
    })
  }

  /**
   * Check process heap memory usage
   */
  async checkMemoryHeap() {
    return this.memory.checkHeap('memory-heap', 200 * 1024 * 1024)
  }

  /**
   * Check process memory usage (RSS)
   */
  async checkMemoryRSS() {
    return this.memory.checkRSS('memory-rss', 200 * 1024 * 1024)
  }
}
