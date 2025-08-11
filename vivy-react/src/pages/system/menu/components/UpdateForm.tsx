import { AppstoreOutlined } from '@ant-design/icons'
import {
  type DrawerFormProps,
  type ProFormInstance,
  DrawerForm,
  ProFormText,
  ProFormDigit,
  ProFormTreeSelect,
  ProFormRadio,
  ProFormDependency,
} from '@ant-design/pro-components'
import { useModel, useRequest } from '@umijs/max'
import { useRef } from 'react'
import { addMenu, updateMenu, infoMenu, menuTreeOptions } from '@/apis/system/menu'
import type { CreateMenuParams, MenuTreeResult } from '@/apis/system/menu'
import { IconPicker } from '@/components/Icon'

type MenuType = { label: string; value: 'M' | 'C' | 'F' }
const menuTypeOptions: MenuType[] = [
  { label: 'Directory', value: 'M' },
  { label: 'Menu', value: 'C' },
  { label: 'Button', value: 'F' },
]

interface UpdateFormProps extends DrawerFormProps {
  record?: MenuTreeResult
}

const UpdateForm: React.FC<UpdateFormProps> = ({ record, ...props }) => {
  const formRef = useRef<ProFormInstance>()

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysYesNo = loadDict('sys_yes_no')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 获取初始化数据
   */
  const { run: runInfoMenu } = useRequest(infoMenu, {
    manual: true,
    onSuccess(data) {
      formRef.current?.setFieldsValue({
        ...data,
        parentId: data.parentId || undefined,
      })
    },
  })
  const handleInitial = () => {
    formRef.current?.resetFields()
    record && runInfoMenu(record.menuId)
  }

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: CreateMenuParams) => {
    if (record) {
      await updateMenu(record.menuId, values)
    } else {
      await addMenu(values)
    }
  }

  return (
    <DrawerForm
      {...props}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      formRef={formRef}
      title={record ? `Edit Menu` : `Add Menu`}
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
      <ProFormTreeSelect
        name="parentId"
        label="Parent Menu"
        request={menuTreeOptions}
        fieldProps={{
          fieldNames: { label: 'menuName', value: 'menuId' },
        }}
      />
      <ProFormRadio.Group
        name="menuType"
        label="Menu Type"
        rules={[{ required: true }]}
        radioType="button"
        fieldProps={{
          options: menuTypeOptions,
        }}
      />
      <ProFormText name="menuName" label="Menu Name" rules={[{ required: true, max: 50 }]} />
      <ProFormDigit name="menuSort" label="Display Order" fieldProps={{ min: 0, precision: 0 }} />
      <ProFormDependency name={['menuType']}>
        {({ menuType }: Record<string, MenuType['value']>) => (
          <>
            {/* 目录、菜单 */}
            {menuType === 'M' || menuType === 'C' ? (
              <ProFormText
                name="icon"
                label="Menu Icon"
                rules={[{ max: 100 }]}
                fieldProps={{
                  addonBefore: (
                    <IconPicker
                      onChange={(value) => {
                        formRef.current?.setFieldValue('icon', value)
                      }}
                    >
                      <AppstoreOutlined />
                    </IconPicker>
                  ),
                }}
              />
            ) : null}
            {/* 目录、菜单 */}
            {menuType === 'M' || menuType === 'C' ? (
              <ProFormText
                name="path"
                label="Route Address"
                tooltip="The route address to access, such as: `user`. For external links that need to be accessed internally, start with `http(s)://`"
                rules={[{ max: 255 }]}
              />
            ) : null}
            {/* 菜单 */}
            {menuType === 'C' ? (
              <ProFormText
                name="component"
                label="Component Path"
                tooltip="The component path to access, such as: `system/user/index`, defaults to the `pages` directory"
                rules={[{ max: 255 }]}
              />
            ) : null}
            {/* 菜单 */}
            {menuType === 'C' ? (
              <ProFormText
                name="query"
                label="Route Parameters"
                tooltip='Default parameters passed when accessing the route, such as: `{"id": 1, "name": "vivy"}`'
                rules={[{ max: 255 }]}
              />
            ) : null}
            {/* 菜单、按钮 */}
            {menuType === 'C' || menuType === 'F' ? (
              <ProFormText
                name="permission"
                label="Permission Character"
                tooltip="Permission character defined in the controller, such as: @RequirePermissions('system:operlog:remove')"
                rules={[{ max: 100 }]}
              />
            ) : null}
            {/* 目录、菜单 */}
            {menuType === 'M' || menuType === 'C' ? (
              <ProFormRadio.Group
                name="isVisible"
                label="Is Visible"
                tooltip="If hidden is selected, the route will not appear in the sidebar, but can still be accessed"
                initialValue={'1'}
                fieldProps={{ options: toSelect(sysYesNo) }}
              />
            ) : null}
            {/* 菜单 */}
            {menuType === 'C' ? (
              <ProFormRadio.Group
                name="isLink"
                label="Is External Link"
                tooltip="If external link is selected, the route address needs to start with `http(s)://`"
                initialValue={'0'}
                fieldProps={{ options: toSelect(sysYesNo) }}
              />
            ) : null}
            {/* 菜单 */}
            {menuType === 'C' ? (
              <ProFormRadio.Group
                name="isFrame"
                label="Is Embedded"
                tooltip="If embedded is selected, the route address needs to start with `http(s)://`"
                initialValue={'0'}
                fieldProps={{ options: toSelect(sysYesNo) }}
              />
            ) : null}
            {/* 菜单 */}
            {menuType === 'C' ? (
              <ProFormRadio.Group
                name="isCache"
                label="Is Cached"
                tooltip="If selected, it will be cached by `keep-alive`, and the component's `name` needs to match the address"
                initialValue={'0'}
                fieldProps={{ options: toSelect(sysYesNo) }}
              />
            ) : null}
          </>
        )}
      </ProFormDependency>
      <ProFormRadio.Group
        name="status"
        label="Status"
        initialValue={'0'}
        fieldProps={{ options: toSelect(sysNormalDisable) }}
      />
    </DrawerForm>
  )
}

export default UpdateForm
