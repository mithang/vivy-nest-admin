import { ProFormSelect, ProFormText } from '@ant-design/pro-components'
import type { DefaultOptionType } from 'antd/es/select'

const templateOptions: DefaultOptionType[] = [
  {
    value: '1',
    label: 'Single Table (CRUD)',
  },
  {
    value: '2',
    label: 'Tree Table (CRUD)',
    disabled: true,
  },
]

const UpdateFormBase: React.FC = () => {
  return (
    <>
      <ProFormText name="tableName" label="Table Name" rules={[{ required: true, max: 100 }]} />
      <ProFormText name="tableComment" label="Table Description" rules={[{ required: true, max: 100 }]} />
      <ProFormText name="className" label="Entity Class Name" rules={[{ required: true, max: 100 }]} />
      <ProFormSelect
        name="templateCategory"
        label="Generation Template"
        rules={[{ required: true }]}
        options={templateOptions}
      />
      <ProFormText
        name="moduleName"
        label="Generation Module Name"
        tooltip="Can be understood as subsystem name, e.g. `system`"
        rules={[{ required: true, max: 100 }]}
      />
      <ProFormText
        name="businessName"
        label="Generation Business Name"
        tooltip="Can be understood as function English name, e.g. `user`"
        rules={[{ required: true, max: 100 }]}
      />
      <ProFormText
        name="functionName"
        label="Generation Function Name"
        tooltip="Used as code comment description, e.g. `User`"
        rules={[{ required: true, max: 100 }]}
      />
      <ProFormText name="functionAuthor" label="Generation Author Name" rules={[{ required: true, max: 100 }]} />
    </>
  )
}

export default UpdateFormBase
