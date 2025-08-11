import { DeleteOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useModel, Access, useAccess, useRequest } from '@umijs/max'
import { Button, Popconfirm } from 'antd'
import { useRef, useState } from 'react'
import { listDictType, deleteDictType, refreshDictCache } from '@/apis/system/dict'
import type { DictTypeModel } from '@/apis/system/dict'
import { Message } from '@/components/App'
import { DictTag } from '@/components/Dict'
import UpdateForm from './components/UpdateForm'

const DictType = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>()
  const [record, setRecord] = useState<DictTypeModel>()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 删除字典类型
   * @param dictIds 字典类型ID
   */
  const handleDelete = async (dictIds: number | string) => {
    await deleteDictType(dictIds)
    setSelectedRowKeys([])
    actionRef.current?.reload()
  }

  /**
   * 刷新字典缓存
   */
  const { run: runRefreshDictCache, loading: refreshDictCacheLoading } = useRequest(refreshDictCache, {
    manual: true,
    onSuccess() {
      Message.success('刷新成功')
    },
  })

  /**
   * 表格列配置
   */
  const columns: ProColumns<DictTypeModel>[] = [
    {
      title: 'Dictionary ID',
      dataIndex: 'dictId',
      search: false,
    },
    {
      title: 'Dictionary Name',
      dataIndex: 'dictName',
    },
    {
      title: 'Dictionary Type',
      dataIndex: 'dictType',
    },
    {
      title: 'Display Order',
      dataIndex: 'dictSort',
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
      title: 'Creation Time',
      dataIndex: 'createTime',
      search: false,
    },
    {
      title: 'Actions',
      valueType: 'option',
      key: 'option',
      render: (_, record) => [
        <Access key="update" accessible={hasPermission('system:dict:update')}>
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
        <Access key="delete" accessible={hasPermission('system:dict:delete')}>
          <Popconfirm title="Are you sure you want to delete?" onConfirm={() => handleDelete(record.dictId)}>
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
        rowKey="dictId"
        headerTitle="Dictionary List"
        bordered
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        request={async (params) => {
          const { items, meta } = await listDictType({
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
            <Access key="add" accessible={hasPermission('system:dict:add')}>
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
            <Access key="delete" accessible={hasPermission('system:dict:delete')}>
              <Popconfirm
                title="Are you sure you want to delete?"
                disabled={!selectedRowKeys.length}
                onConfirm={() => handleDelete(selectedRowKeys.join(','))}
              >
                <Button icon={<DeleteOutlined />} type="primary" danger disabled={!selectedRowKeys.length}>
                  Delete
                </Button>
              </Popconfirm>
            </Access>,
            <Access key="cache" accessible={hasPermission('system:config:delete')}>
              <Button
                icon={<RedoOutlined spin={refreshDictCacheLoading} />}
                type="primary"
                danger
                onClick={runRefreshDictCache}
              >
                Refresh Cache
              </Button>
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

export default DictType
