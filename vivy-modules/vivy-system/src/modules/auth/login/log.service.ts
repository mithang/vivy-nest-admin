import { Injectable } from '@nestjs/common'
import { BaseStatusEnum, IpUtils, RequestContext } from '@vivy-common/core'
import { LoginType } from '@/common/enums/login-type.enum'
import { CreateLoginLogDto } from '@/modules/monitor/login-log/dto/login-log.dto'
import { LoginLogService } from '@/modules/monitor/login-log/login-log.service'

@Injectable()
export class LogService {
  constructor(
    private requestContext: RequestContext,
    private loginLogService: LoginLogService
  ) {}

  /**
   * Login success
   * @param type Login type
   * @param name User name
   * @param message Login message
   */
  ok(type: LoginType, name: string, message: string) {
    this.saveLoginLog(type, name, BaseStatusEnum.NORMAL, message)
  }

  /**
   * Login failure
   * @param type Login type
   * @param name User name
   * @param message Login message
   */
  fail(type: LoginType, name: string, message: string) {
    this.saveLoginLog(type, name, BaseStatusEnum.DISABLE, message)
  }

  /**
   * Save login log
   * @param type Login type
   * @param name User name
   * @param status Login status
   * @param message Login message
   */
  private saveLoginLog(type: LoginType, name: string, status: BaseStatusEnum, message: string) {
    const loginLog = new CreateLoginLogDto()
    loginLog.loginName = name
    loginLog.loginType = type
    loginLog.loginStatus = status
    loginLog.loginMessage = message

    const request = this.requestContext.getRequest()
    const region = IpUtils.ip2Region(IpUtils.requestIp(request))
    loginLog.loginIp = IpUtils.requestIp(request)
    loginLog.loginLocation = `${region.country} ${region.province} ${region.city}`
    loginLog.userAgent = request.headers['user-agent']

    this.loginLogService.add(loginLog).catch(() => {
      // Do not handle errors
    })
  }
}
