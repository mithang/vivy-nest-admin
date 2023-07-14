import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import { useModel, Access, useAccess } from '@umijs/max';
import { DictTag } from '@/components/Dict';
import UpdateForm from './components/UpdateForm';
import { listRole, deleteRole } from '@/apis/system/role';
import type { SysRole } from '@/apis/types/system/role';

const Role = () => {
  const { hasPermission } = useAccess();
  const actionRef = useRef<ActionType>();
  const [updateOpen, setUpdateOpen] = useState(false);
  const [recordData, setRecordData] = useState<Nullable<SysRole>>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict');
  const sysNormalDisable = loadDict('sys_normal_disable');

  /**
   * 删除角色
   * @param roleIds 角色ID
   */
  const handleDelete = async (roleIds: React.Key) => {
    await deleteRole(roleIds);
    setSelectedRowKeys([]);
    actionRef.current?.reload();
  };

  /**
   * 表格列配置
   */
  const columns: ProColumns<SysRole>[] = [
    {
      title: '角色编号',
      dataIndex: 'roleId',
      search: false,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '权限字符',
      dataIndex: 'roleCode',
    },
    {
      title: '显示顺序',
      dataIndex: 'roleSort',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      fieldProps: { options: toSelect(sysNormalDisable) },
      render: (_, record) => {
        return <DictTag options={sysNormalDisable} value={record.status} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_, record) => [
        <Access key="admin" accessible={record.roleId !== 1}>
          <Access key="update" accessible={hasPermission('system:role:update')}>
            <Button
              type="link"
              onClick={() => {
                setRecordData(record);
                setUpdateOpen(true);
              }}
            >
              编辑
            </Button>
          </Access>
          <Access key="delete" accessible={hasPermission('system:role:delete')}>
            <Popconfirm title="是否确认删除？" onConfirm={() => handleDelete(record.roleId)}>
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </Access>
        </Access>,
      ],
    },
  ];

  return (
    <>
      <ProTable
        rowKey="roleId"
        headerTitle="角色列表"
        bordered
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
          getCheckboxProps(record) {
            return {
              disabled: record.roleId === 1,
            };
          },
        }}
        request={async (params) => {
          const { items, meta } = await listRole({
            ...params,
            page: params.current,
            limit: params.pageSize,
          });
          return {
            data: items,
            total: meta.totalItems,
          };
        }}
        toolbar={{
          actions: [
            <Access key="add" accessible={hasPermission('system:role:add')}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setRecordData(null);
                  setUpdateOpen(true);
                }}
              >
                新增
              </Button>
            </Access>,
            <Access key="delete" accessible={hasPermission('system:role:delete')}>
              <Popconfirm
                title="是否确认删除？"
                disabled={!selectedRowKeys.length}
                onConfirm={() => handleDelete(selectedRowKeys.join(','))}
              >
                <Button
                  icon={<DeleteOutlined />}
                  type="primary"
                  danger
                  disabled={!selectedRowKeys.length}
                >
                  删除
                </Button>
              </Popconfirm>
            </Access>,
          ],
        }}
      />
      <UpdateForm
        record={recordData}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        onFinish={async () => actionRef.current?.reload()}
      />
    </>
  );
};

export default Role;
