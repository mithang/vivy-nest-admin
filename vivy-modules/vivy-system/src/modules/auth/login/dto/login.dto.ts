import { ApiProperty } from '@nestjs/swagger'
import { Allow } from 'class-validator'

export class LoginDto {
  /**
   * Captcha code
   */
  @Allow()
  code?: string

  /**
   * Captcha uuid
   */
  @Allow()
  uuid?: string

  /**
   * Username
   */
  @Allow()
  @ApiProperty({
    default: 'admin',
  })
  username: string

  /**
   * User password
   */
  @Allow()
  @ApiProperty({
    default: 'Aa@123456',
  })
  password: string
}
