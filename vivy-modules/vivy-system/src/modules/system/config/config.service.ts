import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseStatusEnum } from '@vivy-common/core'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { Like, Repository } from 'typeorm'
import { ConfigCacheService } from './config-cache.service'
import { ListConfigDto, CreateConfigDto, UpdateConfigDto } from './dto/config.dto'
import { SysConfig } from './entities/sys-config.entity'

/**
 * Parameter configuration
 * @author vivy
 */
@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(SysConfig)
    private configRepository: Repository<SysConfig>,
    private configCacheService: ConfigCacheService
  ) {}

  /**
   * Parameter configuration list
   * @param config Parameter configuration information
   * @returns Parameter configuration list
   */
  async list(config: ListConfigDto): Promise<Pagination<SysConfig>> {
    return paginate<SysConfig>(
      this.configRepository,
      {
        page: config.page,
        limit: config.limit,
      },
      {
        where: {
          configName: isNotEmpty(config.configName) ? Like(`%${config.configName}%`) : undefined,
          configKey: isNotEmpty(config.configKey) ? Like(`%${config.configKey}%`) : undefined,
          status: config.status,
        },
      }
    )
  }

  /**
   * Add parameter configuration
   * @param config Parameter configuration information
   */
  async add(config: CreateConfigDto): Promise<void> {
    await this.configRepository.insert(config)
    if (config.status === BaseStatusEnum.NORMAL) {
      await this.configCacheService.set(config.configKey)
    }
  }

  /**
   * Update parameter configuration
   * @param configId Parameter configuration ID
   * @param config Parameter configuration information
   */
  async update(configId: number, config: UpdateConfigDto): Promise<void> {
    const oldConfig = await this.configRepository.findOneBy({ configId })
    await this.configCacheService.del(oldConfig.configKey)

    await this.configRepository.update(configId, config)
    if (config.status === BaseStatusEnum.NORMAL) {
      await this.configCacheService.set(config.configKey)
    }
  }

  /**
   * Delete parameter configuration
   * @param configIds Parameter configuration ID
   */
  async delete(configIds: number[]): Promise<void> {
    for (const configId of configIds) {
      const { configKey } = await this.configRepository.findOneBy({ configId })
      await this.configRepository.delete(configId)
      await this.configCacheService.del(configKey)
    }
  }

  /**
   * Parameter configuration details
   * @param configId Parameter configuration ID
   * @returns Parameter configuration details
   */
  async info(configId: number): Promise<SysConfig> {
    return this.configRepository.findOneBy({ configId })
  }

  /**
   * Get parameter configuration value
   * @param configKey Parameter configuration key
   * @returns Parameter configuration value
   */
  async value(configKey: string): Promise<string> {
    const config = await this.configCacheService.get(configKey)
    return config?.configValue
  }

  /**
   * Check if parameter key is unique
   * @param configKey Parameter configuration key
   * @param configId Parameter configuration ID
   * @returns true unique / false not unique
   */
  async checkConfigKeyUnique(configKey: string, configId?: number): Promise<boolean> {
    const info = await this.configRepository.findOneBy({ configKey })
    if (info && info.configId !== configId) {
      return false
    }

    return true
  }
}
