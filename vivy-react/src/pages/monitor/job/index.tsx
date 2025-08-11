import { DeleteOutlined, PlusOutlined, HistoryOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Link, useModel, Access, useAccess } from '@umijs/max'
import { Button, Popconfirm } from 'antd'
import { useRef, useState } from 'react'
import { listJob, deleteJob, onceJob } from '@/apis/monitor/job'
import type { JobModel } from '@/apis/monitor/job'
import { Modal } from '@/components/App'
import { CronEval } from '@/components/Cron'
import { DictTag, DictText } from '@/components/Dict'
import UpdateForm from './components/UpdateForm'

const Job = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>()
  const [record, setRecord] = useState<JobModel>()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  /**
   * Register dictionary data
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysJobGroup = loadDict('sys_job_group')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * Delete scheduled task
   * @param jobIds Scheduled task ID
   */
  const handleDelete = async (jobIds: number | string) => {
    await deleteJob(jobIds)
    setSelectedRowKeys([])
    actionRef.current?.reload()
  }

  /**
   * Preview execution plan
   */
  const handleCronPreview = (record: JobModel) => {
    Modal.confirm({
      title: `Execution Plan: ${record.jobName}`,
      icon: null,
      width: 600,
      footer: false,
      closable: true,
      content: (
        <div style={{ height: '400px' }}>
          <CronEval value={record.cronExpression} />
        </div>
      ),
    })
  }

  /**
   * Table column configuration
   */
  const columns: ProColumns<JobModel>[] = [
    {
      title: 'Task ID',
      dataIndex: 'jobId',
      search: false,
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
    },
    {
      title: 'Cron Expression',
      dataIndex: 'cronExpression',
      search: false,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueType: 'select',
      fieldProps: { options: toSelect(sysNormalDisable) },
      render: (_, record) => {
        return <DictTag options={sysNormalDisable} value={record.status} />
      },
    },
    {
      title: 'Operation',
      valueType: 'option',
      key: 'option',
      width: 300,
      render: (_, record) => [
        <Access key="update" accessible={hasPermission('monitor:job:update')}>
          <Button
            type="link"
            onClick={() => {
              setRecord(record)
              setUpdateOpen(true)
            }}
          >
            Edit
          </Button>
        </Access>,
        <Access key="delete" accessible={hasPermission('monitor:job:delete')}>
          <Popconfirm title="Are you sure to delete?" onConfirm={() => handleDelete(record.jobId)}>
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Access>,
        <Access key="once" accessible={hasPermission('monitor:job:update')}>
          <Popconfirm title="Are you sure to execute?" onConfirm={() => onceJob(record.jobId)}>
            <Button type="link">Execute Once</Button>
          </Popconfirm>
        </Access>,
        <Button key="eval" type="link" onClick={() => handleCronPreview(record)}>
          Execution Plan
        </Button>,
        <Link key="log" to={`/monitor/job/log?jobId=${record.jobId}`}>
          Schedule Log
        </Link>,
      ],
    },
  ]

  return (
    <>
      <ProTable
        rowKey="jobId"
        headerTitle="Scheduled Task List"
        bordered
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        request={async (params) => {
          const { items, meta } = await listJob({
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
            <Access key="add" accessible={hasPermission('monitor:job:add')}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setRecord(undefined)
                  setUpdateOpen(true)
                }}
              >
                Add
              </Button>
            </Access>,
            <Access key="delete" accessible={hasPermission('monitor:job:delete')}>
              <Popconfirm
                title="Are you sure to delete?"
                disabled={!selectedRowKeys.length}
                onConfirm={() => handleDelete(selectedRowKeys.join(','))}
              >
                <Button icon={<DeleteOutlined />} type="primary" danger disabled={!selectedRowKeys.length}>
                  Delete
                </Button>
              </Popconfirm>
            </Access>,
            <Link key="log" to={`/monitor/job/log`}>
              <Button icon={<HistoryOutlined />}>Schedule Log</Button>
            </Link>,
          ],
        }}
      />

      <UpdateForm
        record={record}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        onFinish={async () => actionRef.current?.reload()}
      />
    </>
  )
}

export default Job
