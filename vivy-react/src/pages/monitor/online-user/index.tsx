import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useAccess } from '@umijs/max'
import { Button, Popconfirm } from 'antd'
import { useRef } from 'react'
import { listOnlineUser, logoutOnlineUser } from '@/apis/monitor/online-user'
import type { OnlineUserResult } from '@/apis/monitor/online-user'

const OnlineUser = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>()

  /**
   * Force logout user
   */
  const handleLogout = async (key: string) => {
    await logoutOnlineUser(key)
    actionRef.current?.reload()
  }

  /**
   * Table column configuration
   */
  const columns: ProColumns<OnlineUserResult>[] = [
    {
      title: 'Session ID',
      dataIndex: 'userSk',
      search: false,
      width: 400,
    },
    {
      title: 'Username',
      dataIndex: 'userName',
    },
    {
      title: 'Nickname',
      dataIndex: 'nickName',
      search: false,
    },
    {
      title: 'Login IP',
      dataIndex: 'loginIp',
    },
    {
      title: 'Login Time',
      dataIndex: 'loginTime',
      search: false,
    },
    {
      title: 'Operation',
      valueType: 'option',
      key: 'option',
      hideInTable: !hasPermission('monitor:onlineUser:logout'),
      render: (_, record) => [
        <Popconfirm key="logout" title="Are you sure to force logout?" onConfirm={() => handleLogout(record.userSk)}>
          <Button type="link" danger>
            Force Logout
          </Button>
        </Popconfirm>,
      ],
    },
  ]

  return (
    <ProTable
      rowKey="userSk"
      headerTitle="Online Users"
      bordered
      columns={columns}
      actionRef={actionRef}
      request={async (params: any) => {
        const data = await listOnlineUser(params)
        return {
          data,
          total: data.length,
        }
      }}
    />
  )
}

export default OnlineUser
