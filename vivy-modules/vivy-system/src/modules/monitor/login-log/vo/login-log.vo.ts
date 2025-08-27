import { SysLoginLog } from '../entities/sys-login-log.entity'

/**
 * Query login logs
 */
export class LoginLogListVo extends SysLoginLog {
  /** Operating system */
  os: string

  /** Browser information */
  browser: string
}
