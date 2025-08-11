import { List } from 'antd'
import type { ProfileInfoResult } from '@/apis/system/profile/model'
import UpdateAvatar from './UpdateAvatar'

const UserInfo: React.FC<{ profile: ProfileInfoResult }> = ({ profile }) => {
  return (
    <List>
      <List.Item className="!justify-center">
        <UpdateAvatar profile={profile} />
      </List.Item>
      <List.Item>
        <span>Username</span>
        <span>{profile.userName}</span>
      </List.Item>
      <List.Item>
        <span>Phone Number</span>
        <span>{profile.phonenumber}</span>
      </List.Item>
      <List.Item>
        <span>User Email</span>
        <span>{profile.email}</span>
      </List.Item>
      <List.Item>
        <span>Department</span>
        <span>{profile.dept?.deptName}</span>
      </List.Item>
      <List.Item>
        <span>Roles</span>
        <span>{profile.roles?.map((role) => role.roleName).join(',')}</span>
      </List.Item>
      <List.Item>
        <span>Positions</span>
        <span>{profile.posts?.map((post) => post.postName).join(',')}</span>
      </List.Item>
    </List>
  )
}

export default UserInfo
