import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isArray, isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { Between, Like, Repository } from 'typeorm'
import { UAParser } from 'ua-parser-js'
import { ListLoginLogDto, CreateLoginLogDto } from './dto/login-log.dto'
import { SysLoginLog } from './entities/sys-login-log.entity'
import { LoginLogListVo } from './vo/login-log.vo'

/**
 * Login logs
 * @author vivy
 */
@Injectable()
export class LoginLogService {
  constructor(
    @InjectRepository(SysLoginLog)
    private loginLogRepository: Repository<SysLoginLog>
  ) {}

  /**
   * Query login log list
   * @param loginLog Login log information
   * @returns Login log list
   */
  async list(loginLog: ListLoginLogDto): Promise<Pagination<LoginLogListVo>> {
    const list = await paginate<SysLoginLog>(
      this.loginLogRepository,
      {
        page: loginLog.page,
        limit: loginLog.limit,
      },
      {
        order: {
          createTime: 'DESC',
        },
        where: {
          loginName: isNotEmpty(loginLog.loginName) ? Like(`%${loginLog.loginName}%`) : undefined,
          loginStatus: loginLog.loginStatus,
          createTime: isArray(loginLog.createTime)
            ? Between(loginLog.createTime[0], loginLog.createTime[1])
            : undefined,
        },
      }
    )

    return {
      meta: list.meta,
      items: list.items.map((item) => {
        const parser = new UAParser(item.userAgent)
        return {
          ...item,
          os: `${parser.getOS().name}/${parser.getOS().version}`,
          browser: `${parser.getBrowser().name}/${parser.getBrowser().version}`,
        }
      }),
    }
  }

  /**
   * Add login log
   * @param loginLog Login log information
   */
  async add(loginLog: CreateLoginLogDto): Promise<void> {
    await this.loginLogRepository.insert(loginLog)
  }

  /**
   * Clear login logs
   */
  async clear(): Promise<void> {
    await this.loginLogRepository.clear()
  }
}
