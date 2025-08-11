import { DeleteOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useModel, Access, useAccess, useRequest } from '@umijs/max'
import { Button, Popconfirm } from 'antd'
import { useRef, useState } from 'react'
import { listConfig, deleteConfig, refreshConfigCache } from '@/apis/system/config'
import type { ConfigModel } from '@/apis/system/config'
import { Message } from '@/components/App'
import { DictTag } from '@/components/Dict'
import UpdateForm from './components/UpdateForm'

const Config = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>()
  const [record, setRecord] = useState<ConfigModel>()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 删除参数配置
   * @param configIds 参数配置ID
   */
  const handleDelete = async (configIds: number | string) => {
    await deleteConfig(configIds)
    setSelectedRowKeys([])
    actionRef.current?.reload()
  }

  /**
   * 刷新参数配置缓存
   */
  const { run: runRefreshConfigCache, loading: refreshConfigCacheLoading } = useRequest(refreshConfigCache, {
    manual: true,
    onSuccess() {
      Message.success('刷新成功')
    },
  })

  /**
   * 表格列配置
   */
  const columns: ProColumns<ConfigModel>[] = [
    {
      title: 'Parameter ID',
      dataIndex: 'configId',
      search: false,
    },
    {
      title: 'Parameter Name',
      dataIndex: 'configName',
    },
    {
      title: 'Parameter Key',
      dataIndex: 'configKey',
    },
    {
      title: 'Parameter Value',
      dataIndex: 'configValue',
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
      title: 'Remarks',
      dataIndex: 'remark',
      search: false,
      ellipsis: true,
    },
    {
      title: 'Actions',
      valueType: 'option',
      key: 'option',
      render: (_, record) => [
        <Access key="update" accessible={hasPermission('system:config:update')}>
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
        <Access key="delete" accessible={hasPermission('system:config:delete')}>
          <Popconfirm title="Are you sure you want to delete?" onConfirm={() => handleDelete(record.configId)}>
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
        rowKey="configId"
        headerTitle="Parameter Configuration List"
        bordered
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        request={async (params) => {
          const { items, meta } = await listConfig({
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
            <Access key="add" accessible={hasPermission('system:config:add')}>
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
            <Access key="delete" accessible={hasPermission('system:config:delete')}>
              <Popconfirm
                title="是否确认删除？"
                disabled={!selectedRowKeys.length}
                onConfirm={() => handleDelete(selectedRowKeys.join(','))}
              >
                <Button icon={<DeleteOutlined />} type="primary" danger disabled={!selectedRowKeys.length}>
                  删除
                </Button>
              </Popconfirm>
            </Access>,
            <Access key="cache" accessible={hasPermission('system:config:delete')}>
              <Button
                icon={<RedoOutlined spin={refreshConfigCacheLoading} />}
                type="primary"
                danger
                onClick={runRefreshConfigCache}
              >
                刷新缓存
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

export default Config
