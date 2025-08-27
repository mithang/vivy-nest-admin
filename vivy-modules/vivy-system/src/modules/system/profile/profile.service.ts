import { Injectable } from '@nestjs/common'
import { PasswordUtils, ServiceException } from '@vivy-common/core'
import { TokenService } from '@vivy-common/security'
import { DeptService } from '@/modules/system/dept/dept.service'
import { PostService } from '@/modules/system/post/post.service'
import { RoleService } from '@/modules/system/role/role.service'
import { UserService } from '@/modules/system/user/user.service'
import { UpdateAvatarDto, UpdatePasswordDto, UpdateProfileDto } from './dto/profile.dto'
import { ProfileInfoVo } from './vo/profile.vo'

/**
 * Personal information
 * @author vivy
 */
@Injectable()
export class ProfileService {
  constructor(
    private deptService: DeptService,
    private roleService: RoleService,
    private postService: PostService,
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  /**
   * Personal information
   */
  async info(): Promise<ProfileInfoVo> {
    const token = this.tokenService.getToken()
    const loginUser = await this.tokenService.getLoginUser(token)
    const userInfo: ProfileInfoVo = loginUser.sysUser
    userInfo.dept = userInfo.deptId && (await this.deptService.info(userInfo.deptId))
    userInfo.roles = await this.roleService.selectRoleByUserId(userInfo.userId)
    userInfo.posts = await this.postService.selectPostByUserId(userInfo.userId)
    return userInfo
  }

  /**
   * Update personal information
   * @param profile Personal information
   */
  async update(profile: UpdateProfileDto): Promise<void> {
    const token = this.tokenService.getToken()
    const loginUser = await this.tokenService.getLoginUser(token)

    if (!(await this.userService.checkUserEmailUnique(profile.email, loginUser.userId))) {
      throw new ServiceException(`Update user ${loginUser.userName} failed, email already exists`)
    }

    if (!(await this.userService.checkUserPhoneUnique(profile.phonenumber, loginUser.userId))) {
      throw new ServiceException(`Update user ${loginUser.userName} failed, phone number already exists`)
    }

    await this.userService.updateBasicInfo(loginUser.userId, profile)

    // Update cached user information
    Object.assign(loginUser.sysUser, profile)
    await this.tokenService.setLoginUser(loginUser)
  }

  /**
   * Update personal password
   * @param password Password information
   */
  async password(password: UpdatePasswordDto): Promise<void> {
    const token = this.tokenService.getToken()
    const loginUser = await this.tokenService.getLoginUser(token)
    const curPassword = loginUser.sysUser.password
    const { oldPassword, newPassword } = password

    if (!(await PasswordUtils.compare(oldPassword, curPassword))) {
      throw new ServiceException(`Update password failed, old password is incorrect`)
    }

    if (await PasswordUtils.compare(newPassword, curPassword)) {
      throw new ServiceException(`New password cannot be the same as old password`)
    }

    const hashPassword = await PasswordUtils.create(newPassword)
    await this.userService.updateBasicInfo(loginUser.userId, {
      password: hashPassword,
    })

    // Update cached user information
    Object.assign(loginUser.sysUser, { password: hashPassword })
    await this.tokenService.setLoginUser(loginUser)
  }

  /**
   * Update personal avatar
   * @param avatar Avatar address
   */
  async avatar(avatar: UpdateAvatarDto): Promise<void> {
    const token = this.tokenService.getToken()
    const loginUser = await this.tokenService.getLoginUser(token)

    await this.userService.updateBasicInfo(loginUser.userId, avatar)

    // Update cached user information
    Object.assign(loginUser.sysUser, avatar)
    await this.tokenService.setLoginUser(loginUser)
  }
}
