import { KeyOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components'
import { useModel, useRequest } from '@umijs/max'
import { Space } from 'antd'
import { flushSync } from 'react-dom'
import { login, captcha } from '@/apis/auth/login'
import type { LoginParams } from '@/apis/auth/login'
import { Message } from '@/components/App'
import { PageEnum } from '@/enums/pageEnum'
import { Footer } from '@/layouts/default'
import { setToken } from '@/utils/auth'

const Login = () => {
  const { initialState, setInitialState } = useModel('@@initialState')
  const { data: captchaImage, run: runCaptchaImage } = useRequest(captcha)

  const fetchUserInfo = async (): Promise<void> => {
    const userInfo = await initialState?.fetchUserInfo?.()
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          ...userInfo,
        }))
      })
    }
  }

  const handleLogin = async (values: LoginParams) => {
    try {
      const token = await login({
        ...values,
        uuid: captchaImage?.uuid,
      })
      setToken(token.access_token)
      await fetchUserInfo()
      Message.loading('Logging in...')
      window.location.href = PageEnum.BASE_HOME
    } catch (error: any) {
      Message.error(error.message || 'Login failed, please try again!')
    }
  }

  return (
    <div className="flex flex-col justify-center h-[100vh]">
      <div>
        <LoginForm title="Vivy" subTitle="Permission Management System Based on Nest & React" onFinish={handleLogin}>
          <ProFormText
            name="username"
            initialValue={'admin'}
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={'prefixIcon'} />,
            }}
            placeholder={'Username'}
            rules={[
              {
                required: true,
                message: 'Please enter username!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            initialValue={'Aa@123456'}
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
            }}
            placeholder={'Password'}
            rules={[
              {
                required: true,
                message: 'Please enter password!',
              },
            ]}
          />
          {captchaImage ? (
            <Space>
              <ProFormText
                name="code"
                fieldProps={{
                  size: 'large',
                  prefix: <KeyOutlined className={'prefixIcon'} />,
                  autoFocus: true,
                }}
                placeholder={'Verification Code'}
                rules={[
                  {
                    required: true,
                    message: 'Please enter verification code!',
                  },
                ]}
              />
              <div
                className="flex cursor-pointer mb-[24px]"
                dangerouslySetInnerHTML={{ __html: captchaImage.img }}
                onClick={runCaptchaImage}
              />
            </Space>
          ) : null}
          <div className="mb-5">
            <ProFormCheckbox noStyle name="autoLogin">
              Auto Login
            </ProFormCheckbox>
            <a className="float-right">Forgot Password</a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  )
}

export default Login
