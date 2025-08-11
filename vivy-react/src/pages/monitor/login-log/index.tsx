import { DeleteOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useModel, Access, useAccess } from '@umijs/max'
import { Button, Popconfirm } from 'antd'
import { useRef } from 'react'
import { listLoginLog, clearLoginLog } from '@/apis/monitor/login-log'
import type { LoginLogModel } from '@/apis/monitor/login-log'
import { DictTag } from '@/components/Dict'

const LoginLog = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>()

  /**
   * Register dictionary data
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysSuccessFailure = loadDict('sys_success_failure')

  /**
   * Clear login log
   */
  const handleClearLog = async () => {
    await clearLoginLog()
    actionRef.current?.reload()
  }

  /**
   * Table column configuration
   */
  const columns: ProColumns<LoginLogModel>[] = [
    {
      title: 'Log ID',
      dataIndex: 'loginId',
      search: false,
    },
    {
      title: 'Username',
      dataIndex: 'loginName',
    },
    {
      title: 'Login IP',
      dataIndex: 'loginIp',
      search: false,
    },
    {
      title: 'Login Location',
      dataIndex: 'loginLocation',
      search: false,
    },
    {
      title: 'Browser',
      dataIndex: 'browser',
      search: false,
    },
    {
      title: 'Operating System',
      dataIndex: 'os',
      search: false,
    },
    {
      title: 'Login Status',
      dataIndex: 'loginStatus',
      valueType: 'select',
      fieldProps: { options: toSelect(sysSuccessFailure) },
      render: (_, record) => {
        return <DictTag options={sysSuccessFailure} value={record.loginStatus} />
      },
    },
    {
      title: 'Login Date',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      render: (_, record) => {
        return record.createTime
      },
    },
  ]

  return (
    <ProTable
      rowKey="loginId"
      headerTitle="Login Log"
      bordered
      columns={columns}
      actionRef={actionRef}
      request={async (params) => {
        const { items, meta } = await listLoginLog({
          ...params,
          page: params.current,
          limit: params.pageSize,
        })
        return {
          data: items,
          total: meta.totalItems,
        }
      }}
      toolbar={{
        actions: [
          <Access key="clean" accessible={hasPermission('monitor:loginLog:delete')}>
            <Popconfirm title="Are you sure to clear?" onConfirm={handleClearLog}>
              <Button icon={<DeleteOutlined />} type="primary" danger>
                Clear
              </Button>
            </Popconfirm>
          </Access>,
        ],
      }}
    />
  )
}

export default LoginLog
