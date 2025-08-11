import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useModel, Access, useAccess } from '@umijs/max'
import { Button, Popconfirm } from 'antd'
import { isEmpty } from 'lodash-es'
import { useRef, useState } from 'react'
import { treeMenu, deleteMenu } from '@/apis/system/menu'
import type { MenuTreeResult } from '@/apis/system/menu'
import { DictTag } from '@/components/Dict'
import { eachTree } from '@/utils/tree'
import UpdateForm from './components/UpdateForm'

const Menu = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>()
  const [record, setRecord] = useState<MenuTreeResult>()
  const [updateOpen, setUpdateOpen] = useState(false)

  /**
   * 注册字典数据
   */
  const { loadDict } = useModel('dict')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 删除部门
   * @param deptId 部门ID
   */
  const handleDelete = async (deptId: number) => {
    await deleteMenu(deptId)
    actionRef.current?.reload()
  }

  /**
   * 表格列配置
   */
  const columns: ProColumns<MenuTreeResult>[] = [
    {
      title: 'Menu Name',
      dataIndex: 'menuName',
    },
    {
      title: 'Menu Icon',
      dataIndex: 'icon',
      search: false,
    },
    {
      title: 'Display Order',
      dataIndex: 'menuSort',
      search: false,
    },
    {
      title: 'Permission Identifier',
      dataIndex: 'permission',
      search: false,
    },
    {
      title: 'Component Path',
      dataIndex: 'component',
      search: false,
    },
    {
      title: 'Status',
      dataIndex: 'status',
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
        <Access key="update" accessible={hasPermission('system:menu:update')}>
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
        <Access key="delete" accessible={hasPermission('system:menu:delete')}>
          <Popconfirm title="Are you sure you want to delete?" onConfirm={() => handleDelete(record.menuId)}>
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
        rowKey="menuId"
        headerTitle="Menu List"
        bordered
        search={false}
        columns={columns}
        actionRef={actionRef}
        request={async () => {
          const data = await treeMenu()
          eachTree<MenuTreeResult>(data, (item) => {
            if (isEmpty(item.children)) item.children = undefined
          })
          return {
            data,
          }
        }}
        toolbar={{
          actions: [
            <Access key="add" accessible={hasPermission('system:menu:add')}>
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

export default Menu
