import { IsEmail, IsIn, IsMobilePhone, IsNotEmpty, MaxLength } from 'class-validator'

/**
 * Update personal information
 */
export class UpdateProfileDto {
  /** User nickname */
  @MaxLength(50)
  @IsNotEmpty()
  nickName: string

  /** User email */
  @IsEmail()
  @MaxLength(50)
  @IsNotEmpty()
  email: string

  /** Phone number */
  @IsMobilePhone('zh-CN')
  @MaxLength(11)
  @IsNotEmpty()
  phonenumber: string

  /** User gender */
  @IsIn(['1', '2', '3'])
  @IsNotEmpty()
  sex: string
}

/**
 * Update personal password
 */
export class UpdatePasswordDto {
  /** Old password */
  @MaxLength(36)
  oldPassword: string

  /** New password */
  @MaxLength(36)
  newPassword: string
}

/**
 * Update personal avatar
 */
export class UpdateAvatarDto {
  /** User avatar */
  @MaxLength(255)
  avatar: string
}
