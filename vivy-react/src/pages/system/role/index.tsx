import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useModel, Access, useAccess } from '@umijs/max'
import { Button, Popconfirm } from 'antd'
import { useRef, useState } from 'react'
import { listRole, deleteRole } from '@/apis/system/role'
import type { RoleModel } from '@/apis/system/role'
import { DictTag } from '@/components/Dict'
import DataScopeForm from './components/DataScopeForm'
import UpdateForm from './components/UpdateForm'

const Role = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>()
  const [record, setRecord] = useState<RoleModel>()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [dataScopeOpen, setDataScopeOpen] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  /**
   * Register dictionary data
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * Delete role
   * @param roleIds Role ID
   */
  const handleDelete = async (roleIds: number | string) => {
    await deleteRole(roleIds)
    setSelectedRowKeys([])
    actionRef.current?.reload()
  }

  /**
   * Table column configuration
   */
  const columns: ProColumns<RoleModel>[] = [
    {
      title: 'Role ID',
      dataIndex: 'roleId',
      search: false,
    },
    {
      title: 'Role Name',
      dataIndex: 'roleName',
    },
    {
      title: 'Permission Character',
      dataIndex: 'roleCode',
    },
    {
      title: 'Display Order',
      dataIndex: 'roleSort',
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
      title: 'Create Time',
      dataIndex: 'createTime',
      search: false,
    },
    {
      title: 'Actions',
      dataIndex: 'option',
      key: 'option',
      render: (_, record) => [
        <Access key="admin" accessible={record.roleId !== 1}>
          <Access key="update" accessible={hasPermission('system:role:update')}>
            <Button
              type="link"
              onClick={() => {
                setRecord(record)
                setUpdateOpen(true)
              }}
            >
              Edit
            </Button>
          </Access>
          <Access key="dataScope" accessible={hasPermission('system:role:update')}>
            <Button
              type="link"
              onClick={() => {
                setRecord(record)
                setDataScopeOpen(true)
              }}
            >
              Data Permission
            </Button>
          </Access>
          <Access key="delete" accessible={hasPermission('system:role:delete')}>
            <Popconfirm title="Are you sure to delete?" onConfirm={() => handleDelete(record.roleId)}>
              <Button type="link">Delete</Button>
            </Popconfirm>
          </Access>
        </Access>,
      ],
    },
  ]

  return (
    <>
      <ProTable<RoleModel>
        headerTitle="Role List"
        bordered
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
          getCheckboxProps(record) {
            return {
              disabled: record.roleId === 1,
            }
          },
        }}
        request={async (params) => {
          const { items, meta } = await listRole({
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
            <Access key="add" accessible={hasPermission('system:role:add')}>
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
            <Access key="delete" accessible={hasPermission('system:role:delete')}>
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
        toolBarRender={() => [
          <Access key="add" accessible={hasPermission('system:role:add')}>
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
        ]}
        tableAlertOptionRender={() => [
          <Popconfirm
            key="batchDelete"
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(selectedRowKeys.join(','))}
          >
            <Button type="link" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>,
        ]}
      />

      <UpdateForm
        record={record}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        onFinish={async () => actionRef.current?.reload()}
      />

      <DataScopeForm
        record={record!}
        open={dataScopeOpen}
        onOpenChange={setDataScopeOpen}
        onFinish={async () => actionRef.current?.reload()}
      />
    </>
  )
}

export default Role
