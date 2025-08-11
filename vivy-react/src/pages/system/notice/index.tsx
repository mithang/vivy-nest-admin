import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useModel, Access, useAccess } from '@umijs/max'
import { Button, Popconfirm } from 'antd'
import { useRef, useState } from 'react'
import { listNotice, deleteNotice } from '@/apis/system/notice'
import type { NoticeModel } from '@/apis/system/notice'
import { DictTag } from '@/components/Dict'
import UpdateForm from './components/UpdateForm'

const Notice = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>()
  const [record, setRecord] = useState<NoticeModel>()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  /**
   * Register dictionary data
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysNoticeType = loadDict('sys_notice_type')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * Delete notice announcement
   * @param noticeIds Notice announcement ID
   */
  const handleDelete = async (noticeIds: number | string) => {
    await deleteNotice(noticeIds)
    setSelectedRowKeys([])
    actionRef.current?.reload()
  }

  /**
   * Table column configuration
   */
  const columns: ProColumns<NoticeModel>[] = [
    {
      title: 'Notice ID',
      dataIndex: 'noticeId',
      search: false,
    },
    {
      title: 'Notice Title',
      dataIndex: 'noticeTitle',
    },
    {
      title: 'Notice Type',
      dataIndex: 'noticeType',
      valueType: 'select',
      fieldProps: { options: toSelect(sysNoticeType) },
      render: (_, record) => {
        return <DictTag options={sysNoticeType} value={record.noticeType} />
      },
    },
    {
      title: 'Notice Content',
      dataIndex: 'noticeContent',
      search: false,
    },
    {
      title: 'Notice Status',
      dataIndex: 'status',
      search: false,
      valueType: 'select',
      fieldProps: { options: toSelect(sysNormalDisable) },
      render: (_, record) => {
        return <DictTag options={sysNormalDisable} value={record.status} />
      },
    },
    {
      title: 'Actions',
      valueType: 'option',
      key: 'option',
      render: (_, record) => [
        <Access key="update" accessible={hasPermission('system:notice:update')}>
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
        <Access key="delete" accessible={hasPermission('system:notice:delete')}>
          <Popconfirm title="Are you sure to delete?" onConfirm={() => handleDelete(record.noticeId)}>
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Access>,
      ],
    },
  ]

  return (
    <>
      <ProTable
        rowKey="noticeId"
        headerTitle="Notice Announcement List"
        bordered
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        request={async (params) => {
          const { items, meta } = await listNotice({
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
            <Access key="add" accessible={hasPermission('system:notice:add')}>
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
            <Access key="delete" accessible={hasPermission('system:notice:delete')}>
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

export default Notice
