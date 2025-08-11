import { ProForm, ProFormText, ProFormRadio } from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import { updateProfile } from '@/apis/system/profile'
import type { ProfileInfoResult, UpdateProfileParams } from '@/apis/system/profile'
import { Message } from '@/components/App'

const UpdateInfo: React.FC<{ profile: ProfileInfoResult }> = ({ profile }) => {
  const { loadDict, toSelect } = useModel('dict')
  const sysUserSex = loadDict('sys_user_sex')

  /**
   * Submit form
   * @param values Form values
   */
  const handleSubmit = async (values: UpdateProfileParams) => {
    await updateProfile(values)
    Message.success('Updated successfully')
  }

  return (
    <ProForm
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      submitter={{ resetButtonProps: { style: { marginLeft: '100px' } } }}
      initialValues={profile}
      onFinish={handleSubmit}
    >
      <ProFormText
        label="Nickname"
        name="nickName"
        placeholder="Please enter nickname"
        rules={[{ required: true, max: 50 }]}
      />
      <ProFormText
        label="Phone Number"
        name="phonenumber"
        placeholder="Please enter phone number"
        rules={[{ required: true, max: 11 }]}
      />
      <ProFormText label="Email" name="email" placeholder="Please enter email" rules={[{ required: true, max: 50 }]} />
      <ProFormRadio.Group label="Gender" name="sex" options={toSelect(sysUserSex)} />
    </ProForm>
  )
}

export default UpdateInfo
