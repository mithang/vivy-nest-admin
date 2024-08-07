import { Module } from '@nestjs/common'

import { FileModule } from '@/modules/file/file.module'
import { DeptModule } from '@/modules/system/dept/dept.module'
import { RoleModule } from '@/modules/system/role/role.module'
import { UserModule } from '@/modules/system/user/user.module'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'

@Module({
  imports: [DeptModule, RoleModule, UserModule, FileModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
