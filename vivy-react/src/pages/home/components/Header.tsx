import { useModel } from '@umijs/max'
import { Avatar, Card, Typography } from 'antd'

export default () => {
  const { initialState } = useModel('@@initialState')
  const userInfo = initialState?.userInfo

  return (
    <Card className="w-full">
      <div className="flex">
        <Avatar src={userInfo?.avatar} size={72} />
        <div className="flex flex-col justify-center ml-6">
          <h1 className="text-lg">Good morning, {userInfo?.nickName}, start your day's work!</h1>
          <Typography.Text type="secondary"> Sunny today, 20℃ - 32℃! </Typography.Text>
        </div>
        <div className="flex justify-end flex-1">
          <div className="flex flex-col justify-center text-right">
            <Typography.Text type="secondary"> To-do </Typography.Text>
            <span className="text-2xl">3</span>
          </div>
          <div className="flex flex-col justify-center mx-16 text-right">
            <Typography.Text type="secondary"> Projects </Typography.Text>
            <span className="text-2xl">6</span>
          </div>
          <div className="flex flex-col justify-center mr-10 text-right">
            <Typography.Text type="secondary"> Team </Typography.Text>
            <span className="text-2xl">9</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
