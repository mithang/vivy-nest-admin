import { DeleteOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useModel, Access, useAccess } from '@umijs/max'
import { Button, Popconfirm, Drawer, Descriptions } from 'antd'
import { useRef, useState } from 'react'
import { listOperLog, clearOperLog } from '@/apis/monitor/oper-log'
import type { OperLogModel } from '@/apis/monitor/oper-log'
import { DictTag, DictText } from '@/components/Dict'

const OperationLog = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>()
  const [record, setRecord] = useState<OperLogModel>()
  const [openDrawer, setOpenDrawer] = useState(false)

  /**
   * Register dictionary data
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysOperType = loadDict('sys_oper_type')
  const sysSuccessFailure = loadDict('sys_success_failure')

  /**
   * Clear operation log
   */
  const handleClearLog = async () => {
    await clearOperLog()
    actionRef.current?.reload()
  }

  /**
   * Table column configuration
   */
  const columns: ProColumns<OperLogModel>[] = [
    {
      title: 'Log ID',
      dataIndex: 'operId',
      search: false,
    },
    {
      title: 'System Module',
      dataIndex: 'title',
    },
    {
      title: 'Operation Type',
      dataIndex: 'operType',
      valueType: 'select',
      fieldProps: { options: toSelect(sysOperType) },
      render: (_, record) => {
        return <DictTag options={sysOperType} value={record.operType} />
      },
    },
    {
      title: 'Operator',
      dataIndex: 'operName',
    },
    {
      title: 'Request Method',
      dataIndex: 'requestMethod',
      search: false,
    },
    {
      title: 'Request URL',
      dataIndex: 'requestUrl',
      hideInTable: true,
    },
    {
      title: 'Operation Status',
      dataIndex: 'operStatus',
      valueType: 'select',
      fieldProps: { options: toSelect(sysSuccessFailure) },
      render: (_, record) => {
        return <DictTag options={sysSuccessFailure} value={record.operStatus} />
      },
    },
    {
      title: 'Operation Date',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      render: (_, record) => {
        return record.createTime
      },
    },
    {
      title: 'Operation',
      valueType: 'option',
      key: 'option',
      render: (_, record) => [
        <Button
          key="detail"
          type="link"
          onClick={() => {
            setRecord(record)
            setOpenDrawer(true)
          }}
        >
          Details
        </Button>,
      ],
    },
  ]

  return (
    <>
      <ProTable
        rowKey="operId"
        headerTitle="Operation Log"
        bordered
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const { items, meta } = await listOperLog({
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
      <Drawer title="Operation Log Details" width={1000} open={openDrawer} onClose={() => setOpenDrawer(false)}>
        {record ? (
          <Descriptions column={2}>
            <Descriptions.Item label="Operation Module">
              {record.title} / <DictText options={sysOperType} value={record.operType} />
            </Descriptions.Item>
            <Descriptions.Item label="Login Information">
              {record.operName} / {record.operIp} / {record.operLocation}
            </Descriptions.Item>
            <Descriptions.Item label="Request Method">{record.requestMethod}</Descriptions.Item>
            <Descriptions.Item label="Request URL">{record.requestUrl}</Descriptions.Item>
            <Descriptions.Item label="Operation Method" span={2}>
              {record.operMethod}
            </Descriptions.Item>
            <Descriptions.Item label="Request Parameters" span={2}>
              {record.requestParam}
            </Descriptions.Item>
            <Descriptions.Item label="Return Parameters" span={2}>
              {record.requestResult}
            </Descriptions.Item>
            <Descriptions.Item label="Error Message" span={2}>
              {record.requestErrmsg}
            </Descriptions.Item>
            <Descriptions.Item label="Operation Status" span={2}>
              <DictText options={sysSuccessFailure} value={record.operStatus} />
            </Descriptions.Item>
            <Descriptions.Item label="Operation Time">{record.createTime}</Descriptions.Item>
          </Descriptions>
        ) : null}
      </Drawer>
    </>
  )
}

export default OperationLog
