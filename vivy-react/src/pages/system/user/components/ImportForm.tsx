import { DownloadOutlined } from '@ant-design/icons'
import { type ModalFormProps, type ProFormInstance, ModalForm, ProFormUploadDragger } from '@ant-design/pro-components'
import { useRequest } from '@umijs/max'
import { Button, UploadFile } from 'antd'
import { saveAs } from 'file-saver'
import { useRef } from 'react'
import { exportUserTemplate, importUserList } from '@/apis/system/user'

const ImportForm: React.FC<ModalFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>()

  /**
   * 导出用户模板
   */
  const { loading: loadingExport, run: runExportUserTemplate } = useRequest(exportUserTemplate, {
    manual: true,
    onSuccess({ data }) {
      saveAs(data, `User Import Template.xlsx`)
    },
  })

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: { files: UploadFile[] }) => {
    const data = new FormData()
    data.set('file', values.files[0].originFileObj!)
    await importUserList(data)
    formRef.current?.resetFields()
  }

  return (
    <ModalForm
      {...props}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      formRef={formRef}
      title="User Import"
      onFinish={async (values: any) => {
        await handleSubmit(values)
        props.onFinish?.(values)
        return true
      }}
    >
      <Button
        type="link"
        danger
        icon={<DownloadOutlined />}
        loading={loadingExport}
        onClick={() => {
          runExportUserTemplate()
        }}
      >
        Download Template
      </Button>
      <ProFormUploadDragger
        name="files"
        description="Only xls and xlsx format files are allowed for import"
        required
        rules={[{ required: true, message: 'Please upload xls or xlsx format files' }]}
        fieldProps={{ multiple: false, maxCount: 1, accept: '.xls, .xlsx' }}
      />
    </ModalForm>
  )
}

export default ImportForm
