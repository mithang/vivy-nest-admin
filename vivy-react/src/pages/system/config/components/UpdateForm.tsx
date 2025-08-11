import {
  type DrawerFormProps,
  type ProFormInstance,
  DrawerForm,
  ProFormText,
  ProFormTextArea,
  ProFormRadio,
} from '@ant-design/pro-components'
import { useModel, useRequest } from '@umijs/max'
import { useRef } from 'react'
import { addConfig, updateConfig, infoConfig } from '@/apis/system/config'
import type { CreateConfigParams, ConfigModel } from '@/apis/system/config'

interface UpdateFormProps extends DrawerFormProps {
  record?: ConfigModel
}

const UpdateForm: React.FC<UpdateFormProps> = ({ record, ...props }) => {
  const formRef = useRef<ProFormInstance>()

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 获取初始化数据
   */
  const { run: runInfoConfig } = useRequest(infoConfig, {
    manual: true,
    onSuccess(data) {
      formRef.current?.setFieldsValue(data)
    },
  })
  const handleInitial = () => {
    formRef.current?.resetFields()
    record && runInfoConfig(record.configId)
  }

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: CreateConfigParams) => {
    if (record) {
      await updateConfig(record.configId, values)
    } else {
      await addConfig(values)
    }
  }

  return (
    <DrawerForm
      {...props}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      formRef={formRef}
      title={record ? `Edit Parameter Configuration` : `Add Parameter Configuration`}
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
      <ProFormText
        name="configName"
        label="Parameter Name"
        rules={[{ required: true }]}
        fieldProps={{ maxLength: 100 }}
      />
      <ProFormText
        name="configKey"
        label="Parameter Key"
        rules={[{ required: true }]}
        fieldProps={{ maxLength: 100 }}
      />
      <ProFormText
        name="configValue"
        label="Parameter Value"
        rules={[{ required: true }]}
        fieldProps={{ maxLength: 500 }}
      />
      <ProFormRadio.Group
        name="status"
        label="Status"
        initialValue={'0'}
        rules={[{ required: true }]}
        fieldProps={{ options: toSelect(sysNormalDisable) }}
      />
      <ProFormTextArea name="remark" label="Remarks" fieldProps={{ maxLength: 500, showCount: true }} />
    </DrawerForm>
  )
}

export default UpdateForm
