import { ProForm, ProFormDependency, ProFormInstance, ProFormText } from '@ant-design/pro-components'
import { useRef } from 'react'
import { updatePassword } from '@/apis/system/profile'
import type { UpdatePasswordParams } from '@/apis/system/profile'
import { Message } from '@/components/App'

const UpdatePassword: React.FC = () => {
  const formRef = useRef<ProFormInstance>()

  /**
   * Submit form
   * @param values Form values
   */
  const handleSubmit = async (values: UpdatePasswordParams) => {
    await updatePassword(values)
    formRef.current?.resetFields()
    Message.success('Updated successfully')
  }

  return (
    <ProForm
      formRef={formRef}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      submitter={{ resetButtonProps: { style: { marginLeft: '100px' } } }}
      onFinish={handleSubmit}
    >
      <ProFormText.Password
        label="Old Password"
        name="oldPassword"
        placeholder="Please enter old password"
        rules={[{ required: true, max: 36 }]}
      />
      <ProFormText.Password
        label="New Password"
        name="newPassword"
        placeholder="Please enter new password"
        rules={[{ required: true, max: 36 }]}
      />
      <ProFormDependency name={['newPassword']}>
        {({ newPassword }) => (
          <ProFormText.Password
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Please confirm new password"
            rules={[
              { required: true, max: 36 },
              {
                validator(_, value) {
                  if (value === newPassword) {
                    return Promise.resolve()
                  } else {
                    return Promise.reject(new Error('Password confirmation does not match'))
                  }
                },
              },
            ]}
          />
        )}
      </ProFormDependency>
    </ProForm>
  )
}

export default UpdatePassword
