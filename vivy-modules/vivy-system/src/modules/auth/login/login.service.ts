import { randomUUID } from 'crypto'
import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { SysLoginUser, ServiceException, PasswordUtils, BaseIsEnum, UserStatusEnum } from '@vivy-common/core'
import { isEmpty } from 'class-validator'
import Redis from 'ioredis'
import * as svgCaptcha from 'svg-captcha'
import { CAPTCHA_CODE_KEY } from '@/common/constants/cache.constants'
import { ConfigService } from '@/modules/system/config/config.service'
import { MenuService } from '@/modules/system/menu/menu.service'
import { MenuTreeVo } from '@/modules/system/menu/vo/menu.vo'
import { UserService } from '@/modules/system/user/user.service'
import { LoginDto } from './dto/login.dto'
import { CaptchaVo, RouterTreeVo } from './vo/login.vo'

/**
 * Login management
 * @author vivy
 */
@Injectable()
export class LoginService {
  constructor(
    @InjectRedis()
    public redis: Redis,
    private userService: UserService,
    private menuService: MenuService,
    private configService: ConfigService
  ) {}

  /**
   * User login
   * @param form Login account information
   */
  async login(form: LoginDto): Promise<SysLoginUser> {
    const { username, password } = form
    if (isEmpty(username) || isEmpty(password)) {
      throw new ServiceException('Username/password must be filled')
    }

    const user = await this.userService.selectUserByUserName(username)
    if (isEmpty(user)) {
      throw new ServiceException('Login user does not exist')
    }

    if (user.status === UserStatusEnum.DISABLE) {
      throw new ServiceException('Your account has been disabled')
    }

    if (user.status === UserStatusEnum.DELETED) {
      throw new ServiceException('Your account has been deleted')
    }

    const isMatch = await PasswordUtils.compare(password, user.password)
    if (!isMatch) {
      throw new ServiceException('Password input error')
    }

    const loginUser = new SysLoginUser()
    loginUser.sysUser = user
    loginUser.roles = await this.userService.getRolePermission(user.userId)
    loginUser.scopes = await this.userService.getRoleDataScope(user.userId)
    loginUser.permissions = await this.userService.getMenuPermission(user.userId)
    return loginUser
  }

  /**
   * Create captcha
   */
  async createCaptcha(): Promise<CaptchaVo> {
    const { data, text } = svgCaptcha.createMathExpr({
      noise: 3,
      width: 120,
      height: 40,
      color: true,
    })

    const result = {
      img: data,
      uuid: randomUUID(),
    }

    const key = `${CAPTCHA_CODE_KEY}${result.uuid}`
    await this.redis.set(key, text, 'EX', 60 * 5)

    return result
  }

  /**
   * Verify captcha
   * @param form Login account information
   * @returns Verification failure throws error message
   */
  async verifyCaptcha(form: LoginDto): Promise<void> {
    const key = `${CAPTCHA_CODE_KEY}${form.uuid}`
    const code = await this.redis.get(key)
    if (!code) {
      throw new ServiceException('Captcha has expired')
    }
    if (code !== form.code) {
      throw new ServiceException('Captcha input error')
    }
  }

  /**
   * Whether to enable captcha function
   * @returns true enable / false disable
   */
  async isEnableCaptcha() {
    const enableCaptcha = await this.configService.value('sys.account.enableCaptcha')
    if (enableCaptcha && enableCaptcha === 'true') {
      return true
    }
    return false
  }

  /**
   * Query user route information
   * @param userId User ID
   * @returns User route information
   */
  async getUserRouters(userId: number) {
    const menus = await this.menuService.selectUserMenuTree(userId)
    return this.buildUmiMaxRouters(menus)
  }

  /**
   * Build routes required by frontend UmiMax
   * @param Menu list
   * @returns Route list
   */
  private buildUmiMaxRouters(menus: MenuTreeVo[]): RouterTreeVo[] {
    const routers: RouterTreeVo[] = []

    for (const menu of menus) {
      const router = new RouterTreeVo()
      router.name = menu.menuName
      router.path = menu.path
      router.icon = menu.icon
      router.component = menu.component
      router.locale = false
      router.hideInMenu = menu.isVisible === BaseIsEnum.NO
      router.children = menu.children && this.buildUmiMaxRouters(menu.children)
      routers.push(router)
    }

    return routers
  }
}
