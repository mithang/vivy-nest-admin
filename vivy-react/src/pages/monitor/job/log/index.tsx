import { DeleteOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useModel, useSearchParams } from '@umijs/max'
import { Button, Popconfirm } from 'antd'
import { useRef } from 'react'
import { listJobLog, clearJobLog } from '@/apis/monitor/job'
import type { JobLogModel } from '@/apis/monitor/job'
import { DictTag, DictText } from '@/components/Dict'

const JobLog = () => {
  const [searchParams] = useSearchParams()
  const actionRef = useRef<ActionType>()

  /**
   * Register dictionary data
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysJobGroup = loadDict('sys_job_group')
  const sysSuccessFailure = loadDict('sys_success_failure')

  /**
   * Table column configuration
   */
  const columns: ProColumns<JobLogModel>[] = [
    {
      title: 'Log ID',
      dataIndex: 'jobLogId',
      search: false,
    },
    {
      title: 'Task ID',
      dataIndex: 'jobId',
      hideInTable: true,
      initialValue: searchParams.get('jobId'),
    },
    {
      title: 'Task Name',
      dataIndex: 'jobName',
    },
    {
      title: 'Task Group',
      dataIndex: 'jobGroup',
      valueType: 'select',
      fieldProps: { options: toSelect(sysJobGroup) },
      render: (_, record) => {
        return <DictText options={sysJobGroup} value={record.jobGroup} />
      },
    },
    {
      title: 'Invoke Target',
      dataIndex: 'invokeTarget',
      search: false,
    },
    {
      title: 'Invoke Parameters',
      dataIndex: 'invokeParams',
      search: false,
    },
    {
      title: 'Execution Status',
      dataIndex: 'status',
      valueType: 'select',
      fieldProps: { options: toSelect(sysSuccessFailure) },
      render: (_, record) => {
        return <DictTag options={sysSuccessFailure} value={record.status} />
      },
    },
    {
      title: 'Execution Time',
      dataIndex: 'createTime',
      search: false,
    },
  ]

  return (
    <>
      <ProTable
        rowKey="jobLogId"
        headerTitle="Task Log List"
        bordered
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const { items, meta } = await listJobLog({
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
            <Popconfirm key="clear" title="Are you sure to clear?" onConfirm={() => clearJobLog()}>
              <Button icon={<DeleteOutlined />} type="primary" danger>
                Clear
              </Button>
            </Popconfirm>,
          ],
        }}
      />
    </>
  )
}

export default JobLog
