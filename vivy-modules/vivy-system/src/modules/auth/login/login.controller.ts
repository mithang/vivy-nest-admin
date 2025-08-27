import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, UserId } from '@vivy-common/core'
import { Public, TokenService } from '@vivy-common/security'
import { LoginType } from '@/common/enums/login-type.enum'
import { LoginDto } from './dto/login.dto'
import { LogService } from './log.service'
import { LoginService } from './login.service'

/**
 * Login management
 * @author vivy
 */
@ApiTags('Login management')
@ApiBearerAuth()
@Controller('auth')
export class LoginController {
  constructor(
    private logService: LogService,
    private loginService: LoginService,
    private tokenService: TokenService
  ) {}

  /**
   * User login
   * @param form Login account information
   */
  @Post('login')
  @Public()
  async login(@Body() form: LoginDto): Promise<AjaxResult> {
    try {
      const isEnableCaptcha = await this.loginService.isEnableCaptcha()
      isEnableCaptcha && (await this.loginService.verifyCaptcha(form))

      const user = await this.loginService.login(form)
      const token = await this.tokenService.createToken(user)

      this.logService.ok(LoginType.ACCOUNT_PASSWORD, form.username, 'Login successful')
      return AjaxResult.success(token, 'Login successful')
    } catch (error) {
      this.logService.fail(LoginType.ACCOUNT_PASSWORD, form.username, error?.message)
      throw error
    }
  }

  /**
   * User logout
   */
  @Post('logout')
  async logout(): Promise<AjaxResult> {
    const token = this.tokenService.getToken()
    if (token) {
      await this.tokenService.delLoginUser(token)
    }
    return AjaxResult.success(null, 'Logout successful')
  }

  /**
   * Refresh Token
   */
  @Post('refresh')
  async refresh(): Promise<AjaxResult> {
    const token = this.tokenService.getToken()
    if (token) {
      const loginUser = await this.tokenService.getLoginUser(token)
      if (loginUser) {
        await this.tokenService.refreshToken(loginUser)
      }
    }
    return AjaxResult.success(null, 'Refresh successful')
  }

  /**
   * Get verification code
   */
  @Get('captcha')
  @Public()
  async captcha(): Promise<AjaxResult> {
    const isEnableCaptcha = await this.loginService.isEnableCaptcha()
    if (isEnableCaptcha) {
      return AjaxResult.success(await this.loginService.createCaptcha())
    }
    return AjaxResult.success()
  }

  /**
   * Query user cache information
   */
  @Get('user/info')
  async getUserInfo(): Promise<AjaxResult> {
    const token = this.tokenService.getToken()
    const loginUser = await this.tokenService.getLoginUser(token)
    return AjaxResult.success(loginUser)
  }

  /**
   * Query user route information
   * @returns User route information
   */
  @Get('user/routers')
  async getUserRouters(@UserId() userId: number): Promise<AjaxResult> {
    const routers = await this.loginService.getUserRouters(userId)
    return AjaxResult.success(routers)
  }
}
