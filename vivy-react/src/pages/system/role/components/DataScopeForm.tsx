import {
  type DrawerFormProps,
  type ProFormInstance,
  DrawerForm,
  ProFormText,
  ProFormSelect,
  ProFormTreeSelect,
  ProFormDependency,
} from '@ant-design/pro-components'
import { useRequest } from '@umijs/max'
import { TreeSelect } from 'antd'
import { useRef } from 'react'
import { deptTreeOptions } from '@/apis/system/dept'
import { infoRole, updateDataScope } from '@/apis/system/role'
import type { UpdateDataScopeParams, RoleModel } from '@/apis/system/role'

interface DataScopeFormProps extends DrawerFormProps {
  record: RoleModel
}

const DataScopeForm: React.FC<DataScopeFormProps> = ({ record, ...props }) => {
  const formRef = useRef<ProFormInstance>()

  /**
   * 获取初始化数据
   */
  const { run: runInfoRole } = useRequest(infoRole, {
    manual: true,
    onSuccess(data) {
      formRef.current?.setFieldsValue(data)
    },
  })
  const handleInitial = () => {
    formRef.current?.resetFields()
    record && runInfoRole(record.roleId)
  }

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: UpdateDataScopeParams) => {
    await updateDataScope(record.roleId, values)
  }

  return (
    <DrawerForm
      {...props}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      formRef={formRef}
      title={`Assign Data Permissions`}
      onFinish={async (values: any) => {
        await handleSubmit(values)
        props.onFinish?.(values)
        return true
      }}
      onOpenChange={(open) => {
        open && handleInitial()
        props.onOpenChange?.(open)
      }}
    >
      <ProFormText name="roleName" label="Role Name" disabled={true} />
      <ProFormSelect
        name="dataScope"
        label="Permission Scope"
        fieldProps={{
          options: [
            { label: 'All Data Permissions', value: '1' },
            { label: 'Custom Data Permissions', value: '2' },
            { label: 'Department Data Permissions', value: '3' },
            { label: 'Department and Sub-department Data Permissions', value: '4' },
            { label: 'Personal Data Permissions Only', value: '5' },
          ],
        }}
      />
      <ProFormDependency name={['dataScope']}>
        {({ dataScope }: Record<string, string>) =>
          dataScope === '2' ? (
            <ProFormTreeSelect
              name="deptIds"
              label="Department Permissions"
              request={deptTreeOptions}
              fieldProps={{
                fieldNames: { label: 'deptName', value: 'deptId' },
                maxTagCount: 3,
                treeCheckable: true,
                showCheckedStrategy: TreeSelect.SHOW_ALL,
              }}
            />
          ) : null
        }
      </ProFormDependency>
    </DrawerForm>
  )
}

export default DataScopeForm
