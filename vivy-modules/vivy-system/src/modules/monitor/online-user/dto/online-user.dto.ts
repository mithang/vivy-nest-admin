import { Allow } from 'class-validator'

/**
 * Query online users
 */
export class ListOnlineUserDto {
  /** IP address */
  @Allow()
  loginIp?: string

  /** User name */
  @Allow()
  userName?: string
}
