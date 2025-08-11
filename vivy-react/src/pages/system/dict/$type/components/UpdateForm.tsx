import {
  type DrawerFormProps,
  type ProFormInstance,
  DrawerForm,
  ProFormText,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
} from '@ant-design/pro-components'
import { useModel, useParams, useRequest } from '@umijs/max'
import type { DefaultOptionType } from 'antd/es/cascader'
import { useRef } from 'react'
import { addDictData, updateDictData, infoDictData } from '@/apis/system/dict'
import type { CreateDictDataParams, DictDataModel } from '@/apis/system/dict'

const listClassOptions: DefaultOptionType[] = [
  { label: 'Default', value: 'default' },
  { label: 'Primary', value: 'primary' },
  { label: 'Success', value: 'success' },
  { label: 'Info', value: 'info' },
  { label: 'Warning', value: 'warning' },
  { label: 'Danger', value: 'danger' },
]

interface UpdateFormProps extends DrawerFormProps {
  record?: DictDataModel
}

const UpdateForm: React.FC<UpdateFormProps> = ({ record, ...props }) => {
  const formRef = useRef<ProFormInstance>()
  const { type } = useParams()

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 获取初始化数据
   */
  const { run: runInfoDictData } = useRequest(infoDictData, {
    manual: true,
    onSuccess(data) {
      formRef.current?.setFieldsValue(data)
    },
  })
  const handleInitial = () => {
    formRef.current?.resetFields()
    record && runInfoDictData(record.dictId)
  }

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: CreateDictDataParams) => {
    if (record) {
      await updateDictData(record.dictId, {
        ...values,
        dictType: type!,
      })
    } else {
      await addDictData({
        ...values,
        dictType: type!,
      })
    }
  }

  return (
    <DrawerForm
      {...props}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      formRef={formRef}
      title={record ? `Edit Dictionary` : `Add Dictionary`}
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
      <ProFormText name="dictLabel" label="Data Label" rules={[{ required: true, max: 100 }]} />
      <ProFormText name="dictValue" label="Data Value" rules={[{ required: true, max: 100 }]} />
      <ProFormDigit name="dictSort" label="Display Order" fieldProps={{ min: 0, precision: 0 }} />
      <ProFormSelect
        name="listClass"
        label="Display Style"
        fieldProps={{
          options: listClassOptions,
        }}
      />
      <ProFormText name="cssClass" label="Style Attributes" rules={[{ max: 100 }]} />
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
